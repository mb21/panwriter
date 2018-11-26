"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , Document    = require('../../src/js/Document')
  , md          = require('markdown-it-pandoc')()
  ;

var renderInProgress = false
  , needsRerender = false
  , paginated = false
  , previewWindow
  ;

exports.printPreview = function() {
  if (previewWindow) {
    previewWindow.print();
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
        console.warn("paged.js crashed", e.message);
      })
      .then(function(){
        renderInProgress = false;
        renderNext();
      });
    needsRerender = false;
  }
}

// takes a markdown str, renders it to preview and sets Document
function render() {
  var htmlStr = md.render( Document.getBodyMd() );
  Document.setHtml(htmlStr);

  // call paged.js
  return previewWindow ? previewWindow.render(Document, paginated)
                       : Promise.resolve();
}

// do initial render when iframe is ready
document.addEventListener("DOMContentLoaded", function() {
  var iframe = document.querySelector('.previewFrame');
  iframe.addEventListener("load", function() {
    previewWindow = iframe.contentWindow;
    previewWindow.render(Document, paginated);
  });
});
