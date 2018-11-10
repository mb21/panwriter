"use strict";

var React        = require('react')
  , UnControlled = require('react-codemirror2').UnControlled
  , ipcRenderer  = require('electron').ipcRenderer
  ;

require('codemirror/addon/dialog/dialog');
require('codemirror/addon/search/search');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/jump-to-line');
require('codemirror/addon/mode/overlay');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/yaml/yaml');
require('codemirror/mode/yaml-frontmatter/yaml-frontmatter');
require('codemirror/addon/edit/continuelist');

var editor;

exports.uncontrolled = function(props) {
  var onChange = props.onChange
    , ps = Object.assign(props, {
               editorDidMount: function(ed) {
                 editor = ed;
                 if (props.options.autofocus) {
                  editor.focus();
                 }
               }
             , onChange: function (ed, diffData, value) {
                 onChange(value)();
               }
             }
           );
  return React.createElement(UnControlled, ps);
}

exports.replaceSelection = function(fn) {
  return function() {
    if (editor) {
      editor.replaceSelection( fn( editor.getSelection() ) );
    }
  }
}

ipcRenderer.on('find', function() {
  editor.execCommand('findPersistent');
})
ipcRenderer.on('findNext', function() {
  editor.execCommand('findPersistentNext');
})
ipcRenderer.on('findPrevious', function() {
  editor.execCommand('findPersistentPrev');
})
