import { BrowserWindow, dialog, ipcRenderer } from 'electron'
import { readFile, writeFile } from 'fs'
import { basename, extname } from 'path'
import { Doc } from '../src/appState/AppState';
import { importFile } from './pandoc/import'


var onFileSaveCb;

export const initFile = (win: BrowserWindow, conf) => {
  onFileSaveCb = conf.onFileSave;

  const fileLoaded = (text: string) => {
    win.fileIsDirty = false;
    conf.onFileLoad(name)(text)();
  }
  const { filePath } = doc

  if (filePath) {
    var name = filename(filePath);
    if (win.isFileToImport) {
      // import file
      importFile(win, filePath, fileLoaded);
    } else {
      // open file
      readFile(filePath, 'utf8', function(err, text) {
        if (err) {
          dialog.showMessageBox(win, {
            type: 'error'
          , message: 'Could not open file'
          , detail: err.message
          })
          win.close()
        } else {
          win.setTitle(name);
          win.setRepresentedFilename(filePath);
          fileLoaded(text);
        }
      });
    }
  }
};

export const fileSave = async (
  win: BrowserWindow
, doc: Doc
, opts: {saveAsNewFile?: boolean} = {}
) => {
  let { filePath } = doc

  if (doc.filePath === undefined || opts.saveAsNewFile) {
    await dialog.showSaveDialog(win, {
      defaultPath: 'Untitled.md'
    , filters: [
        { name: 'Markdown', extensions: ['md', 'txt', 'markdown'] }
      ]
    })
  }

  if (!filePath) {
    return;
  }

  writeFile(filePath, doc.md, err => {
    if (err) {
      dialog.showMessageBox(win, {
        type: 'error'
      , message: 'Could not save file'
      , detail: err.message
      })
    } else {
      const name = filename(filePath)
      Document.setPath(filePath);
      win.setTitle(name);
      win.setRepresentedFilename(filePath);
      win.fileIsDirty = false;
      onFileSaveCb(name)();
      if (opts.closeWindowAfterSave) {
        win.close();
      }
    }
  })
}

const filename = (filePath: string) =>
  basename(filePath, extname(filePath))
