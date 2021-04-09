import { Doc } from '../../appState/AppState'
import { parseToTemplate, interpolateTemplate, extractDefaultVars } from './templates'
// eslint-disable-next-line import/no-webpack-loader-syntax
import styles from '!!raw-loader!../../assets/preview.pandoc-styles.css'

const template = parseToTemplate(styles)

export const defaultVars = extractDefaultVars(template)

export const getCss = (doc: Doc) =>
  interpolateTemplate(template, doc.meta)
