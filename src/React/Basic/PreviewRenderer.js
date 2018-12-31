"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , Document    = require('../../src/js/Document')
  , Renderers   = require('../../src/js/Renderers')
  , mdItPandoc  = require('markdown-it-pandoc')()
  ;

var renderInProgress = false
  , needsRerender = false
  , paginated = false
  , previewDiv
  , scrollMap
  , frameWindow
  ;

exports.printPreview = function() {
  if (frameWindow) {
    frameWindow.print();
  }
};

ipcRenderer.on('filePrint', exports.printPreview);

exports.scrollPreview = function(scrollTop) {
  return function(editor) {
    return function() {
      if (frameWindow) {
        if (!scrollMap) {
          var editorOffset = parseInt(window.getComputedStyle(
                               document.querySelector('.CodeMirror-lines')
                             ).getPropertyValue('padding-top'), 10)
          buildScrollMap(editor, editorOffset);
        }
        frameWindow.scrollTo(0, scrollMap[scrollTop]);
      }
    };
  };
};

exports.renderMd = function(isPaginated) {
  return function() {
    console.log("renderMd")
    needsRerender = true;
    paginated = isPaginated;
    renderNext();
  }
};

function buildScrollMap(editor, editorOffset) {
  // scrollMap maps source-editor-line-offsets to preview-element-offsets
  // (offset is the number of vertical pixels from the top)
  scrollMap = [];
  scrollMap[0] = 0;

  // lineOffsets[i] holds top-offset of line i in the source editor
  var lineOffsets = [undefined, 0]
    , knownLineOffsets = []
    , offsetSum = 0
    ;
  editor.eachLine( function(line) {
    offsetSum += line.height;
    lineOffsets.push(offsetSum);
  });

  var lastEl;
  frameWindow.document.querySelectorAll('body > [data-source-line]').forEach( function(el){
    // for each element in the preview with source annotation
    var line = parseInt(el.getAttribute('data-source-line'), 10)
      , lineOffset = lineOffsets[line]
      ;
    // fill in the target offset for the corresponding editor line
    scrollMap[lineOffset] = el.offsetTop - editorOffset;
    knownLineOffsets.push(lineOffset)

    lastEl = el;
  });
  if (lastEl) {
    scrollMap[offsetSum] = lastEl.offsetTop + lastEl.offsetHeight;
    knownLineOffsets.push(offsetSum);
  }

  // fill in the blanks by interpolating between the two closest known line offsets
  var j = 0;
  for (var i=1; i < offsetSum; i++) {
    if (scrollMap[i] === undefined) {
      var a = knownLineOffsets[j]
        , b = knownLineOffsets[j + 1]
        ;
      scrollMap[i] = Math.round(( scrollMap[b]*(i - a) + scrollMap[a]*(b - i) ) / (b - a));
    } else {
      j++;
    }
  }
}

function resetScrollMap () {
  console.log("reset")
  scrollMap = undefined;
}

// buffers the latest text change and renders when previous rendering is done
function renderNext() {
  if (needsRerender && !renderInProgress) {
    renderInProgress = true;
    render()
      .catch( function(e) {
        console.warn("renderer crashed", e.message);
      })
      .then(function(contentWindow){
        renderInProgress = false;
        frameWindow = contentWindow
        frameWindow.addEventListener("resize", resetScrollMap);
        resetScrollMap();
        renderNext();
      });
    needsRerender = false;
  }
}

function mdItSourceMap(nrLinesOffset) {
  if (nrLinesOffset === undefined) {
    nrLinesOffset = 1;
  }
  return function(md) {
    var temp = md.renderer.renderToken.bind(md.renderer)
    md.renderer.renderToken = function (tokens, idx, options) {
      var token = tokens[idx]
      if (token.level === 0 && token.map !== null && token.type.endsWith('_open')) {
        token.attrPush(['data-source-line', token.map[0] + nrLinesOffset])
      }
      return temp(tokens, idx, options)
    }
  }
}

// takes a markdown str, renders it to preview and to Document.setHTML
async function render() {
  var htmlStr = mdItPandoc
        .use( mdItSourceMap(1 + Document.getNrOfYamlLines()) )
        .render( Document.getBodyMd() )
        ;
  Document.setHtml(htmlStr);

  if (previewDiv) {
    if (paginated) {
      return Renderers.pagedjs(Document, previewDiv)
    } else {
      return Renderers.plain(Document, previewDiv)
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  previewDiv = document.querySelector('.previewDiv');
});
