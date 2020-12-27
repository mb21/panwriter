import { BrowserWindow, ipcMain } from 'electron'
import { Doc } from '../src/appState/AppState'

export const init = () => {

  ipcMain.on('close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close();
  })

  ipcMain.on('minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize();
  })

  ipcMain.on('maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    //win.isMaximized() ? win.unmaximize() : win.maximize();
    win?.setFullScreen( !win.isFullScreen() )
  })

}

export const sendPlatform = (win: BrowserWindow) => {
  win.webContents.send('sendPlatform', process.platform)
}

export const getDoc = async (win: BrowserWindow): Promise<Doc> => {
  const replyChannel = 'getDoc' + Math.random().toString()
  win.webContents.send('getDoc', replyChannel)
  return new Promise(resolve => {
    ipcMain.once(replyChannel, (event, doc) => {
      resolve(doc)
    })
  })
}
