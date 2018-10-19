"use strict";

// Modules to control application life and create native browser window
const {app, dialog, BrowserWindow, Menu} = require('electron')
    , path = require('path')
    ;

// Keep a global reference of the windows, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let windows = []

global.setWindowTitle = function(win, filePath) {
  if (filePath) {
    win.setRepresentedFilename(filePath);
    win.setTitle( path.basename(filePath) );
  } else {
    win.setTitle("Untitled");
  }
}

function createWindow(filePath, toImport=false) {
  const win = new BrowserWindow({
      width: 1000
    , height: 800
    , frame: false
    // macOS-only see https://stackoverflow.com/questions/35876939
    // and https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
    , titleBarStyle: 'customButtonsOnHover'
    , webPreferences: {
        nodeIntegration: false
      //, contextIsolation: true
      , preload: __dirname + '/preload.js'
      }
    });
  
  win.fileIsDirty = false;
  win.filePathToLoad = filePath;
  win.isFileToImport = toImport;
  setWindowTitle(win, filePath);

  win.loadFile('index.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  windows.push(win);
  setMenu();

  win.on('close', function(e) {
    // this does not intercept a reload
    // see https://github.com/electron/electron/blob/master/docs/api/browser-window.md#event-close
    // and https://github.com/electron/electron/issues/9966
    if (win.fileIsDirty) {
      const selected = dialog.showMessageBox(win, {
          type: "question"
        , message: "This document has unsaved changes."
        , buttons: ["Cancel", "Don't Save"]
        })
      switch (selected) {
        case 0:
          // Cancel
          e.preventDefault();
          break;
        case 1:
          // Don't Save
          break;
        default:
          e.preventDefault();
      }
    }
  })

  win.on('closed', function () {
    // Dereference the window so it can be garbage collected
    const i = windows.indexOf(win);
    if (i > -1) {
      windows.splice(i, 1);
    }
  })
}

// macOS only, on file-drag etc.
app.on('open-file', function(e, filePath) {
  e.preventDefault();
  createWindow(filePath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow(undefined);
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform === 'darwin') {
    setMenu(false);
  } else {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windows.length === 0) {
    createWindow()
  }
})

function openDialog(toImport=false) {
  const formats = toImport ? [] : [
            { name: 'Markdown', extensions: ['md', 'txt', 'markdown'] }
          ]
      , fileNames = dialog.showOpenDialog({
          filters: formats
        , buttonLabel: toImport ? 'Import' : undefined
        })
      ;
  if (fileNames !== undefined && fileNames.length > 0) {
    createWindow( fileNames[0], toImport);
  }
}

function windowSend(name) {
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send(name);
}

function setMenu(aWindowIsOpen=true) {
  var template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New'
        , accelerator: 'CmdOrCtrl+N'
        , click: () => createWindow()
        }
      , {
          label: 'Open'
        , accelerator: 'CmdOrCtrl+O'
        , click: () => openDialog()
        }
      , {
          label: 'Save'
        , accelerator: 'CmdOrCtrl+S'
        , click: windowSend.bind(this, 'fileSave')
        , enabled: aWindowIsOpen
        }
      , {
          label: 'Print / PDF'
        , accelerator: 'CmdOrCtrl+P'
        , click: windowSend.bind(this, 'filePrint')
        , enabled: aWindowIsOpen
        }
      , {
          label: 'Export'
        , accelerator: 'CmdOrCtrl+Shift+E'
        , click: windowSend.bind(this, 'fileExport')
        , enabled: aWindowIsOpen
        }
      , {
          label: 'Export like previous'
        , accelerator: 'CmdOrCtrl+E'
        , click: windowSend.bind(this, 'fileExportLikePrevious')
        , enabled: aWindowIsOpen
        }
      , {
          label: 'Import'
        , accelerator: 'CmdOrCtrl+I'
        , click: () => openDialog(true)
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload', accelerator: ''}, //prevent accidental Cmd-R
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })

    // Window menu
    template[4].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
  }
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}