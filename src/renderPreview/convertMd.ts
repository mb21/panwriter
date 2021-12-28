import markdownIt, { Options } from 'markdown-it'
import Renderer from 'markdown-it/lib/renderer'
import markdownItPandoc from 'markdown-it-pandoc'
import { Doc } from '../appState/AppState'

const mdItPandoc = markdownItPandoc(markdownIt())
const defaultImageRender = mdItPandoc.renderer.rules.image

/**
 * converts the markdown in `doc` to HTML
 */
export const convertMd = (doc: Doc): string => {

  if (doc.filePath && defaultImageRender) {
    // rewrite image src attributes for local images
    mdItPandoc.renderer.rules.image = (tokens: any[], idx: number, options: Options, env: unknown, self: Renderer ) => {
      const token = tokens[idx]
      const aIndex = token.attrIndex('src')
      const srcTuple = token.attrs[aIndex]
      const src = srcTuple[1]
      if (!src.includes('http://') && !src.includes('https://') && doc.filePath) {
        srcTuple[1] = `file://${dirname(doc.filePath)}/${src}`
      }
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

const dirname = (path: string): string =>
  pathToURLpath(path).substring(0, path.lastIndexOf('/') + 1)

/**
 * Convert a POSIX or Windows file path to a path in a `file://` scheme URL
 *
 * adapted from https://github.com/sindresorhus/file-url/blob/main/index.js
 */
const pathToURLpath = (path: string): string => {
	path = path.replace(/\\/g, '/')

	// Windows drive letter must be prefixed with a slash.
	if (path[0] !== '/') {
		path = `/${path}`
	}

	// Escape required characters for path components.
	// See: https://tools.ietf.org/html/rfc3986#section-3.3
	return encodeURI(path).replace(/[?#]/g, encodeURIComponent)
}
