"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , remote      = require('electron').remote
  , fs          = require('fs')
  , path        = require('path')
  , Document    = require('../../src/js/Document')
  , Importer    = require('../../src/js/Importer')
  ;

var onFileSaveCb;

exports.initFile = function(conf) {
  return function() {
    onFileSaveCb = conf.onFileSave;

    var fileLoaded = function(text) {
          win.fileIsDirty = false;
          conf.onFileLoad(name)(text)();
        }
      , win = remote.getCurrentWindow()
      , filePath = Document.getPath()
      ;

    if (filePath) {
      var name = filename(filePath);
      if (win.isFileToImport) {
        // import file
        Importer.importFile(filePath, fileLoaded);
      } else {
        // open file
        fs.readFile(filePath, "utf8", function(err, text) {
          if (err) {
            alert("Could not open file.\n" + err.message);
            win.close();
          } else {
            win.setTitle(name);
            win.setRepresentedFilename(filePath);
            fileLoaded(text);
          }
        });
      }
    }
  };
};

exports.setWindowDirty = function() {
  var win = remote.getCurrentWindow();
  win.fileIsDirty = true;
}

ipcRenderer.on('fileSave', function(_event, opts) {
  if (opts === undefined) {
    opts = {};
  }
  var filePath = Document.getPath();
  var filePathPromise = filePath === undefined || opts.saveAsNewFile
    ? remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
          defaultPath: 'Untitled.md'
        , filters: [
            { name: 'Markdown', extensions: ['md', 'txt', 'markdown'] }
          ]
        })
    : filePathPromise = Promise.resolve({filePath: filePath});

  filePathPromise.then(function(res) {
    filePath = res.filePath
    if (!filePath) {
      return;
    }
    fs.writeFile(filePath, Document.getMd(), function(err){
      if (err) {
        alert("Could not save file.\n" + err.message);
      } else {
        var win = remote.getCurrentWindow()
          , name = filename(filePath)
          ;
        Document.setPath(filePath);
        win.setTitle(name);
        win.setRepresentedFilename(filePath);
        win.fileIsDirty = false;
        onFileSaveCb(name)();
        if (opts.closeWindowAfterSave) {
          win.close();
        }
      }
    });
  })
});

function filename(filePath) {
  return path.basename(filePath, path.extname(filePath));
}
