import { BrowserWindow } from 'electron'

export const showModalWindow = (parent: BrowserWindow, modalName: string, opts: Record<string, string> = {}): void => {
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

  const params = new URLSearchParams(opts)
  params.set('modal', modalName)

  if (!!process.env.ELECTRON_IS_DEV) {
    modal.loadURL('http://localhost:3000/index.html?' + params.toString())
  } else {
    modal.loadURL(`file://${__dirname}/../../index.html?` + params.toString())
  }

  modal.once('ready-to-show', () => {
    modal.show()
  })
}
