"use strict";

var React        = require('react')
  , UnControlled = require('react-codemirror2').UnControlled
  ;

require('codemirror/addon/mode/overlay');
require('codemirror/mode/markdown/markdown');
require('codemirror/mode/yaml/yaml');
require('codemirror/mode/yaml-frontmatter/yaml-frontmatter');
require('codemirror/addon/edit/continuelist');

exports.uncontrolled = function(props) {
  var onChange = props.onChange
    , ps = Object.assign(props, {
               onChange: function (editor, diffData, value) {
                 onChange(value)();
               }
             }
           );
  return React.createElement(UnControlled, ps);
}