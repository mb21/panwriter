var remote      = require('electron').remote
  , ipcRenderer = require('electron').ipcRenderer
  , fs          = require('fs')
  , path        = require('path')
  , spawn       = require('child_process').spawn
  ;

var filePath = remote.getCurrentWindow().filePathToLoad
  , documentTextArea
  ;

exports.initFile = function(conf) {
  return function() {
    // somewhat hacky, but better for perfomance than to use a controlled-component
    // could also do https://github.com/scniro/react-codemirror2/issues/41#issuecomment-352029346
    documentTextArea = document.querySelector('.CodeMirror textarea');

    if (filePath) {
      fs.readFile(filePath, "utf8", function(err, text) {
        if (err) {
          alert("Could not open file.\n" + err.message);
        } else {
          conf.onFileLoad(text)();
        }
      });
    }
  };
};

exports.setDocumentEdited = function() {
  var win = remote.getCurrentWindow();
  win.fileIsDirty = true;
  win.setDocumentEdited(true);
}

function documentText() {
  return documentTextArea.value;
}

ipcRenderer.on('fileSave', function() {
  if (filePath === undefined) {
    var win  = remote.getCurrentWindow();
    filePath = remote.dialog.showSaveDialog(win);
    if (filePath === undefined) {
      return;
    }
  }
  fs.writeFile(filePath, documentText(), function(err){
    if (err) {
      alert("Could not save file.\n" + err.message);
    } else {
      var win = remote.getCurrentWindow();
      remote.getGlobal("setWindowTitle")(win, filePath);
      win.fileIsDirty = false;
      win.setDocumentEdited(false);
    }
  });
});

ipcRenderer.on('fileExport', function() {
  var opts = {}
    , win  = remote.getCurrentWindow()
    , to = 'html'
    , exportPath
    ;

  if (filePath === undefined) {
    exportPath = remote.dialog.showSaveDialog(win, {
      defaultPath: 'Untitled.' + to
    , buttonLabel: 'Export'
    });
    if (exportPath === undefined) {
      return;
    }
  } else {
    // write file with same name to same place
    opts.cwd   = path.dirname(filePath);
    exportPath = path.basename(filePath, path.extname(filePath)) + '.' + to;
  }

  var cmd  = 'pandoc'
    , args = ['-s', '-o', exportPath]
    ;
  var pandoc = spawn(cmd, args, opts);
  pandoc.stdin.write( documentText() );
  pandoc.stdin.end();

  pandoc.on('error', function(err) {
    alert("Failed to execute command:\n" +
      cmd + ' ' + args.join(' ') + '\n\n' + err.message);
  });

  var errout = [];
  pandoc.stderr.on('data', function(data) {
    errout.push(data);
  });
  
  pandoc.on('close', function(exitCode) {
    var success = exitCode === 0
      , toMsg = (success ? 'Exportet to: ' : 'Tried to export to: ') + exportPath
      ;
    remote.dialog.showMessageBox(win, {
      type:    success ? 'info' : 'error'
    , message: success ? 'Success!' : 'Failed to export'
    , detail:  [toMsg, ''].concat( errout.join('') ).join('\n')
    , buttons: ['OK']
    });
  });
});