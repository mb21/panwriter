import { forwardRef, useState } from 'react'

import './Preview.css'

interface Props {
  paginated: boolean;
  printPreview: () => void;
}

export const Preview = forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { paginated } = props
  const [zoom, setZoom] = useState(1.0)
  return (
    <div className={`preview${paginated ? ' paginated' : ''}`}>
      <div
        ref={ref}
        className='previewDiv'
        style={{
          transform: `scale(${zoom})`
        , width:  `${100.0 / zoom}%`
        , height: `${100.0 / zoom}%`
        , transformOrigin: "0 0"
        }}
        />
      <button className='zoomBtn zoomIn'  onClick={() => setZoom(z => z + 0.125)}>+</button>
      <button className='zoomBtn zoomOut' onClick={() => setZoom(z => z - 0.125)}>-</button>
      <button className='exportBtn' onClick={props.printPreview}>🖨</button>
    </div>
  )
})
