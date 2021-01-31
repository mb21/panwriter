import { app } from 'electron'
import * as fs from 'fs'
import { sep } from 'path'
import { promisify } from 'util'

// since on Windows and Linux multiple instances of our app can be running concurrently,
// we usually have to read out the file again every time
let recentFilesCache: string[] = []

const storageFileName = app.getPath('userData') + sep + 'recentFiles.json'

export const getRecentFiles = async (useCache = false): Promise<string[]> => {
  if (useCache) {
    return recentFilesCache
  }

  let recents = []
  try {
    const contents = await promisify(fs.readFile)(storageFileName, 'utf8')
    recents = JSON.parse(contents) || []
  } catch (e) {
    console.info('no recentFiles found?', e)
  }
  recentFilesCache = recents
  return recents
}

export const addToRecentFiles = async (filePath: string): Promise<void> => {
  let recents = await getRecentFiles()
  recents = recents.filter(f => f !== filePath)
  recents.unshift(filePath)
  recents = recents.slice(0, 15)
  recentFilesCache = recents
  try {
    return promisify(fs.writeFile)(storageFileName, JSON.stringify(recents))
  } catch (e) {
    console.warn('could not addToRecentFiles', e)
  }
}

export const clearRecentFiles = () => {
  recentFilesCache = []
  promisify(fs.writeFile)(storageFileName, '[]')
}
