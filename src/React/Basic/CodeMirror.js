"use strict";

var React        = require('react')
  , ReactCM2     = require('react-codemirror2')
  , Controlled   = ReactCM2.Controlled
  , UnControlled = ReactCM2.UnControlled
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

function adjustProps(props, changeHandlerName) {
  var onChange = props[changeHandlerName]
    , onScroll = props.onScroll
    , onMount  = props.onEditorDidMount
    , moreProps = {
        editorDidMount: function (ed) {
          onEditorDidMount(props, ed);
          onMount(ed)();
        }
      , onScroll: onScroll
      }
    ;
  moreProps[changeHandlerName] = function (ed, diffData, value) {
    onChange(value)();
  }
  return Object.assign(props, moreProps);
}

exports.controlled = function(props) {
  return React.createElement(Controlled, adjustProps(props, 'onBeforeChange'));
}

exports.refresh = function() {
  if (editor) {
    // use timeout to prevent interaction with scroll-sync
    setTimeout( function(){
      editor.refresh()
    }, 0);
  }
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
