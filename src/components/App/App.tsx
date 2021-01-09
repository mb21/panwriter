import { createRef, useReducer } from 'react'

import { AppState }     from '../../appState/AppState'
import { asyncReducer } from '../../appState/asyncReducer'
import { pureReducer }  from '../../appState/pureReducer'

import { Editor }       from '../Editor/Editor'
import { MetaEditor }   from '../MetaEditor/MetaEditor'
import { Preview }      from '../Preview/Preview'
import { Toolbar }      from '../Toolbar/Toolbar'
import { IpcApi } from '../../../electron/preload'

import './App.css'

declare global {
  interface Window {
    ipcApi?: IpcApi; // optional in order to keep ability to run React app without Electron
  }
}

export const App = () => {
  const [state, disp] = useReducer(pureReducer, initialState)
  const dispatch = asyncReducer(disp)
  window.ipcApi?.setStateAndDispatch(state, dispatch)
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
        printPreview={() => undefined} // TODO
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
