import { AppState }    from '../../appState/AppState'
import { Action }   from '../../appState/Action'
import { defaultVars, stripSurroundingStyleTags } from '../../renderPreview/templates/getCss'

import back from './back.svg'
import './MetaEditor.css'
import { EditorKv, Kv } from '../EditorKv/EditorKv'

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}


export const MetaEditor = (props: Props) => {
  const { state, dispatch } = props
  const { meta } = state.doc

  const setKv = (key: string, value: string) =>
    dispatch({ type: 'setMetaAndRender', key, value })

  return (
    <div className='metaeditor'>
      <button
        className='backbtn'
        onClick={() => {
          dispatch({ type: 'closeMetaEditorAndSetMd' })
          dispatch({ type: 'toggleMetaEditorOpen' })
        }}
        >
        <img alt='back' src={back} draggable={false} />
      </button>
      <div className='content'>
        <h4>Document metadata</h4>
        <div className='kvs'>
          {metaKvs.map(kv =>
            <EditorKv
              key={kv.name}
              kv={kv}
              value={meta[kv.name]?.toString() || defaultVars[kv.name] || ''}
              setKv={setKv}
            />)}
        </div>
        <h4>Layout</h4>
        <p className='darkmodewarning'>
          Previewing custom colors in dark mode is not supported.
        </p>
        <div className='kvs'>
          {layoutKvs.map(kv =>
            <EditorKv
              key={kv.name}
              kv={kv}
              value={meta[kv.name]?.toString() || defaultVars[kv.name] || ''}
              setKv={setKv}
            />)}
        </div>
      </div>
    </div>
  )
}

const metaKvs: Kv[] = [{
  name: 'title'
, label: 'Title'
, type: 'string'
}, {
  name: 'author'
, label: 'Author'
, type: 'string'
}, {
  name: 'date'
, label: 'Date'
, type: 'string'
}, {
  name: 'lang'
, label: 'Language'
, type: 'string'
, placeholder: 'en'
}]

const layoutKvs: Kv[] = [{
  name: 'mainfont'
, label: 'Font'
, type: 'select'
, options: [
    { label: 'System font, sans-serif', value: '' }
  , { label: 'Georgia, serif', value: 'Georgia, serif' }
  , { label: 'Helvetica, Arial, sans-serif', value: 'Helvetica, Arial, sans-serif' }
  , { label: 'Palatino, Palatino Linotype, serif', value: 'Palatino, Palatino Linotype, serif' }
  ]
}, {
  name: 'fontsize'
, label: 'Font size'
, type: 'number'
, step: 1
, onLoad: s => s ? parseInt(s, 10).toString() : ''
, onDone: s => s + 'px'
}, {
  name: 'linestretch'
, label: 'Line height'
, type: 'number'
, step: 0.1
}, {
  name: 'fontcolor'
, label: 'Font color'
, type: 'color'
}, {
  name: 'linkcolor'
, label: 'Link color'
, type: 'color'
}, {
  name: 'monobackgroundcolor'
, label: 'Code bg'
, type: 'color'
}, {
  name: 'backgroundcolor'
, label: 'Background'
, type: 'color'
}, {
  name: 'header-includes'
, label: 'Include CSS'
, type: 'textarea'
, onLoad: stripSurroundingStyleTags
, onDone: s => `<style>\n${s}\n</style>`
, placeholder: `blockquote {
  font-style: italic;
}`
}]
