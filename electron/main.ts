import { app, BrowserWindow, dialog, Menu } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

import * as ipc from './ipc'
import { fileExportDialog, fileExportHTMLToClipboard, fileExportLikePrevious, fileExportToClipboard } from './pandoc/export'
import { Doc } from '../src/appState/AppState'
import { importFile } from './pandoc/import'
import { saveFile, openFile } from './file'
import { Message } from './preload'
import { clearRecentFiles, getRecentFiles } from './recentFiles'
import { loadSettings, updateSettings } from './settings'

const { autoUpdater } = require('electron-updater')
require('fix-path')() // needed to execute pandoc on macOS prod build

let appWillQuit = false
const settingsPromise = loadSettings()

/**
 * Simple debounce function to limit the rate at which a function can fire
 * @param func The function to debounce
 * @param wait The time to wait in milliseconds
 * @returns A debounced function
 */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

declare class CustomBrowserWindow extends Electron.BrowserWindow {
  wasCreatedOnStartup?: boolean;
  dontPreventClose?: boolean;
}

// Keep a global reference of the windows, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
const windows: CustomBrowserWindow[] = []
const mdExtensions = ['md', 'txt', 'markdown']

ipc.init()

const createWindow = async (filePath?: string, toImport=false, wasCreatedOnStartup=false) => {
  // Define default window options
  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    width: 1000,
    height: 800,
    frame: process.platform !== 'darwin',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: __dirname + '/preload.js',
      sandbox: true
    }
  };

  // Apply saved window bounds if available
  const settings = await settingsPromise;
  if (settings.windowBounds) {
    const { width, height, x, y } = settings.windowBounds;
    
    // Validate dimensions and position to prevent window from being off-screen
    const displays = require('electron').screen.getAllDisplays();
    let isValid = false;
    
    for (const display of displays) {
      const { workArea } = display;
      
      // Check if window would be visible in this display
      if (
        x >= workArea.x && y >= workArea.y &&
        x + width <= workArea.x + workArea.width &&
        y + height <= workArea.y + workArea.height
      ) {
        isValid = true;
        break;
      }
    }
    
    // Only apply saved bounds if they are valid
    if (isValid) {
      windowOptions.width = width;
      windowOptions.height = height;
      windowOptions.x = x;
      windowOptions.y = y;
    }
  }

  const win: CustomBrowserWindow = new BrowserWindow(windowOptions);

  win.wasCreatedOnStartup = wasCreatedOnStartup;
  win.setTitle('Untitled');

  // Add event listeners to save window bounds
  const saveBoundsDebounced = debounce(() => {
    saveWindowBounds(win);
  }, 500);

  win.on('resize', saveBoundsDebounced);
  win.on('move', saveBoundsDebounced);

  // close auto-created window when first user action is to open/import another file 
  windows.filter(w => w.wasCreatedOnStartup).forEach(async w => {
    const { fileDirty } = await ipc.getDoc(w);
    if (!fileDirty) {
      w.close();
    }
  });

  windows.push(win);

  const windowReady = new Promise<void>(resolve =>
    win.once('ready-to-show', resolve)
  );

  const isDev = !!process.env.ELECTRON_IS_DEV;
  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // win.loadFile('build/index.html')
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  if (isDev) {
    win.webContents.openDevTools();
  }

  if (filePath) {
    const doc = toImport
      ? await importFile(win, filePath)
      : await openFile(win, filePath);
    if (doc) {
      await windowReady;
      ipc.sendMessage(win, { type: 'initDoc', doc, settings });
      
      // If there's a saved split state, set it after a small delay to ensure it's applied
      if (settings.viewSplitState && 
          (settings.viewSplitState === 'onlyEditor' || 
           settings.viewSplitState === 'split' || 
           settings.viewSplitState === 'onlyPreview')) {
        setTimeout(() => {
          ipc.sendMessage(win, { type: 'split', split: settings.viewSplitState as 'onlyEditor' | 'split' | 'onlyPreview' });
        }, 100);
      }
    } else {
      ipc.sendMessage(win, { type: 'loadSettings', settings });
    }
  } else {
    await windowReady;
    ipc.sendMessage(win, { type: 'loadSettings', settings });
    
    // If there's a saved split state, set it after a small delay to ensure it's applied
    if (settings.viewSplitState && 
        (settings.viewSplitState === 'onlyEditor' || 
         settings.viewSplitState === 'split' || 
         settings.viewSplitState === 'onlyPreview')) {
      setTimeout(() => {
        ipc.sendMessage(win, { type: 'split', split: settings.viewSplitState as 'onlyEditor' | 'split' | 'onlyPreview' });
      }, 100);
    }
  }

  // Apply maximized state if needed
  if (settings.windowBounds?.isMaximized) {
    win.maximize();
  }

  await windowReady;
  ipc.sendPlatform(win);
  win.show();
  setMenu();

  win.on('close', async e => {
    // Save window bounds when closing
    saveWindowBounds(win);

    // this does not intercept a reload
    // see https://github.com/electron/electron/blob/master/docs/api/browser-window.md#event-close
    // and https://github.com/electron/electron/issues/9966
    if (!win.dontPreventClose) {
      e.preventDefault();
      const close = () => {
        win.dontPreventClose = true;
        win.close();
        if (appWillQuit) {
          app.quit();
        }
      };
      const doc = await ipc.getDoc(win);
      if (doc.fileDirty) {
        const selected = await dialog.showMessageBox(win, {
            type: "question"
          , message: "This document has unsaved changes."
          , buttons: ["Save", "Cancel", "Don't Save"]
          });
        switch (selected.response) {
          case 0: {
            // Save
            win.dontPreventClose = true;
            await saveFile(win, doc);
            close();
            break;
          }
          case 1: {
            // Cancel
            appWillQuit = false;
            break;
          }
          case 2: {
            // Don't Save
            close();
            break;
          }
        }
      } else {
        close();
      }
    }
  });

  win.on('closed', () => {
    // Dereference the window so it can be garbage collected
    const i = windows.indexOf(win);
    if (i > -1) {
      windows.splice(i, 1);
    }

    setMenu(windows.length > 0, true);
  });

  win.on('minimize', () => {
    if (windows.filter(w => !w.isMinimized()).length === 0) {
      // no non-minimized windows
      setMenu(false, true);
    }
  });

  win.on('restore', () => {
    setMenu(true, false);
  });
}

