import { contextBridge, ipcRenderer } from 'electron'
import { AppState, Doc } from '../src/appState/AppState'
import { PureAction } from '../src/appState/pureReducer'

export type IpcApi = typeof ipcApi
type Disp = (a: PureAction) => Promise<void>

let state: AppState | undefined = undefined
let dispatch: Disp | undefined = undefined

ipcRenderer.on('updateDoc', (_e, doc: Partial<Doc>) => {
  if (dispatch) {
    dispatch({ type: 'updateDoc', doc })
  }
})

ipcRenderer.on('getDoc', (_e, replyChannel: string) => {
  if (state) {
    ipcRenderer.send(replyChannel, state.doc)
  }
})

const ipcApi = {
  setStateAndDispatch: (s: AppState, d: Disp) => {
    state = s
    dispatch = d
  }
, once: (channel: string, cb: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (_e, ...args) => cb(...args))
  }
, close:    () => ipcRenderer.send('close')
, minimize: () => ipcRenderer.send('minimize')
, maximize: () => ipcRenderer.send('maximize')
}

contextBridge.exposeInMainWorld('ipcApi', ipcApi)
