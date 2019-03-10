"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , Document    = require('../../src/js/Document')
  , Renderers   = require('../../src/js/Renderers')
  , mdItPandoc  = require('markdown-it-pandoc')()
  , throttle    = require('../../src/js/throttle').throttle
  ;

var renderInProgress = false
  , needsRerender = false
  , paginated = false
  , previewDiv
  , editor
  , editorOffset = 0
  , scrollEditorFn
  , scrollMap
  , reverseScrollMap
  , frameWindow
  , scrollSyncTimeout // shared between scrollPreview and scrollEditor
  ;

exports.printPreview = function() {
  if (frameWindow) {
    frameWindow.print();
  }
};

ipcRenderer.on('filePrint', exports.printPreview);

exports.clearPreview = function() {
  frameWindow = undefined;
}

exports.scrollPreview = throttle( function() {
  if (frameWindow) {
    if (!scrollMap) {
      buildScrollMap(editor, editorOffset);
    }
    var scrollTop = Math.round(editor.getScrollInfo().top)
      , scrollTo = scrollMap[scrollTop]
      ;
    if (scrollTo !== undefined && frameWindow) {
      frameWindow.scrollTo(0, scrollTo);
    }
  }
}, 30, scrollSyncTimeout);

exports.registerScrollEditorImpl = function(ed) {
  editor = ed;
  editorOffset = parseInt(window.getComputedStyle(
                    document.querySelector('.CodeMirror-lines')
                  ).getPropertyValue('padding-top'), 10)
  var editorScrollFrame = document.querySelector('.CodeMirror-scroll')

  scrollEditorFn = throttle( function(e) {
    e.preventDefault();
    if (frameWindow !== undefined) {
      if (!reverseScrollMap) {
        buildScrollMap(editor, editorOffset);
      }
      for (var i=frameWindow.scrollY; i>=0; i--) {
        if (reverseScrollMap[i] !== undefined) {
          editorScrollFrame.scrollTo(0, reverseScrollMap[i])
          break;
        }
      }
    }
  }, 30, scrollSyncTimeout);
}

exports.renderMd = function(isPaginated) {
  return function() {
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
  reverseScrollMap = [];

  // lineOffsets[i] holds top-offset of line i in the source editor
  var lineOffsets = [undefined, 0]
    , knownLineOffsets = []
    , offsetSum = 0
    ;
  editor.eachLine( function(line) {
    offsetSum += line.height;
    lineOffsets.push(offsetSum);
  });

  var lastEl
    , selector = paginated ? '.pagedjs_page_content [data-source-line]'
                           : 'body > [data-source-line]'
    ;
  frameWindow.document.querySelectorAll(selector).forEach( function(el){
    // for each element in the preview with source annotation
    var line = parseInt(el.getAttribute('data-source-line'), 10)
      , lineOffset = lineOffsets[line]
      , elOffset = Math.round(el.getBoundingClientRect().top + frameWindow.scrollY);
      ;
    // fill in the target offset for the corresponding editor line
    if (scrollMap[lineOffset] === undefined) {
      // after pagination, we can have two elements in the preview
      // that have the same source line. We only use the first.
      scrollMap[lineOffset] = elOffset - editorOffset;
      knownLineOffsets.push(lineOffset)
    }

    lastEl = el;
  });
  if (lastEl) {
    scrollMap[offsetSum] = Math.ceil(lastEl.getBoundingClientRect().bottom + frameWindow.scrollY);
    knownLineOffsets.push(offsetSum);
  }

  if (knownLineOffsets[0] !== 0) {
    // make sure line zero is in the list, to guarantee a smooth scrolling start
    knownLineOffsets.unshift(0);
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
    reverseScrollMap[ scrollMap[i] ] = i;
  }
}

function resetScrollMaps () {
  scrollMap = undefined;
  reverseScrollMap = undefined;
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
        resetScrollMaps();
        frameWindow = contentWindow
        if (frameWindow) {
          frameWindow.addEventListener("resize", resetScrollMaps);
          if (scrollEditorFn) {
            frameWindow.addEventListener("scroll", scrollEditorFn);
          }
        }
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
