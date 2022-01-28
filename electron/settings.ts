import { defaultSettings, Settings } from '../src/appState/AppState'
import { readDataDirFile } from './dataDir'

export const loadSettings = async (): Promise<Settings> => {
  const [data] = await readDataDirFile('settings.yaml')
  return parseSettings(data)
}

const parseSettings = (data: Record<string, unknown> = {}): Settings => {
  const { autoUpdateApp, editorIncludes, pandocExecPath } = data
  return {
    autoUpdateApp: autoUpdateApp === undefined ? defaultSettings.autoUpdateApp : !!autoUpdateApp,
    editorIncludes: typeof editorIncludes === 'string' ? editorIncludes : defaultSettings.editorIncludes,
    pandocExecPath: typeof pandocExecPath === 'string' ? pandocExecPath : defaultSettings.pandocExecPath
  }
}
