import jsYaml from 'js-yaml'
import { Doc, Meta } from '../appState/AppState'

// from https://github.com/dworthen/js-yaml-front-matter/blob/master/src/index.js#L14
const yamlFrontRe = /^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/

export const parseYaml = (md: string) => {
  let yamlStr = ''
    , bodyMd = md
    , meta: Meta = {}
    , yaml
    , results = yamlFrontRe.exec(md)
  try {
    yaml = results?.[2]
    if (yaml) {
      const metaObj = jsYaml.load(yaml, {schema: jsYaml.JSON_SCHEMA})
      if (typeof metaObj === 'object' && !(metaObj instanceof Array) ) {
        yamlStr = yaml
        bodyMd = results?.[3] || ''
        meta = metaObj as Meta
      } else {
        console.warn("YAML wasn't an object")
      }
    }
  } catch(e) {
    console.warn("Could not parse YAML", (e as Error).message)
  }
  return { yaml: yamlStr, bodyMd, meta }
}

export const serializeMetaToMd = (doc: Doc): string => {
  const { meta, bodyMd } = doc
  const yamlStr = Object.keys(meta).length > 0
    ? jsYaml.dump(meta, {skipInvalid: true})
    : ''
  return (yamlStr ? '---\n' + yamlStr + '---\n\n' : '') + bodyMd.trim()
}
