import { readFile } from 'fs/promises'
import * as jsYaml from 'js-yaml'
import { basename, sep } from 'path'
import { Meta } from '../src/appState/AppState'
import { pandocPreferences } from './settings';

export function getDataDir() {
  let dataDir : string = pandocPreferences.value('main.userDataDir');
  if(dataDir.endsWith(sep)) {
    return dataDir;
  } else {
    return [dataDir, ''].join(sep);
  }
}

/**
 * reads the right default yaml file
 * make sure this function is safe to expose in `preload.ts`
 */
export const readDataDirFile = async (fileName: string): Promise<[Meta | undefined, string]> => {
  try {
    // make sure only PanWriterUserData directory can be accessed
    fileName = getDataDir() + basename(fileName)

    const str = await readFile(fileName, 'utf8')
    const yaml = jsYaml.safeLoad(str)
    return [
      typeof yaml === 'object' ? (yaml as Meta) : {},
      fileName
    ]
  } catch(e) {
    console.warn("Error loading or parsing YAML file." + e.message)
    return [ undefined, fileName ]
  }
}
