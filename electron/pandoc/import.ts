import { spawn } from 'child_process'
import { BrowserWindow, dialog, ipcMain } from 'electron'
import { dirname, extname } from 'path'

import { showModalWindow } from './modal'
import { Doc } from '../../src/appState/AppState'
import { ImportOpts } from '../../src/options'

export const importFile = async (win: BrowserWindow, inputPath: string) => {
  const ext = extname(inputPath)
  if (ext === 'docx' || ext === 'xml') {
    showModalWindow(win, 'importFile', { detectedFormat: ext })
    ipcMain.handleOnce('importFile', async (_event, importOpts: ImportOpts | 'closingWindow') => {
      if (importOpts === 'closingWindow') {
        // we fire this event so the ipcMain.handleOnce stops listening
        return
      } else {
        // TODO: parse or validate importOpts?
        runImportFile(win, inputPath, importOpts)
      }
    })
  } else {
    runImportFile(win, inputPath)
  }
}

const runImportFile = async (win: BrowserWindow, inputPath: string, importOpts?: ImportOpts) => {
  const cmd  = 'pandoc'
  const args = [ inputPath, '--wrap=none'
  , '-t', 'markdown-raw_html-raw_tex-header_attributes-fancy_lists-simple_tables-multiline_tables'
  ]
  const cwd  = dirname(inputPath)
  const cmdDebug = cmd + ' ' + args.join(' ')
  return new Promise<Pick<Doc, 'md' | 'fileDirty'>>((resolve, reject) => {

    const pandoc = spawn(cmd, args, {cwd})

    pandoc.on('error', err => {
      dialog.showMessageBox(win, {
        type: 'error'
      , message: 'Failed to call pandoc'
      , detail: `Make sure you have it installed, see pandoc.org/installing

Failed to execute command:
${cmdDebug}

${err.message}`
      })
    });

    const stdout: string[] = []
    pandoc.stdout.on('data', data => {
      stdout.push(data)
    })

    const errout: string[] = []
    pandoc.stderr.on('data', data => {
      errout.push(data)
    })

    pandoc.on('close', exitCode => {
      const success = exitCode === 0
      const toMsg = "Called: " + cmdDebug
      if (success) {
        resolve({
          md: stdout.join('')
        , fileDirty: true
        })
      } else {
        dialog.showMessageBox(win, {
          type:    'error'
        , message: 'Failed to import'
        , detail:  [toMsg, ''].concat( errout.join('') ).join('\n')
        , buttons: ['OK']
        })
        win.close()
        // reject('failed to import')
      }
    })
  })
}
