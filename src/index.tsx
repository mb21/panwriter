import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App/App'
import { ModalChooseFormat } from './components/ModalChooseFormat/ModalChooseFormat'
import { ModalImport } from './components/ModalImport/ModalImport'

window.ipcApi?.on.sendPlatform(platform => {
  if (platform === 'darwin') {
    document.body.classList.add('_macOS')
  }
})

const modal = new URLSearchParams(window.location.search).get('modal')

ReactDOM.render(
  <React.StrictMode>
    { modal === 'chooseFormat'
      ? <ModalChooseFormat />
      : (modal === 'import'
        ? <ModalImport />
        : <App />)}
  </React.StrictMode>,
  document.getElementById('root')
);
