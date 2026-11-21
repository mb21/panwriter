import { mkdir, writeFile } from 'fs/promises'
import * as jsYaml from 'js-yaml'
import { defaultSettings, Settings } from '../src/appState/AppState'
import { dataDir, readDataDirFile } from './dataDir'

export const loadSettings = async (): Promise<Settings> => {
  const [data] = await readDataDirFile('settings.yaml')
  return parseSettings(data)
}

export const saveSettings = async (settings: Settings): Promise<void> => {
  const [existing] = await readDataDirFile('settings.yaml')
  const previous = existing && typeof existing === 'object' ? existing : {}
  const merged = {
    ...previous
  , alwaysShowToolbar: settings.alwaysShowToolbar
  }
  await mkdir(dataDir, { recursive: true })
  await writeFile(dataDir + 'settings.yaml', jsYaml.dump(merged), 'utf8')
}

const parseSettings = (data: Record<string, unknown> = {}): Settings => {
  const { autoUpdateApp, alwaysShowToolbar } = data
  return {
    autoUpdateApp: autoUpdateApp === undefined ? defaultSettings.autoUpdateApp : !!autoUpdateApp
  , alwaysShowToolbar: alwaysShowToolbar === undefined
      ? defaultSettings.alwaysShowToolbar
      : !!alwaysShowToolbar
  }
}
