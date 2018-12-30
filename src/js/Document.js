"use strict";

// Singleton Document,
// exists exactly once in each window renderer process.

var remote          = require('electron').remote
  , fs              = require('fs')
  , readDataDirFile = require('./Exporter').readDataDirFile
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

var defaultStaticCss = ''
  , defaultCss = ''
  , docType = null
  ;
fs.readFile(remote.app.getAppPath() + '/static/default.css', 'utf8', (err, css) => {
  if (err) {
    console.warn(err.message)
  } else {
    defaultStaticCss = css;
  }
});
module.exports.getCss = async function() {
  if (meta.type !== docType) {
    // cache css
    docType = meta.type;
    try {
      defaultCss = await readDataDirFile(docType, '.css');
    } catch(e) {
      defaultCss = defaultStaticCss;
    }
  }
  return ( typeof meta.style === "string" )
           ? (defaultCss + meta.style)
           : defaultCss
           ;
}

module.exports.getPath = function() {
  return filePath;
}
