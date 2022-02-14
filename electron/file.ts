import { BrowserWindow, dialog } from 'electron'
import { readFile, writeFile } from 'fs'
import { basename, extname } from 'path'
import { promisify } from 'util'
import * as ipc from './ipc'
import { Doc } from '../src/appState/AppState'
import { addToRecentFiles } from './recentFiles'


export const openFile = async (
  win: BrowserWindow
, filePath: string
): Promise<Pick<Doc, 'md' | 'fileName' | 'filePath' | 'fileDirty'> | undefined> => {
  const fileName = pathToName(filePath)

  try {
    const md = await promisify(readFile)(filePath, 'utf-8')
    win.setTitle(fileName)
    win.setRepresentedFilename(filePath)
    addToRecentFiles(filePath)
    return { md, fileName, filePath, fileDirty: false }
  } catch (err) {
    dialog.showMessageBox(win, {
      type: 'error'
    , message: 'Could not open file'
    , detail: (err as Error).message
    })
    win.close()
  }
}

export const saveFile = async (
  win: BrowserWindow
, doc: Doc
, opts: {saveAsNewFile?: boolean} = {}
) => {
  const filePath = await showDialog(win, doc, opts.saveAsNewFile)

  if (!filePath) {
    return
  }

  try {
    await promisify(writeFile)(filePath, doc.md)

    const fileName = pathToName(filePath)
    win.setTitle(fileName)
    win.setRepresentedFilename(filePath)

    ipc.sendMessage(win, {
      type: 'updateDoc'
    , doc: { fileName, filePath, fileDirty: false }
    })

    addToRecentFiles(filePath)
  } catch (err) {
    dialog.showMessageBox(win, {
      type: 'error'
    , message: 'Could not save file'
    , detail: (err as Error).message
    })
  }
}

const showDialog = async (win: BrowserWindow, doc: Doc, saveAsNewFile?: boolean) => {
  // TODO: should we save the filePath on `win` in the main process
  // instead of risk it being tampered with in the renderer process?
  let { filePath } = doc
  if (filePath === undefined || saveAsNewFile) {
    const res = await dialog.showSaveDialog(win, {
      defaultPath: 'Untitled.md'
    , filters: [
        { name: 'Markdown', extensions: ['md', 'txt', 'markdown'] }
      ]
    })
    filePath = res.filePath
  }
  return filePath
}

const pathToName = (filePath: string) =>
  basename(filePath, extname(filePath))
