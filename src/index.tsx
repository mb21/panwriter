import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App/App'

window.ipcApi?.on.sendPlatform(platform => {
  if (platform === 'darwin') {
    document.body.classList.add('_macOS')
  }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
