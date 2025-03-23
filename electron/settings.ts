import { defaultSettings, Settings } from '../src/appState/AppState'
import { readDataDirFile } from './dataDir'
import { writeFile } from 'fs/promises'
import * as jsYaml from 'js-yaml'
import { dataDir } from './dataDir'
import { basename } from 'path'
import { mkdir } from 'fs/promises'

export const loadSettings = async (): Promise<Settings> => {
  const [data] = await readDataDirFile('settings.yaml')
  return parseSettings(data)
}

const parseSettings = (data: Record<string, unknown> = {}): Settings => {
  const { autoUpdateApp, extensions, viewSplitState, windowBounds } = data
  return {
    autoUpdateApp: autoUpdateApp === undefined ? defaultSettings.autoUpdateApp : !!autoUpdateApp,
    extensions: typeof extensions === 'object' && extensions !== null 
      ? extensions as Record<string, boolean>
      : defaultSettings.extensions,
    viewSplitState: typeof viewSplitState === 'string' && 
      (viewSplitState === 'onlyEditor' || viewSplitState === 'split' || viewSplitState === 'onlyPreview') 
      ? viewSplitState 
      : defaultSettings.viewSplitState,
    windowBounds: typeof windowBounds === 'object' && windowBounds !== null
      ? {
          width: typeof (windowBounds as any).width === 'number' ? (windowBounds as any).width : defaultSettings.windowBounds?.width ?? 1000,
          height: typeof (windowBounds as any).height === 'number' ? (windowBounds as any).height : defaultSettings.windowBounds?.height ?? 800,
          x: typeof (windowBounds as any).x === 'number' ? (windowBounds as any).x : defaultSettings.windowBounds?.x ?? 0,
          y: typeof (windowBounds as any).y === 'number' ? (windowBounds as any).y : defaultSettings.windowBounds?.y ?? 0,
          isMaximized: typeof (windowBounds as any).isMaximized === 'boolean' ? (windowBounds as any).isMaximized : defaultSettings.windowBounds?.isMaximized ?? false,
        }
      : defaultSettings.windowBounds ?? {
          width: 1000,
          height: 800,
          x: 0,
          y: 0,
          isMaximized: false
        }
  }
}

/**
 * Updates settings in settings.yaml
 * Carefully preserves existing settings while updating only what's provided
 */
export const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
  try {
    // Ensure data directory exists
    try {
      await mkdir(dataDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, ignore that error
      console.log('Info: Data directory exists or could not be created')
    }

    // Read existing settings
    const [existingData, filePath] = await readDataDirFile('settings.yaml')
    const fileName = dataDir + basename('settings.yaml')
    
    // Create a merged settings object
    const mergedSettings = {
      ...(existingData || {}),
      ...newSettings
    }
    
    // Convert to YAML
    const yamlContent = jsYaml.dump(mergedSettings)
    
    // Write to file
    await writeFile(fileName, yamlContent, 'utf8')
    return true
  } catch (e) {
    console.error('Failed to write settings:', e)
    return false
  }
}
