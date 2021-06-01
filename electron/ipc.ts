import { BrowserWindow, ipcMain, shell } from 'electron'
import { Doc } from '../src/appState/AppState'
import { readDataDirFile } from './dataDir'
import { Message } from './preload'

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

  ipcMain.on('openLink', (_event, link: string) => {
    shell.openExternal(link)
  })

  ipcMain.handle('readDataDirFile', async (_event, fileName: string) => {
    const [ meta ] = await readDataDirFile(fileName)
    return meta
  })
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

export const sendMessage = (win: BrowserWindow, msg: Message) => {
  win.webContents.send('dispatch', msg)
}

export const sendPlatform = (win: BrowserWindow) => {
  win.webContents.send('sendPlatform', process.platform)
}

export type Command = 'printFile'
  | 'find' | 'findNext' | 'findPrevious'
  | 'addBold' | 'addItalic' | 'addStrikethrough'

export const sendCommand = (win: BrowserWindow, cmd: Command) => {
  win.webContents.send(cmd)
}
