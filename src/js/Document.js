"use strict";

// Singleton Document,
// exists exactly once in each window renderer process.

var remote          = require('electron').remote
  , fs              = require('fs')
  , promisify          = require('util').promisify
  , getDataDirFileName = require('./Exporter').getDataDirFileName
  , { parseToTemplate, interpolateTemplate, extractDefaultVars } = require('./templates')
  ;

var md       = ""
  , yaml     = ""
  , bodyMd   = ""
  , meta     = {}
  , html     = ""
  , filePath = remote.getCurrentWindow().filePathToLoad
  ;

if (filePath) {
  addToRecentFiles(filePath);
}

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

module.exports.setMeta = function(metaObj) {
  meta = metaObj;
}

module.exports.setPath = function(path) {
  filePath = path;
  addToRecentFiles(filePath);
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

const appPath = remote.app.getAppPath()
    , template = parseToTemplate( fs.readFileSync(appPath + '/static/preview.pandoc-styles.css', 'utf-8') )
    , defaultStaticCssLink = appPath + '/static/preview.panwriter-default.css'
    ;
let link = undefined
  , docType = null
  ;
module.exports.defaultVars = extractDefaultVars(template);
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

  const cssStr = interpolateTemplate(template, meta);
  return [cssStr, link, linkIsChanged]
}

module.exports.getPath = function() {
  return filePath;
}


/*
 * Private
 */

function addToRecentFiles(filePath) {
  var recents = JSON.parse( localStorage.getItem('recentFiles') )
  if (recents instanceof Array) {
    recents = recents.filter(f => f !== filePath)
  } else {
    recents = [];
  }
  recents.unshift(filePath);
  recents = recents.slice(0, 15);
  localStorage.setItem('recentFiles', JSON.stringify(recents));
}
