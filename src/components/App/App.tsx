import { createRef, useEffect, useReducer } from 'react'

import { AppState }     from '../../appState/AppState'
import { appStateReducer }  from '../../appState/appStateReducer'

import { Editor }       from '../Editor/Editor'
import { MetaEditor }   from '../MetaEditor/MetaEditor'
import { Preview }      from '../Preview/Preview'
import { Toolbar }      from '../Toolbar/Toolbar'
import { IpcApi } from '../../../electron/preload'
import { renderPreview } from '../../renderPreview/renderPreview'

import './App.css'

declare global {
  interface Window {
    ipcApi?: IpcApi; // optional in order to keep ability to run React app without Electron
  }
}

export const App = () => {
  const [state, dispatch] = useReducer(appStateReducer, initialState)
  window.ipcApi?.setStateAndDispatch(state, dispatch)

  useEffect(() => {
    if (state.split !== 'onlyEditor') {
      renderPreview(state)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.doc, state.split, state.paginated])

  return (
    <div className={`app ${state.split.toLowerCase()}`}>
      <Toolbar state={state} dispatch={dispatch} />
      <div className='editor'>
        { state.metaEditorOpen
          ? <MetaEditor state={state} dispatch={dispatch} />
          : null }
        <Editor state={state} dispatch={dispatch} />
      </div>
      <Preview
        ref={state.previewDivRef}
        paginated={state.paginated}
        />
    </div>
  );
}

const initialState: AppState = {
  doc: {
    md: ''
  , yaml: ''
  , bodyMd: ''
  , meta: {}
  , html: ''
  , fileName: 'Untitled'
  , filePath: undefined
  , fileDirty: false
  }
, metaEditorOpen: false
, split: 'onlyEditor'
, paginated: false
, previewDivRef: createRef()
}
