var remote      = require('electron').remote
  , ipcRenderer = require('electron').ipcRenderer
  , fs          = require('fs')
  ;

var filePath = remote.getCurrentWindow().filePathToLoad
  , provideTextCb
  ;

exports.initFile = function(conf) {
  var compInstance = conf.compInstance;
  return function() {
    if (filePath) {
      fs.readFile(filePath, "utf8", function(err, text) {
        if (err) {
          alert("Could not open file.\n" + err.message);
        } else {
          conf.onFileLoad(text)();
        }
      });
    }
    provideTextCb = function(){ return compInstance.state.text };
  };
};

exports.setDocumentEdited = function() {
  var win = remote.getCurrentWindow();
  win.fileIsDirty = true;
  win.setDocumentEdited(true);
}

ipcRenderer.on('file-save', function() {
  if (filePath === undefined) {
    var win  = remote.getCurrentWindow();
    filePath = remote.dialog.showSaveDialog(win);
    if (filePath === undefined) {
      return;
    }
  }
  var content = provideTextCb();
  fs.writeFile(filePath, content, function(err){
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
