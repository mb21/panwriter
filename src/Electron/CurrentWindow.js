"use strict";

var remote = require('electron').remote;

exports.close = function() {
  var win = remote.getCurrentWindow();
  win.close();
}

exports.minimize = function() {
  var win = remote.getCurrentWindow();
  win.minimize();
}

exports.maximize = function() {
  var win = remote.getCurrentWindow();
  //win.isMaximized() ? win.unmaximize() : win.maximize();
  win.setFullScreen( !win.isFullScreen() )
}
