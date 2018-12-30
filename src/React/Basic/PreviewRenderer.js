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
  , printFn
  ;

exports.printPreview = function() {
  if (printFn) {
    printFn();
  }
};

ipcRenderer.on('filePrint', exports.printPreview);

exports.renderMd = function(isPaginated) {
  return function() {
    needsRerender = true;
    paginated = isPaginated;
    renderNext();
  }
};

// buffers the latest text change and renders when previous rendering is done
function renderNext() {
  if (needsRerender && !renderInProgress) {
    renderInProgress = true;
    render()
      .catch( function(e) {
        console.warn("renderer crashed", e.message);
      })
      .then(function(printCb){
        renderInProgress = false;
        printFn = printCb
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
