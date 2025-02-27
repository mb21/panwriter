import { defaultSettings, Settings } from '../src/appState/AppState'
import { readDataDirFile } from './dataDir'

export const loadSettings = async (): Promise<Settings> => {
  const [data] = await readDataDirFile('settings.yaml')
  return parseSettings(data)
}

const parseSettings = (data: Record<string, unknown> = {}): Settings => {
  const { autoUpdateApp, latexDelimiters } = data
  return {
    autoUpdateApp: autoUpdateApp === undefined ? defaultSettings.autoUpdateApp : !!autoUpdateApp,
    latexDelimiters: latexDelimiters === undefined ? defaultSettings.latexDelimiters : latexDelimiters as Settings['latexDelimiters']
  }
}
