import { Doc } from '../../appState/AppState'
import { parseToTemplate, interpolateTemplate, extractDefaultVars } from './templates'
// eslint-disable-next-line import/no-webpack-loader-syntax
import styles from '!!raw-loader!../../assets/preview.pandoc-styles.css'

const template = parseToTemplate(styles)

export const defaultVars = extractDefaultVars(template)

let headerIncludes = ''
let docType: string | undefined
const headerIncludesCssFromDataDirFile = async (doc: Doc): Promise<string> => {
  let newDocType = doc.meta.type
  if (typeof newDocType !== 'string') {
    newDocType = 'default'
  }
  if (newDocType !== docType && window.ipcApi) {
    // cache css
    docType = newDocType
    const meta = await window.ipcApi.readDataDirFile(docType + '.yaml')
    const field = meta?.['header-includes']
    headerIncludes = typeof field === 'string'
      ? stripSurroundingStyleTags(field)
      : ''
  }
  return headerIncludes
}

export const getCss = async (doc: Doc): Promise<string> =>
  interpolateTemplate(template, doc.meta) + (await headerIncludesCssFromDataDirFile(doc))

export const stripSurroundingStyleTags = (s: string): string =>
  s.startsWith('<style>\n') && s.endsWith('\n</style>') ? s.slice(8, -9) : s
