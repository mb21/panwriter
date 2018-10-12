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
  , content = ""
  , previewWindow
  ;

exports.renderMd = function(str) {
  return function() {
    var meta;
    try {
      meta = yamlFront.safeLoadFront(str)
    } catch (e) {
      meta = {__content: str};
    }
    css = typeof meta.css === "string" ? meta.css : ""

    content = md.render(meta.__content);

    // call paged.js
    if (previewWindow) {
      previewWindow.render(content, css);
    }
  }
};

exports.printPreview = function() {
  if (previewWindow) {
    previewWindow.print();
  }
};

document.addEventListener("DOMContentLoaded", function() {
  var iframe   = document.querySelector('.previewFrame');

  iframe.addEventListener("load", function() {
    previewWindow = iframe.contentWindow;
    previewWindow.render(content, css);
  });
});