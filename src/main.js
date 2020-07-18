"use strict";

// This file is currently the only one that runs in the main process
// see https://electronjs.org/docs/tutorial/application-architecture


// Modules to control application life and create native browser window
const {app, dialog, BrowserWindow, Menu} = require('electron')
    , {autoUpdater} = require("electron-updater")
    , path = require('path')
    , fs = require('fs')
    ;

// Keep a global reference of the windows, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
const windows = []
    , mdExtensions = ['md', 'txt', 'markdown']
    ;
let recentFiles = [];

function createWindow(filePath, toImport=false, wasCreatedOnStartup=false) {
  const win = new BrowserWindow({
      width: 1000
    , height: 800
    , frame: process.platform !== 'darwin'
    , show: false
    , webPreferences: {
        nodeIntegration: false
      , contextIsolation: false
      , preload: __dirname + '/js/rendererPreload.js'
      }
    });
  
  win.wasCreatedOnStartup = wasCreatedOnStartup;
  win.fileIsDirty = false;
  win.filePathToLoad = filePath;
  win.isFileToImport = toImport;
  win.setTitle("Untitled");

  windows.filter(w => w.wasCreatedOnStartup && !w.fileIsDirty).forEach(w => w.close())
  windows.push(win);

  win.once('ready-to-show', () => {
    win.show();
    setMenu();
  });

  win.loadFile('static/index.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.on('close', async function(e) {
    // this does not intercept a reload
    // see https://github.com/electron/electron/blob/master/docs/api/browser-window.md#event-close
    // and https://github.com/electron/electron/issues/9966
    if (win.fileIsDirty) {
      e.preventDefault();
      const selected = await dialog.showMessageBox(win, {
          type: "question"
        , message: "This document has unsaved changes."
        , buttons: ["Save", "Cancel", "Don't Save"]
        })
      switch (selected.response) {
        case 0:
          // Save
          win.webContents.send('fileSave', {closeWindowAfterSave: true});
          break;
        case 1:
          // Cancel
          break;
        case 2:
          // Don't Save
          win.fileIsDirty = false;
          win.close()
          break;
      }
    }
    fetchRecentFiles(); // call to localStorage while we still have a window
  })

  win.on('closed', function() {
    // Dereference the window so it can be garbage collected
    const i = windows.indexOf(win);
    if (i > -1) {
      windows.splice(i, 1);
    }

    setMenuQuick(windows.length > 0);
  })

  win.on('minimize', function() {
    if (windows.filter(w => !w.isMinimized()).length === 0) {
      // no non-minimized windows
      setMenu(false);
    }
  });

  win.on('restore', function() {
    setMenu();
  });
}

// macOS only, on file-drag etc.
// see https://electronjs.org/docs/all#event-open-file-macos
// and https://www.electron.build/configuration/configuration#PlatformSpecificBuildOptions-fileAssociations
app.on('open-file', function(e, filePath) {
  e.preventDefault();
  const toImport = mdExtensions.indexOf( path.extname(filePath).substr(1) ) < 0;
  app.whenReady().then(() => createWindow(filePath, toImport));
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  const args = process.argv.slice(1)
  if (args.length > 0 && app.isPackaged) {
    args.forEach(arg => {
      fs.realpath(arg, (err, fileName) => {
        if (!err) {
          createWindow(fileName);
        }
      });
    });
  } else if (windows.length === 0) {
    createWindow(undefined, false, true);
    setMenuQuick();
  }
  autoUpdater.checkForUpdatesAndNotify();
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform === 'darwin') {
    setMenuQuick(false);
  } else {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow()
  }
})

