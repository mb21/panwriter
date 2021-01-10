import { contextBridge, ipcRenderer } from 'electron'
import { AppState } from '../src/appState/AppState'
import { PureAction } from '../src/appState/pureReducer'

export type IpcApi = typeof ipcApi
type Disp = (a: PureAction) => Promise<void>

let state: AppState | undefined = undefined
let dispatch: Disp | undefined = undefined

ipcRenderer.on('getDoc', (_e, replyChannel: string) => {
  if (state) {
    ipcRenderer.send(replyChannel, state.doc)
  }
})

ipcRenderer.on('dispatch', (_e, action: PureAction) => {
  if (dispatch) {
    dispatch(action)
  }
})

const ipcApi = {
  setStateAndDispatch: (s: AppState, d: Disp) => {
    state = s
    dispatch = d
  }
, send: {
    close:            () => ipcRenderer.send('close')
  , minimize:         () => ipcRenderer.send('minimize')
  , maximize:         () => ipcRenderer.send('maximize')
  }
, on: {
    addBold:          (cb: () => void)          => ipcRenderer.on('addBold',          cb)
  , addItalic:        (cb: () => void)          => ipcRenderer.on('addItalic',        cb)
  , addStrikethrough: (cb: () => void)          => ipcRenderer.on('addStrikethrough', cb)
  , find:             (cb: () => void)          => ipcRenderer.on('find',             cb)
  , findNext:         (cb: () => void)          => ipcRenderer.on('findNext',         cb)
  , findPrevious:     (cb: () => void)          => ipcRenderer.on('findPrevious',     cb)
  , sendPlatform:     (cb: (p: string) => void) => ipcRenderer.once('sendPlatform',   (_e, p) => cb(p))
  }
}

contextBridge.exposeInMainWorld('ipcApi', ipcApi)
