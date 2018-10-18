"use strict";

var ipcRenderer = require('electron').ipcRenderer
  , remote      = require('electron').remote
  , path        = require('path')
  , spawn       = require('child_process').spawn
  , Document    = require('./Document')
  ;

ipcRenderer.on('fileExport', function() {
  var opts = {}
    , win  = remote.getCurrentWindow()
    , to = 'html'
    , filePath = Document.getPath()
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
  pandoc.stdin.write( Document.getMd() );
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