import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipc', {
  closeWindow: () => ipcRenderer.send('closeWindow')
})
