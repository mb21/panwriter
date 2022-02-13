import { BrowserWindow } from 'electron'

export const showModalWindow = (parent: BrowserWindow, modalName: string): void => {
  const modal = new BrowserWindow({
    height: 280
  , modal: true
  , parent
  , resizable: false
  , show: false
  , width: 300
  , webPreferences: {
      preload: __dirname + '/../preload.js'
    , sandbox: true
    }
  })
  if (!!process.env.ELECTRON_IS_DEV) {
    modal.loadURL('http://localhost:3000/index.html?modal=' + modalName)
  } else {
    modal.loadURL(`file://${__dirname}/../../index.html?modal=` + modalName)
  }

  modal.once('ready-to-show', () => {
    modal.show()
  })
}
