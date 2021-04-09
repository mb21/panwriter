import { useState } from 'react'
import { SketchPicker } from 'react-color'

import './ColorPicker.css'

interface Props {
  id: string;
  value: string;
  onChange: (s: string) => void;
}

export const ColorPicker = (props: Props) => {
  const { id, value, onChange } = props
  const [showPicker, setShowPicker] = useState(false)
  const focus = () => setShowPicker(true)
  return (
    <div className='colorpicker'>
      <input
        type='text'
        id={id}
        value={value}
        onFocus={focus}
        onChange={e => onChange(e.target.value)}
        />
      <div
        className='rectangle'
        style={{background: value}}
        onClick={focus}
        />
      { showPicker
        ? <>
            <div className='background' onClick={() => setShowPicker(false)} />
            <SketchPicker
              color={value}
              disableAlpha={true}
              presetColors={[]}
              onChange={c => onChange(c.hex)}
              />
          </>
        : null }
    </div>
  )
}
