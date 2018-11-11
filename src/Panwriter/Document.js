"use strict";

var Document = require('../../src/js/Document')
  , jsYaml   = require('js-yaml')
  ;

// from https://github.com/dworthen/js-yaml-front-matter/blob/master/src/index.js#L14
var yamlFrontRe = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/;


exports.getDocument = Document.getDoc;

exports.updateDocument = function(mdStr) {
  return function() {
    var yamlStr = ''
      , bodyStr = mdStr
      , metaObj = {}
      , yaml
      , results = yamlFrontRe.exec(mdStr)
      ;
    try {
      if (yaml = results[2]) {
        var meta = jsYaml.safeLoad(yaml);
        if (typeof meta === 'object' && !(meta instanceof Array) ) {
          yamlStr = yaml
          bodyStr = results[3] || '';
          metaObj = meta
        } else {
          console.warn("YAML wasn't an object");
        }
      }
    } catch(e) {
      console.warn("Could not parse YAML", e.message);
    }
    Document.setDoc(mdStr, yamlStr, bodyStr, metaObj);
  }
}
