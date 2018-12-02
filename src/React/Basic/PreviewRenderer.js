"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , Document    = require('../../src/js/Document')
  , Renderers   = require('../../src/js/Renderers')
  , md          = require('markdown-it-pandoc')()
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

// takes a markdown str, renders it to preview and sets Document
async function render() {
  var htmlStr = md.render( Document.getBodyMd() );
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
