"use strict";

// Singleton Document,
// exists exactly once in each window renderer process.

var md   = ""
  , html = ""
  , meta = {}
  ;

module.exports.setDoc = function(mdStr, htmlStr, metaObj) {
  md   = mdStr;
  html = htmlStr;
  meta = metaObj;
}

module.exports.getMd = function() {
  return md;
}

module.exports.getHtml = function() {
  return html;
}

module.exports.getMeta = function() {
  return meta;
}

module.exports.getCss = function() {
  return (typeof meta.style === "string") ? meta.style : "";
}