(() => {
  let initialFilePath: string | undefined = undefined
  let initialFileIsToImport = false
  let appIsReady = false

  // macOS only event (on file-drag etc.), fires before 'ready' event
  // see https://github.com/electron/electron/blob/master/docs/api/app.md#event-open-file-macos
  // and https://www.electron.build/configuration/configuration#PlatformSpecificBuildOptions-fileAssociations
  app.on('open-file', (e, filePath) => {
    e.preventDefault()
    const toImport = mdExtensions.indexOf( path.extname(filePath).substr(1) ) < 0
    if (appIsReady) {
      createWindow(filePath, toImport, false)
    } else {
      initialFilePath = filePath
      initialFileIsToImport = toImport
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    appIsReady = true
    const args = process.argv.slice(1)
    if (args.length > 0 && app.isPackaged) {
      args.forEach(arg => {
        fs.realpath(arg, (err, fileName) => {
          if (!err) {
            createWindow(fileName)
          }
        });
      });
    } else if (windows.length === 0) {
      const emptyStartupWindow = !(initialFilePath || initialFileIsToImport)
      createWindow(initialFilePath, initialFileIsToImport, emptyStartupWindow)
    }
    try {
      const settings = await settingsPromise
      if (settings.autoUpdateApp) {
        autoUpdater.allowPrerelease = false
        autoUpdater.checkForUpdatesAndNotify()
      }
    } catch (e) {
      console.warn('autoUpdater failed', e)
    }
  })
})()

app.on('before-quit', e => {
  appWillQuit = true
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform === 'darwin') {
    setMenu(false, false);
  } else {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow()
  }
})

