import { Meta } from '../../appState/AppState'

type Template = Array<string | { varName: string; default: string }>;

// This hacky parser only supports one syntax: `foobar $if(X)$$X$$else$Y$endif$`
// which is converted to `["foobar ", {varName: "X", default: "Y"}, ... ]`
export const parseToTemplate = (str: string): Template => {
  const arr = str.split(/\$if\([\w\-.]+\)\$(\$[\w\-.]+)\$\$else\$([^$]+)\$endif\$/g);
  const template: Template = [];
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

export const interpolateTemplate = (
  template: Template,
  variables: Meta
): string =>
  template.map(t => {
    if (typeof t === 'string') {
      return t;
    } else {
      const v = variables[t.varName]
      return typeof v === 'string' ? v : t.default
    }
  }).join('')

export const extractDefaultVars = (template: Template): Record<string, string> =>
  template.reduce((acc, t) => {
    if (typeof t === 'object' && t.default != null) {
      acc[t.varName] = t.default;
    }
    return acc;
  }, {} as Record<string, string>)
