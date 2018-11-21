"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , Document    = require('../../src/js/Document')
  , katex       = require('katex')
  ;
var md = require('markdown-it')()
           .use( require('markdown-it-bracketed-spans') )
           // TODO: sanitize attrs (at least keys with `on*` and vals with `javascript:*`, see https://github.com/arve0/markdown-it-attrs#security
           .use( require('markdown-it-attrs') )
           .use( require('markdown-it-container'), 'dynamic', {
                // adapted from https://github.com/markdown-it/markdown-it-container/issues/23
                validate: function() { return true; },
                render: function(tokens, idx, options, env, slf) {
                  var token     = tokens[idx]
                    , className = token.info.trim()
                    , renderedAttrs = slf.renderAttrs(token)
                    ;
                  if (token.nesting === 1) {
                    return (className && className !== '{}')
                             ? '<div class="' + className + '">'
                             : '<div' + renderedAttrs + '>'
                             ;
                  } else {
                    return '</div>';
                  }
                }
              })
           .use( require('markdown-it-deflist') )
           .use( require('markdown-it-footnote') )
           .use( require('markdown-it-implicit-figures'), {figcaption: true} )
           .use( require('markdown-it-sub') )
           .use( require('markdown-it-sup') )
           .use( require('markdown-it-texmath').use(katex) )
  ;

var renderInProgress = false
  , needsRerender = false
  , paginated = true
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