async function openDialog(toImport=false) {
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

function windowSend(name, opts) {
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send(name, opts);
}

function setMenu(aWindowIsOpen=true) {
  fetchRecentFiles().then( () => setMenuQuick(aWindowIsOpen) );
}

function setMenuQuick(aWindowIsOpen=true) {
  var template = [
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
            }
          }).concat([
              {type: 'separator'}
            , { label: 'Clear Menu'
              , click: clearRecentFiles
              , enabled: recentFiles.length > 0 && aWindowIsOpen
              }
          ])
        }
      , {type: 'separator'}
      , { label: 'Save'
        , accelerator: 'CmdOrCtrl+S'
        , click: () => windowSend('fileSave')
        , enabled: aWindowIsOpen
        }
      , { label: 'Save As…'
        , accelerator: 'CmdOrCtrl+Shift+S'
        , click: () => windowSend('fileSave', {saveAsNewFile: true})
        , enabled: aWindowIsOpen
        }
      , { label: 'Print / PDF'
        , accelerator: 'CmdOrCtrl+P'
        , click: () => windowSend('filePrint')
        , enabled: aWindowIsOpen
        }
      , { label: 'Export…'
        , accelerator: 'CmdOrCtrl+Shift+E'
        , click: () => windowSend('fileExport')
        , enabled: aWindowIsOpen
        }
      , { label: 'Export like previous'
        , accelerator: 'CmdOrCtrl+E'
        , click: () => windowSend('fileExportLikePrevious')
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
      , {role: 'selectall'}
      , {type: 'separator'}
      , { label: 'Find'
        , accelerator: 'CmdOrCtrl+F'
        , click: () => windowSend('find')
        , enabled: aWindowIsOpen
        }
      , { label: 'Find Next'
        , accelerator: 'CmdOrCtrl+G'
        , click: () => windowSend('findNext')
        , enabled: aWindowIsOpen
        }
      , { label: 'Find Previous'
        , accelerator: 'CmdOrCtrl+Shift+G'
        , click: () => windowSend('findPrevious')
        , enabled: aWindowIsOpen
        }
      ]
    }
  , { label: 'Format'
    , submenu: [
        { label: 'Bold'
        , accelerator: 'CmdOrCtrl+B'
        , click: () => windowSend('addBold')
        , enabled: aWindowIsOpen
        }
      , { label: 'Italic'
        , accelerator: 'CmdOrCtrl+I'
        , click: () => windowSend('addItalic')
        , enabled: aWindowIsOpen
        }
      , { label: 'Strikethrough'
        , click: () => windowSend('addStrikethrough')
        , enabled: aWindowIsOpen
        }
      , {type: 'separator'}
      , { label: 'Add CSS style'
        , click: () => windowSend('addMetadataStyle')
        , enabled: aWindowIsOpen
        }
      ]
    }
  , { label: 'View'
    , submenu: [
        { label: 'Show Only Editor'
        , accelerator: 'CmdOrCtrl+1'
        , click: () => windowSend('splitViewOnlyEditor')
        , enabled: aWindowIsOpen
        }
      , { label: 'Show Split View'
        , accelerator: 'CmdOrCtrl+2'
        , click: () => windowSend('splitViewSplit')
        , enabled: aWindowIsOpen
        }
      , { label: 'Show Only Preview'
        , accelerator: 'CmdOrCtrl+3'
        , click: () => windowSend('splitViewOnlyPreview')
        , enabled: aWindowIsOpen
        }
      , {type: 'separator'}
      , {role: 'toggledevtools'}
      , {type: 'separator'}
      , {role: 'resetzoom'}
      , {role: 'zoomin'}
      , {role: 'zoomout'}
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
    viewMenu.push({type: 'separator'});
    viewMenu.push({role: 'forcereload'});
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
      , {role: 'hideothers'}
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

// fetches recentFiles from the localStorage of a renderer process
async function fetchRecentFiles() {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    return win.webContents.executeJavaScript("localStorage.getItem('recentFiles')")
      .then(res => {
        recentFiles = JSON.parse(res) || []
      });
  }
}

function clearRecentFiles() {
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.executeJavaScript("localStorage.setItem('recentFiles', '[]')")
  recentFiles = []
  setMenuQuick();
}
