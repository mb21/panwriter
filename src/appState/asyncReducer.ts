// import { ipcRenderer } from 'electron'

import { PureAction } from './pureReducer'
import { AppState, Doc } from '../appState/AppState'
import { renderPreview } from '../renderPreview/renderPreview'
import { parseYaml, serializeMetaToMd } from '../renderPreview/convertYaml'

export type Action = PureAction | {
  type: 'setMdAndRender';
  md: string;
  state: AppState;
}
| {
  type: 'setMetaAndRender';
  key: string;
  value: string;
  state: AppState;
}
| {
  type: 'closeMetaEditorAndSetMd';
  doc: Doc;
}

const convertAndRenderPreview = (state: AppState) => {
  const { doc } = state
  state.doc = { ...doc, ...parseYaml(doc.md) }
  renderPreview(state)
}

// modelled after https://gist.github.com/astoilkov/013c513e33fe95fa8846348038d8fe42#solution-3
export const asyncReducer = (
  dispatch: React.Dispatch<PureAction>
) => (async (action: Action): Promise<void> => {
  switch (action.type) {
    case 'closeMetaEditorAndSetMd': {
      // ipcRenderer.send('setWindowDirty')
      const md = serializeMetaToMd(action.doc)
      return dispatch({ type: 'setMdText', md })
    }
    case 'setMetaAndRender': {
      const { key, value, state } = action
      const { meta } = state.doc
      meta[key] = value
      renderPreview(state)
      return dispatch({ type: 'setMeta', meta })
    }
    case 'setMdAndRender': {
      // ipcRenderer.send('setWindowDirty')
      const { md } = action
      action.state.doc.md = md
      convertAndRenderPreview(action.state)

      return dispatch({ type: 'setMdText', md })
    }
    default: {
      return dispatch(action)
    }
  }
})
