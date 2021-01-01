// TODO: GUI popup for import options, at least for:
// -f, -t, --track-changes and --extract-media

import { spawn } from 'child_process'
import { BrowserWindow, dialog } from 'electron'
import { dirname } from 'path'

export const importFile = (win: BrowserWindow, inputPath: string, cb: (s: string) => void) => {
  const cmd  = 'pandoc'
  const args = [ inputPath, '--wrap=none'
  , '-t', 'markdown-raw_html-raw_tex-header_attributes-fancy_lists-simple_tables-multiline_tables'
  ]
  const cwd  = dirname(inputPath)
  const cmdDebug = cmd + ' ' + args.join(' ')

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
      cb( stdout.join('') )
    } else {
      dialog.showMessageBox(win, {
        type:    'error'
      , message: 'Failed to import'
      , detail:  [toMsg, ''].concat( errout.join('') ).join('\n')
      , buttons: ['OK']
      })
      win.close()
    }
  })
}