const openDialog = async (toImport=false) => {
  const formats = toImport ? [] : [
            { name: 'Markdown', extensions: mdExtensions }
          ]
      , fileNames = await dialog.showOpenDialog({
          filters: formats
        , buttonLabel: toImport ? 'Import' : undefined
        })
      ;
  if (fileNames && fileNames.filePaths.length > 0) {
    createWindow(fileNames.filePaths[0], toImport);
  }
}

const invokeWithWinAndDoc = async (fn: (win: BrowserWindow, doc: Doc) => void) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    const doc = await ipc.getDoc(win)
    fn(win, doc)
  } else {
    throw Error('no window was focused')
  }
}

const windowSendCommand = async (cmd: ipc.Command) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    ipc.sendCommand(win, cmd)
  }
}

const windowSendMessage = async (msg: Message) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    ipc.sendMessage(win, msg)
  }
}

const saveSplitSetting = (split: string) => {
  // Only save valid split settings
  if (split === 'onlyEditor' || split === 'split' || split === 'onlyPreview') {
    updateSettings({ viewSplitState: split })
      .catch(err => console.error('Failed to save split setting:', err))
  }
}

/**
 * Saves the current window's bounds (position, size, and maximized state) to settings
 * @param win The BrowserWindow instance to save bounds for
 */
async function saveWindowBounds(win: BrowserWindow) {
  try {
    // Get the current window bounds
    const bounds = win.getNormalBounds();
    const isMaximized = win.isMaximized();
    
    // Update the settings with the new bounds
    await updateSettings({
      windowBounds: {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
        isMaximized
      }
    });
  } catch (error) {
    console.error('Failed to save window bounds:', error);
  }
}

