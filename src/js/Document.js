"use strict";

// Singleton Document,
// exists exactly once in each window renderer process.

var remote          = require('electron').remote
  , fs              = require('fs')
  , promisify          = require('util').promisify
  , getDataDirFileName = require('./Exporter').getDataDirFileName
  ;

var md       = ""
  , yaml     = ""
  , bodyMd   = ""
  , meta     = {}
  , html     = ""
  , filePath = remote.getCurrentWindow().filePathToLoad
  ;


/*
 * Setters
 */

module.exports.setDoc = function(mdStr, yamlStr, bodyMdStr, metaObj) {
  md     = mdStr;
  yaml   = yamlStr;
  bodyMd = bodyMdStr;
  meta   = metaObj;
}

module.exports.setHtml = function(htmlStr) {
  html = htmlStr;
}

module.exports.setPath = function(path) {
  filePath = path;
}


/*
 * Getters
 */

module.exports.getDoc = function() {
  return {
    md:     md
  , yaml:   yaml
  , bodyMd: bodyMd
  , meta:   meta
  , html:   html
  };
}

module.exports.getMd = function() {
  return md;
}

module.exports.getMeta = function() {
  return meta;
}

module.exports.getHtml = function() {
  return html;
}

module.exports.getBodyMd = function() {
  return bodyMd;
}

module.exports.getNrOfYamlLines = function() {
  if (yaml.length === 0) {
    return 0;
  } else {
    var nrOfLines = 2;
    for(var i=0; i<yaml.length; ++i) {
      if (yaml[i] === '\n'){
        nrOfLines++;
      }
    }
    return nrOfLines;
  }
}

var defaultStaticCssLink = remote.app.getAppPath() + '/static/default.css'
  , link
  , docType = null
  ;
module.exports.getCss = async function() {
  var linkIsChanged = false;
  if (meta.type !== docType) {
    // cache css
    docType = meta.type;
    const fileName = getDataDirFileName(docType, '.css')
    try {
        await promisify(fs.access)(fileName)
        link = fileName;
    } catch (err) {
      link = defaultStaticCssLink;
    }
    linkIsChanged = true;
  }
  return [ typeof meta.style === "string" ? meta.style : ''
         , link
         , linkIsChanged
         ]
}

module.exports.getPath = function() {
  return filePath;
}
