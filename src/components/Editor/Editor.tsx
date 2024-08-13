import { indentWithTab } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { yamlFrontmatter } from '@codemirror/lang-yaml'
import { HighlightStyle, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { EditorState, Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { tags } from '@lezer/highlight'

import { AppState } from '../../appState/AppState'
import { Action }   from '../../appState/Action'
import { registerScrollEditor, scrollPreview } from '../../renderPreview/scrolling'

import './Editor.css'
import { useEffect, useRef } from 'react'

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const Editor = (props: Props) => {
  const { state, dispatch } = props
  const editorDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const extensions: Extension[] = [
      yamlFrontmatter({
        content: markdown({
          base: markdownLanguage,
        })
      }),
      syntaxHighlighting(myHighlightStyle),
      EditorView.lineWrapping,
      indentUnit.of('    '), // four spaces because of how numbered lists work in CommonMark
      keymap.of([indentWithTab]),
      EditorView.updateListener.of(update => {
        const md = update.state.doc.toString()
        dispatch({ type: 'setMdAndRender', md })
      }),
    ]

    const view = new EditorView({
      parent: editorDiv.current!,
      state: EditorState.create({
        doc: state.doc.md,
        extensions,
      }),
    })

    return () => view.destroy()
  }, [editorDiv]);

  return <div ref={editorDiv} />
}

// to debug, use:
// import { defaultHighlightStyle } from '@codemirror/language'
// const extensions = [ syntaxHighlighting(defaultHighlightStyle),
// console.log(defaultHighlightStyle.specs, defaultHighlightStyle.specs[7].tag.toString())
const myHighlightStyle = HighlightStyle.define([
  { tag: tags.definition(tags.propertyName), color: 'var(--highlight-font-color)' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.heading, color: 'var(--font-color) !important', fontWeight: 'bold' },
  { tag: tags.labelName, color: 'var(--highlight-font-color)' },
  { tag: tags.meta, color: 'var(--highlight-font-color)' },
  { tag: tags.strikethrough, textDecorationLine: 'line-through' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.url, color: 'var(--highlight-font-color)' },
])


/*
const onEditorDidMount = (editor: CMEditor) => {
  editor.focus();

  // https://codemirror.net/demo/indentwrap.html

  registerScrollEditor(editor);

  window.ipcApi?.on.find(         () => editor.execCommand('findPersistent'))
  window.ipcApi?.on.findNext(     () => editor.execCommand('findPersistentNext'))
  window.ipcApi?.on.findPrevious( () => editor.execCommand('findPersistentPrev'))


  const replaceSelection = (fn: (s: string) => string) =>
    editor.replaceSelection( fn( editor.getSelection() ) )

  window.ipcApi?.on.addBold(          () => replaceSelection(s => ['**', s, '**'].join('')) )
  window.ipcApi?.on.addItalic(        () => replaceSelection(s => ['_',  s, '_' ].join('')) )
  window.ipcApi?.on.addStrikethrough( () => replaceSelection(s => ['~~', s, '~~'].join('')) )
}
*/
