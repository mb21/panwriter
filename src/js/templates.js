"use strict";

// This hacky parser only supports one syntax: `foobar $if(X)$$X$$else$Y$endif$`
// which is converted to `["foobar ", {varName: "X", default: "Y"}, ... ]`
module.exports.parseToTemplate = str => {
  const arr = str.split(/\$if\([\w\-\.]+\)\$(\$[\w\-\.]+)\$\$else\$([^\$]+)\$endif\$/g);
  const template = [];
  for (let i=0; i<arr.length; i++) {
    if (arr[i][0] === '$') {
      const varName = arr[i].substr(1);
      i++;
      template.push({ varName, default: arr[i] });
    } else {
      template.push(arr[i]);
    }
  }
  return template;
}

module.exports.interpolateTemplate = (template, variables) =>
  template.map(t => {
    if (typeof t === 'string') {
      return t;
    } else {
      return variables[t.varName] || t.default
    }
  }).join('')

module.exports.extractDefaultVars = template =>
  template.reduce((acc, t) => {
    if (typeof t === 'object' && t.default != null) {
      acc[t.varName] = t.default;
    }
    return acc;
  }, {})
