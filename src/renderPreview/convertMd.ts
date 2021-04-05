//@ts-ignore
import markdownItPandoc from 'markdown-it-pandoc'
//@ts-ignore
import dirname from 'path-dirname'
import { Doc } from '../appState/AppState'

const mdItPandoc = markdownItPandoc()
const defaultImageRender = mdItPandoc.renderer.rules.image

/**
 * converts the markdown in `doc` to HTML
 */
export const convertMd = (doc: Doc): string => {

  if (doc.filePath) {
    // rewrite image src attributes
    mdItPandoc.renderer.rules.image = (tokens: any[], idx: number, options: unknown, env: unknown, self: unknown) => {
      const token = tokens[idx]
      const aIndex = token.attrIndex('src')
      const srcTuple = token.attrs[aIndex]
      const src = srcTuple[1]
      srcTuple[1] = `file://${dirname(doc.filePath)}/${src}`
      return defaultImageRender(tokens, idx, options, env, self)
    }
  }

  return mdItPandoc
    .use( mdItSourceMapPlugin(1 + getNrOfYamlLines(doc.yaml)) )
    .render(doc.bodyMd)
}

const mdItSourceMapPlugin = (nrLinesOffset=1) => {
  return (md: any) => {
    var temp = md.renderer.renderToken.bind(md.renderer)
    md.renderer.renderToken = (tokens: any[], idx: number, options: unknown) => {
      var token = tokens[idx]
      if (token.level === 0 && token.map !== null && token.type.endsWith('_open')) {
        token.attrPush(['data-source-line', token.map[0] + nrLinesOffset])
      }
      return temp(tokens, idx, options)
    }
  }
}

const getNrOfYamlLines = (yaml: string): number => {
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
