"use strict";

var md = require('markdown-it')()
           .use(require('markdown-it-container'), 'dynamic', {
                // see https://github.com/markdown-it/markdown-it-container/issues/23
                validate: function() { return true; },
                render: function(tokens, idx) {
                  var token = tokens[idx];
                  if (token.nesting === 1) {
                    return '<div class="' + token.info.trim() + '">';
                  } else {
                    return '</div>';
                  }
                }
              })
  , yamlFront = require('yaml-front-matter')
  ;

var css = ""
  , htmlText = ""
  , renderInProgress = false
  , textToRenderNext = null
  , previewWindow
  ;

exports.printPreview = function() {
  if (previewWindow) {
    previewWindow.print();
  }
};

exports.renderMd = function(str) {
  return function() {
    textToRenderNext = str;
    renderNext();
  }
};

// buffers the latest text change and renders when previous rendering is done
function renderNext() {
  if (textToRenderNext !== null && !renderInProgress) {
    renderInProgress = true;
    render(textToRenderNext).then( function() {
      renderInProgress = false;
      renderNext();
    });
    textToRenderNext = null;
  }
}

// takes a markdown str and renders it to preview
function render(str) {
  var meta;
  try {
    meta = yamlFront.safeLoadFront(str)
  } catch (e) {
    meta = {__content: str};
  }
  css = typeof meta.style === "string" ? meta.style : ""

  htmlText = md.render(meta.__content);

  // call paged.js
  return previewWindow ? previewWindow.render(htmlText, css)
                       : Promise.resolve();
}

// do initial render when iframe is ready
document.addEventListener("DOMContentLoaded", function() {
  var iframe = document.querySelector('.previewFrame');
  iframe.addEventListener("load", function() {
    previewWindow = iframe.contentWindow;
    previewWindow.render(htmlText, css);
  });
});