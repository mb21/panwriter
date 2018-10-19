"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , remote      = require('electron').remote
  , fs          = require('fs')
  , Document    = require('../../Document')
  , Importer    = require('../../Importer')
  ;

exports.initFile = function(conf) {
  return function() {
    var win = remote.getCurrentWindow();
    var filePath = Document.getPath();
    if (filePath) {
      if (win.isFileToImport) {
        Importer.importFile(filePath, function(text) {
          conf.onFileLoad(text)();
        });
      } else {
        // open file
        fs.readFile(filePath, "utf8", function(err, text) {
          if (err) {
            alert("Could not open file.\n" + err.message);
          } else {
            conf.onFileLoad(text)();
          }
        });
      }
    }
  };
};

exports.setDocumentEdited = function() {
  var win = remote.getCurrentWindow();
  win.fileIsDirty = true;
  win.setDocumentEdited(true); //macOS-only
}

ipcRenderer.on('fileSave', function() {
  var filePath = Document.getPath();
  if (filePath === undefined) {
    var win  = remote.getCurrentWindow();
    filePath = remote.dialog.showSaveDialog(win, {
        defaultPath: 'Untitled.md'
      , filters: [
          { name: 'Markdown', extensions: ['md', 'txt', 'markdown'] }
        ]
      });
    if (filePath === undefined) {
      return;
    } else {
      Document.setPath(filePath);
    }
  }
  fs.writeFile(filePath, Document.getMd(), function(err){
    if (err) {
      alert("Could not save file.\n" + err.message);
    } else {
      var win = remote.getCurrentWindow();
      remote.getGlobal("setWindowTitle")(win, filePath);
      win.fileIsDirty = false;
      win.setDocumentEdited(false); //macOS-only
    }
  });
});