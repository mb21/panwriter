import { BrowserWindow, ipcMain } from 'electron'
import { Doc } from '../src/appState/AppState'

// this file contains the IPC functionality of the main process.
// for the renderer process's part see electron/preload.ts

export const init = () => {
  ipcMain.on('close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close()
  })

  ipcMain.on('minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize()
  })

  ipcMain.on('maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    // win.isMaximized() ? win.unmaximize() : win.maximize()
    win?.setFullScreen( !win.isFullScreen() )
  })
}

export const sendPlatform = (win: BrowserWindow) => {
  win.webContents.send('sendPlatform', process.platform)
}

export const updateDoc = (win: BrowserWindow, doc: Partial<Doc>) => {
  win.webContents.send('updateDoc', doc)
}

export type Command = 'printFile'
  | 'find' | 'findNext' | 'findPrevious'
  | 'addBold' | 'addItalic' | 'addStrikethrough'
  | 'splitViewOnlyEditor' | 'splitViewSplit' | 'splitViewOnlyPreview'
export const sendCommand = (win: BrowserWindow, cmd: Command) => {
  win.webContents.send(cmd)
}

export const getDoc = async (win: BrowserWindow): Promise<Doc> => {
  const replyChannel = 'getDoc' + Math.random().toString()
  win.webContents.send('getDoc', replyChannel)
  return new Promise(resolve => {
    ipcMain.once(replyChannel, (_event, doc) => {
      resolve(doc)
    })
  })
}
