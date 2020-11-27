"use strict";

var React      = require('react')
  , ReactColor = require('react-color')
  ;

exports.reactColor = function(props) {
  return React.createElement(ReactColor.SketchPicker, {
    color: props.color
  , disableAlpha: true
  , presetColors: []
  , onChange: function(c) {
      props.onChange(c.hex)();
    }
  });
}
