import jsYaml from 'js-yaml'
import { Meta } from '../appState/AppState';

// from https://github.com/dworthen/js-yaml-front-matter/blob/master/src/index.js#L14
const yamlFrontRe = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/;

export const parseYaml = (md: string) => {
  var yamlStr = ''
    , bodyMd = md
    , meta: Meta = {}
    , yaml
    , results = yamlFrontRe.exec(md)
    ;
  try {
    yaml = results?.[2]
    if (yaml) {
      const metaObj = jsYaml.safeLoad(yaml, {schema: jsYaml.JSON_SCHEMA});
      if (typeof metaObj === 'object' && !(metaObj instanceof Array) ) {
        yamlStr = yaml
        bodyMd = results?.[3] || '';
        meta = metaObj as Meta
      } else {
        console.warn("YAML wasn't an object");
      }
    }
  } catch(e) {
    console.warn("Could not parse YAML", e.message);
  }
  return { yaml: yamlStr, bodyMd, meta }
}

/*
exports.setMeta = function(metaObj) {
  return function() {
    for (var key in metaObj) {
      if (metaObj[key] === '') {
        delete metaObj[key]
      }
    }
    Document.setMeta(metaObj)
  }
}

exports.writeMetaToDoc = function() {
  var metaObj = Document.getMeta();
  var bodyStr = Document.getBodyMd();
  var yamlStr = Object.keys(metaObj).length > 0
    ? jsYaml.safeDump(metaObj, {skipInvalid: true})
    : '';
  var mdStr = (yamlStr ? '---\n' + yamlStr + '---\n\n' : '')
    + bodyStr.trim();
  Document.setDoc(mdStr, yamlStr, bodyStr, metaObj);
  return mdStr
}
*/
