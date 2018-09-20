"use strict";

var parser   = new require("commonmark").Parser();
var renderer = new require("commonmark-react-renderer")();

exports.renderMd = function(md) {
  var ast = parser.parse(md);
  return renderer.render(ast);
};