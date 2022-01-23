import { Settings } from '../src/appState/AppState'
import { readDataDirFile } from './dataDir'

export const loadSettings = async (): Promise<Settings> => {
  const [data] = await readDataDirFile('settings.yaml')
  return parseSettings(data)
}

const parseSettings = (data: Record<string, unknown> = {}): Settings => {
  const { autoUpdateApp, editorIncludes, pandocExecPath } = data
  return {
    autoUpdateApp: autoUpdateApp === undefined ? true : !!autoUpdateApp,
    editorIncludes: typeof editorIncludes === 'string' ? editorIncludes : undefined,
    pandocExecPath: typeof pandocExecPath === 'string' ? pandocExecPath : ''
  }
}
