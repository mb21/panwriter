"use strict";

var parser   = new require("commonmark").Parser();
var renderer = new require("commonmark-react-renderer")();
var yamlFront = require('yaml-front-matter');

exports.renderMd = function(md) {
  var results;
  try {
    results = yamlFront.safeLoadFront(md)
  } catch (e) {
    results = {__content: md};
  }
  var ast = parser.parse(results.__content)
    , els = renderer.render(ast)
    ;
  // delete results.__content;
  return els;
};