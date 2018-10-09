"use strict";

var parser   = new require("commonmark").Parser();
var renderer = new require("commonmark-react-renderer")();
var yamlFront = require('yaml-front-matter');

var css = "";

exports.renderMd = function(md) {
  var meta;
  try {
    meta = yamlFront.safeLoadFront(md)
  } catch (e) {
    meta = {__content: md};
  }
  css = typeof meta.css === "string" ? meta.css : ""

  // body
  var ast = parser.parse(meta.__content)
    , els = renderer.render(ast)
    ;
  
  // delete meta.__content;

  return els;
};

document.addEventListener("DOMContentLoaded", function() {
  var iframe   = document.querySelector('.previewFrame');
  var content  = document.querySelector('.htmlEls');

  iframe.addEventListener("load", function() {
    var render = iframe.contentWindow.render;
    render(content, css);
    document.querySelector('textarea').addEventListener('input', function(e) {
      setTimeout(function(){
        render(content, css);
      }, 0);
    });
  });
});