
//@ts-ignore
import markdownItPandoc from 'markdown-it-pandoc'
import { Doc } from '../appState/AppState'

const mdItPandoc = markdownItPandoc()


// takes a markdown str, renders it to preview and to Document.setHTML
export const convertMd = (doc: Doc): string => {
  return mdItPandoc
    .use( mdItSourceMapPlugin(1 + getNrOfYamlLines(doc.yaml)) )
    .render(doc.md)
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
