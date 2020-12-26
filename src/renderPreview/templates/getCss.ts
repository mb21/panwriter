import { Doc } from '../../appState/AppState';
import { parseToTemplate, interpolateTemplate, extractDefaultVars } from './templates'
// eslint-disable-next-line import/no-webpack-loader-syntax
import styles from '!!raw-loader!../../assets/preview.pandoc-styles.css'

/*
import { getDataDirFileName } from './Exporter'
import { promisify } from 'util'

const appPath = remote.app.getAppPath()
    , defaultStaticCssLink = appPath + '/static/preview.panwriter-default.css'
    ;
*/

const fs: any = undefined
const getDataDirFileName: any = undefined
const promisify: any = undefined
const defaultStaticCssLink: any = undefined

let link: string
  , docType: string | undefined
  ;
const template = parseToTemplate(styles)

export const defaultVars = extractDefaultVars(template)

export const getCss = async (doc: Doc) => {
  let linkIsChanged = false;
  const { meta } = doc
  const newDocType = toDocType(meta)
  if (newDocType && newDocType !== docType) {
    // cache css
    const fileName = getDataDirFileName(newDocType, '.css')
    try {
        await promisify(fs.access)(fileName)
        link = fileName;
    } catch (err) {
      link = defaultStaticCssLink;
    }
    linkIsChanged = true;
  }
  docType = newDocType;

  const cssStr = interpolateTemplate(template, meta);
  return [cssStr, link, linkIsChanged]
}

const toDocType = (meta: any): string | undefined =>
  typeof meta?.type === 'string'
    ? meta.type
    : undefined
