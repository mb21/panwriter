import { BrowserWindow, ipcMain } from 'electron'

export const initIpc = () => { 

  ipcMain.on('closeWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.close();
  })

  ipcMain.on('minimizeWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    win?.minimize();
  })

  ipcMain.on('maximizeWindow', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    //win.isMaximized() ? win.unmaximize() : win.maximize();
    win?.setFullScreen( !win.isFullScreen() )
  })

}
