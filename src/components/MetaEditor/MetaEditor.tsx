import { Fragment } from 'react'
import { AppState }    from '../../appState/AppState'
import { Action }   from '../../appState/Action'
import { defaultVars, stripSurroundingStyleTags } from '../../renderPreview/templates/getCss'
import { ColorPicker } from '../ColorPicker/ColorPicker'

import back from './back.svg'
import './MetaEditor.css'

type Kv = String | Textarea | Number | Select | Color;

interface BaseKv {
  name: string;
  label: string;
  placeholder?: string;
  onLoad?: (v: string) => string;
  onDone?: (v: string) => string;
}

interface String extends BaseKv {
  type: 'string';
}
interface Textarea extends BaseKv {
  type: 'textarea';
}
interface Number extends BaseKv {
  type: 'number';
  step: number;
}
interface Select extends BaseKv {
  type: 'select';
  options: string[];
}
interface Color extends BaseKv {
  type: 'color';
}

interface Props {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const MetaEditor = (props: Props) => {
  const { state, dispatch } = props
  const { doc } = state
  const renderKv = (kv: Kv) =>
    <Fragment key={kv.name}>
      <label htmlFor={kv.name}>
        { kv.label }:
      </label>
      { renderInput(kv) }
    </Fragment>

  const renderInput = (kv: Kv): JSX.Element => {
    const { onLoad, onDone, placeholder } = kv
    const key = kv.name
    const val = doc.meta[key]?.toString() || defaultVars[key] || ''
    const value = onLoad ? onLoad(val) : val
    const onChange = (
      e: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const v = typeof e === 'string' ? e : e.target.value
      dispatch({ type: 'setMetaAndRender', key, value: onDone ? onDone(v) : v })
    }
    const common = { id: kv.name, placeholder, value, onChange }
    switch(kv.type) {
      case 'string':   return <input    {...common} type='text' />
      case 'textarea': return <textarea {...common} />
      case 'number':   return <input    {...common}  type='number' step={kv.step} />
      case 'select':   return <select   {...common}>{kv.options.map(renderOption)}</select>
      case 'color':    return <ColorPicker {...common} />
    }
  }

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
          { metaKvs.map(renderKv) }
        </div>
        <h4>Layout</h4>
        <p className='darkmodewarning'>
          Previewing custom colors in dark mode is not supported.
        </p>
        <div className='kvs'>
          { layoutKvs.map(renderKv) }
        </div>
      </div>
    </div>
  )
}

const renderOption = (o: string) =>
  <option key={o} value={o || 'System font, sans-serif'}>{o}</option>

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
    ''
  , 'Georgia, serif'
  , 'Helvetica, Arial, sans-serif'
  , 'Palatino, Palatino Linotype, serif'
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
