"use strict";

var ipcRenderer = require('electron').ipcRenderer

exports.on = function(channel) {
  return function(listener) {
    return function() {
      ipcRenderer.on(channel, function(event, arg){
        listener(arg)();
      });
    };
  };
};