const setMenu = async (aWindowIsOpen=true, useRecentFilesCache=false) => {
  const recentFiles = await getRecentFiles(useRecentFilesCache)
  const template: Electron.MenuItemConstructorOptions[] = [
    { label: 'File'
    , submenu: [
        { label: 'New'
        , accelerator: 'CmdOrCtrl+N'
        , click: () => createWindow()
        }
      , { label: 'Open…'
        , accelerator: 'CmdOrCtrl+O'
        , click: () => openDialog()
        }
      , { label: 'Open Recent'
        , submenu: recentFiles.map(f => {
            return {
              label: path.basename(f)
            , click: () => createWindow(f)
            } as Electron.MenuItemConstructorOptions
          }).concat([
              {type: 'separator'}
            , { label: 'Clear Menu'
              , click: () => {
                  clearRecentFiles()
                  setMenu(true, true)
                }
              , enabled: recentFiles.length > 0 && aWindowIsOpen
              }
          ])
        }
      , {type: 'separator'}
      , { label: 'Save'
        , accelerator: 'CmdOrCtrl+S'
        , click: () => invokeWithWinAndDoc((win, doc) => saveFile(win, doc))
        , enabled: aWindowIsOpen
        }
      , { label: 'Save As…'
        , accelerator: 'CmdOrCtrl+Shift+S'
        , click: () => invokeWithWinAndDoc((win, doc) => saveFile(win, doc, { saveAsNewFile: true }))
        , enabled: aWindowIsOpen
        }
      , { label: 'Print / PDF'
        , accelerator: 'CmdOrCtrl+P'
        , click: () => windowSendCommand('printFile')
        , enabled: aWindowIsOpen
        }
      , { label: 'Export…'
        , accelerator: 'CmdOrCtrl+Shift+E'
        , click: () => invokeWithWinAndDoc(fileExportDialog)
        , enabled: aWindowIsOpen
        }
      , { label: 'Export like previous'
        , accelerator: 'CmdOrCtrl+E'
        , click: () => invokeWithWinAndDoc(fileExportLikePrevious)
        , enabled: aWindowIsOpen
        }
      , { label: 'Export to clipboard'
        , accelerator: 'CmdOrCtrl+Alt+E'
        , click: () => invokeWithWinAndDoc(fileExportToClipboard)
        , enabled: aWindowIsOpen
        }
      , { label: 'Export as rich text to clipboard'
        , accelerator: 'CmdOrCtrl+Alt+Shift+E'
        , click: () => invokeWithWinAndDoc(fileExportHTMLToClipboard)
        , enabled: aWindowIsOpen
        }
      , { label: 'Import…'
        , accelerator: 'CmdOrCtrl+I'
        , click: () => openDialog(true)
        }
      ]
    }
  , { label: 'Edit'
    , submenu: [
        {role: 'undo'}
      , {role: 'redo'}
      , {type: 'separator'}
      , {role: 'cut'}
      , {role: 'copy'}
      , {role: 'paste'}
      , {role: 'delete'}
      , {role: 'selectall' as Electron.MenuItemConstructorOptions['role']}
      , {type: 'separator'}
      , { label: 'Find'
        , accelerator: 'CmdOrCtrl+F'
        , click: () => windowSendCommand('find')
        , enabled: aWindowIsOpen
        }
      , { label: 'Find Next'
        , accelerator: 'CmdOrCtrl+G'
        , click: () => windowSendCommand('findNext')
        , enabled: aWindowIsOpen
        }
      , { label: 'Find Previous'
        , accelerator: 'CmdOrCtrl+Shift+G'
        , click: () => windowSendCommand('findPrevious')
        , enabled: aWindowIsOpen
        }
      ]
    }
  , { label: 'Format'
    , submenu: [
        { label: 'Bold'
        , accelerator: 'CmdOrCtrl+B'
        , click: () => windowSendCommand('addBold')
        , enabled: aWindowIsOpen
        }
      , { label: 'Italic'
        , accelerator: 'CmdOrCtrl+I'
        , click: () => windowSendCommand('addItalic')
        , enabled: aWindowIsOpen
        }
      , { label: 'Strikethrough'
        , click: () => windowSendCommand('addStrikethrough')
        , enabled: aWindowIsOpen
        }
      ]
    }
  , { label: 'View'
    , submenu: [
        { label: 'Show Only Editor'
        , accelerator: 'CmdOrCtrl+1'
        , click: () => {
            windowSendMessage({ type: 'split', split: 'onlyEditor' })
            saveSplitSetting('onlyEditor')
          }
        , enabled: aWindowIsOpen
        }
      , { label: 'Show Split View'
        , accelerator: 'CmdOrCtrl+2'
        , click: () => {
            windowSendMessage({ type: 'split', split: 'split' })
            saveSplitSetting('split')
          }
        , enabled: aWindowIsOpen
        }
      , { label: 'Show Only Preview'
        , accelerator: 'CmdOrCtrl+3'
        , click: () => {
            windowSendMessage({ type: 'split', split: 'onlyPreview' })
            saveSplitSetting('onlyPreview')
          }
        , enabled: aWindowIsOpen
        }
      , {type: 'separator'}
      , {role: 'toggledevtools' as Electron.MenuItemConstructorOptions['role']}
      , {type: 'separator'}
      , {role: 'resetzoom' as Electron.MenuItemConstructorOptions['role']}
      , {role: 'zoomin'    as Electron.MenuItemConstructorOptions['role']}
      , {role: 'zoomout'   as Electron.MenuItemConstructorOptions['role']}
      , {type: 'separator'}
      , {role: 'togglefullscreen'}
      ]
    }
  , { role: 'window'
    , submenu: [
        {role: 'minimize'}
      , {role: 'close'}
      ]
    }
  ]

  if (!app.isPackaged) {
    const viewMenu = template[3].submenu;
    if (viewMenu && ('push' in viewMenu)) {
      viewMenu.push({type: 'separator'});
      viewMenu.push({role: 'forcereload' as Electron.MenuItemConstructorOptions['role']});
    }
  }

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName()
    , submenu: [
        {role: 'about'}
      , {type: 'separator'}
      , {role: 'services', submenu: []}
      , {type: 'separator'}
      , {role: 'hide'}
      , {role: 'hideothers' as Electron.MenuItemConstructorOptions['role']}
      , {role: 'unhide'}
      , {type: 'separator'}
      , {role: 'quit'}
      ]
    })

    // Window menu
    template[5].submenu = [
      {role: 'close'}
    , {role: 'minimize'}
    , {role: 'zoom'}
    , {type: 'separator'}
    , {role: 'front'}
    ]
  }
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


