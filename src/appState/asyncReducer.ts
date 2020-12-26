// import { ipcRenderer } from 'electron'

import { PureAction } from './pureReducer'
import { AppState } from '../appState/AppState'
import { renderPreview } from '../renderPreview/renderPreview'
import { parseYaml } from '../renderPreview/convertYaml'

export type Action = PureAction | {
  type: 'setMdAndRenderPreview';
  md: string;
  state: AppState;
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
    case 'setMdAndRenderPreview': {
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
