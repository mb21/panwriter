import { contextBridge, ipcRenderer } from 'electron'
import { Doc } from '../src/appState/AppState'

export type IpcApi = typeof ipcApi

let doc: Doc | undefined = undefined;

ipcRenderer.on('getDoc', (_e, replyChannel) => {
  if (doc) {
    ipcRenderer.send(replyChannel, doc)
  }
})

const ipcApi = {
  setDoc: (d: Doc) => { doc = d }
, once: (channel: string, cb: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (_e, ...args) => cb(...args))
  }
, close:    () => ipcRenderer.send('close')
, minimize: () => ipcRenderer.send('minimize')
, maximize: () => ipcRenderer.send('maximize')
}

contextBridge.exposeInMainWorld('ipcApi', ipcApi)
