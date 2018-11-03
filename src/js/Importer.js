"use strict";

// TODO: GUI popup for import options, at least for:
// -f, -t, --track-changes and --extract-media

const spawn  = require('child_process').spawn
    , remote = require('electron').remote
    , path   = require('path')
    ;

module.exports.importFile = function(inputPath, cb) {
  const win  = remote.getCurrentWindow()
      , cmd  = 'pandoc'
      , args = [ inputPath, '--wrap=none', '--columns=65', '--atx-headers'
               , '-t', 'markdown-raw_html-raw_tex-header_attributes-fancy_lists-simple_tables-multiline_tables-grid_tables'
               ]
      , cwd  = path.dirname(inputPath)
      , cmdDebug = cmd + ' ' + args.join(' ')
      ;
  const pandoc = spawn(cmd, args, {cwd: cwd});

  pandoc.on('error', function(err) {
    alert("Failed to execute command:\n" + cmdDebug + '\n\n' + err.message
      + '\n\nHave you installed pandoc?');
  });

  const stdout = [];
  pandoc.stdout.on('data', function(data) {
    stdout.push(data);
  });

  const errout = [];
  pandoc.stderr.on('data', function(data) {
    errout.push(data);
  });
  
  pandoc.on('close', function(exitCode) {
    const success = exitCode === 0
        , toMsg = "Called: " + cmdDebug
        ;
    if (success) {
      cb( stdout.join('') );
    } else {
      remote.dialog.showMessageBox(win, {
        type:    'error'
      , message: 'Failed to import'
      , detail:  [toMsg, ''].concat( errout.join('') ).join('\n')
      , buttons: ['OK']
      });
      win.close();
    }
  });
}
