import { contextBridge, ipcRenderer } from 'electron'
import { AppState, Doc, Meta, Settings, ViewSplit } from '../src/appState/AppState'
import { Action } from '../src/appState/Action'

export type IpcApi = typeof ipcApi
type Disp = (a: Action) => void

let state: AppState | undefined = undefined
let dispatch: Disp | undefined = undefined

ipcRenderer.on('getDoc', (_e, replyChannel: string) => {
  if (state) {
    ipcRenderer.send(replyChannel, state.doc)
  }
})

export type Message = {
  type: 'initDoc';
  doc: Pick<Doc, 'md' | 'fileName' | 'filePath' | 'fileDirty'>;
  settings: Settings;
}
| {
  type: 'loadSettings';
  settings: Settings;
}
| {
  type: 'split';
  split: ViewSplit;
}
| {
  type: 'updateDoc';
  doc: Partial<Doc>;
}

ipcRenderer.on('dispatch', (_e, action: Message) => {
  if (dispatch) {
    if (action.type === 'split') {
      dispatch({ type: 'setSplitAndRender', split: action.split })
    } else {
      dispatch(action)
    }
  }
})
const chooseFormat = async (fmt: string): Promise<boolean> =>
  ipcRenderer.invoke('chooseFormat', fmt)

const readDataDirFile = async (fileName: string): Promise<Meta | undefined> =>
  ipcRenderer.invoke('readDataDirFile', fileName)

const ipcApi = {
  setStateAndDispatch: (s: AppState, d: Disp) => {
    state = s
    dispatch = d
  }
, send: {
    close:            () => ipcRenderer.send('close')
  , minimize:         () => ipcRenderer.send('minimize')
  , maximize:         () => ipcRenderer.send('maximize')
  , openLink:         (lnk: string) => { if (typeof lnk === 'string') ipcRenderer.send('openLink', lnk) }
  }
, on: {
    addBold:          (cb: () => void)          => ipcRenderer.on('addBold',          cb)
  , addItalic:        (cb: () => void)          => ipcRenderer.on('addItalic',        cb)
  , addStrikethrough: (cb: () => void)          => ipcRenderer.on('addStrikethrough', cb)
  , find:             (cb: () => void)          => ipcRenderer.on('find',             cb)
  , findNext:         (cb: () => void)          => ipcRenderer.on('findNext',         cb)
  , findPrevious:     (cb: () => void)          => ipcRenderer.on('findPrevious',     cb)
  , printFile:        (cb: () => void)          => ipcRenderer.on('printFile',        cb)
  , sendPlatform:     (cb: (p: string) => void) => ipcRenderer.once('sendPlatform',   (_e, p) => cb(p))
  }
, chooseFormat
, readDataDirFile
}

contextBridge.exposeInMainWorld('ipcApi', ipcApi)
