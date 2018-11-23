"use strict";

var React        = require('react')
  , UnControlled = require('react-codemirror2').UnControlled
  , CodeMirror   = require('codemirror')
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

var editor
  , onEditorDidMount = function(props, ed) {
      editor = ed;
      if (props.options.autofocus) {
        editor.focus();
      }

      // adapted from https://codemirror.net/demo/indentwrap.html
      var charWidth = editor.defaultCharWidth()
        , basePadding = 4
        // matches markdown list `-`, `+`, `*`, `1.`, `1)` and blockquote `>` markers:
        , listRe = /(([-|\+|\*|\>]|\d+[\.|\)])\s+)(.*)/
        ;
      editor.on("renderLine", function(cm, line, elt) {
        var txt  = line.text
          , matches = txt.trim().match(listRe)
          ;
        if (matches && matches[1]) {
          var extraIndent = matches[1].length
            , columnCount = CodeMirror.countColumn(txt, null, cm.getOption("tabSize"))
            , off = (columnCount + extraIndent) * charWidth
            ;
          elt.style.textIndent = "-" + off + "px";
          elt.style.paddingLeft = (basePadding + off) + "px";
        }
      });
      editor.refresh();
    }
  ;

exports.uncontrolled = function(props) {
  var onChange = props.onChange
    , ps = Object.assign(props, {
               editorDidMount: onEditorDidMount.bind(this, props)
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
