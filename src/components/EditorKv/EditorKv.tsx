import { Fragment } from 'react'
import { ColorPicker } from '../ColorPicker/ColorPicker'

interface Props {
  kv: Kv;
  value: string;
  setKv: (key: string, value: string) => void;
}

export type Kv = String | Textarea | Number | Select | Color;

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
  options: Option[];
}
interface Color extends BaseKv {
  type: 'color';
}

interface Option {
  label: string;
  value: string;
}

export const EditorKv = (props: Props) => {
  const { kv } = props

  return (
    <Fragment key={kv.name}>
      <label htmlFor={kv.name}>
        { kv.label }:
      </label>
      { renderInput(props) }
    </Fragment>
  )
}

const renderInput = (props: Props): JSX.Element => {
  const { kv, value, setKv } = props
  const { onLoad, onDone, placeholder } = kv

  const onChange = (
    e: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const v = typeof e === 'string' ? e : e.target.value
    setKv(kv.name, onDone ? onDone(v) : v)
  }

  const common = { id: kv.name, placeholder, value: onLoad ? onLoad(value) : value, onChange }
  switch(kv.type) {
    case 'string':   return <input    {...common} type='text' />
    case 'textarea': return <textarea {...common} />
    case 'number':   return <input    {...common}  type='number' step={kv.step} />
    case 'select':   return <select   {...common}>{kv.options.map(renderOption)}</select>
    case 'color':    return <ColorPicker {...common} />
  }
}

const renderOption = ({ label, value }: Option) =>
  <option key={value} value={value}>{label}</option>

