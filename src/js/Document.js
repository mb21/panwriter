"use strict";

// Singleton Document,
// exists exactly once in each window renderer process.

var remote = require('electron').remote

var md   = ""
  , html = ""
  , meta = {}
  , filePath = remote.getCurrentWindow().filePathToLoad
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

module.exports.getPath = function() {
  return filePath;
}

module.exports.setPath = function(path) {
  filePath = path;
}