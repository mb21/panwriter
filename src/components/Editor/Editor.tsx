import { countColumn } from 'codemirror'
// import { ipcRenderer } from 'electron'
import { Controlled as CodeMirror, IInstance } from 'react-codemirror2'
/*
import from 'codemirror/addon/dialog/dialog'
import from 'codemirror/addon/search/search'
import from 'codemirror/addon/search/searchcursor'
import from 'codemirror/addon/search/jump-to-line'
import from 'codemirror/addon/mode/overlay'
import from 'codemirror/mode/markdown/markdown'
import from 'codemirror/mode/yaml/yaml'
import from 'codemirror/mode/yaml-frontmatter/yaml-frontmatter'
import from 'codemirror/addon/edit/continuelist'
*/

import { AppState } from '../../appState/AppState'
import { Action }   from '../../appState/asyncReducer'
import { registerScrollEditor, scrollPreview } from '../../renderPreview/scrolling'

import './Editor.css'

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const Editor = (props: Props) => {
  const { state, dispatch } = props
  return (
    <CodeMirror
      onBeforeChange={ (_ed, _diff, md) =>
        dispatch({ type: 'setMdAndRenderPreview', md, state })
      }
      onScroll={scrollPreview}
      editorDidMount={onEditorDidMount}
      value={state.doc.md}
      autoCursor={true}
      options={codeMirrorOptions}
      />
  )
}

const codeMirrorOptions = {
  mode: {
    name: 'yaml-frontmatter'
  , base: 'markdown'
  }
, theme: 'paper'
, indentUnit: 4 // because of how numbered lists behave in CommonMark
, tabSize: 4
, lineNumbers: false
, lineWrapping: true
, autofocus: true
, extraKeys: {
    Enter: 'newlineAndIndentContinueMarkdownList'
  , Tab: 'indentMore'
  , 'Shift-Tab': 'indentLess'
  }
}

const onEditorDidMount = (editor: IInstance) => {
  editor.focus();

  // adapted from https://codemirror.net/demo/indentwrap.html
  const charWidth = editor.defaultCharWidth()
  const basePadding = 4
  // matches markdown list `-`, `+`, `*`, `1.`, `1)` and blockquote `>` markers:
  // eslint-disable-next-line no-useless-escape
  const listRe = /^(([-|\+|\*|\>]|\d+[\.|\)])\s+)(.*)/

  editor.on('renderLine', (cm, line, elt) => {
    const txt = line.text
    const matches = txt.trim().match(listRe)
    if (matches && matches[1]) {
      const extraIndent = matches[1].length
      const columnCount = countColumn(txt, null, cm.getOption('tabSize') || 4)
      const off = (columnCount + extraIndent) * charWidth
      elt.style.textIndent = '-' + off + 'px';
      elt.style.paddingLeft = (basePadding + off) + 'px';
    }
  });
  editor.refresh();

  registerScrollEditor(editor);

  // ipcRenderer.on('find',         () => editor.execCommand('findPersistent'))
  // ipcRenderer.on('findNext',     () => editor.execCommand('findPersistentNext'))
  // ipcRenderer.on('findPrevious', () => editor.execCommand('findPersistentPrev'))
}

/*
exports.replaceSelection = (fn) => {
  if (editor) {
    editor.replaceSelection( fn( editor.getSelection() ) );
  }
}
*/
