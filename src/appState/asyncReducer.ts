import { AppState } from './AppState'
import { Action } from '../appState/Action'
import { PureAction } from './pureReducer'
import { renderPreview } from '../renderPreview/renderPreview'
import { refreshEditor } from '../renderPreview/scrolling'
import { parseYaml, serializeMetaToMd } from '../renderPreview/convertYaml'

const parseYamlAndRenderPreview = (state: AppState) => {
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
      const md = serializeMetaToMd(action.doc)
      return dispatch({ type: 'setMdText', md })
    }
    case 'setMdAndRender': {
      const { md, state } = action
      state.doc.md = md
      parseYamlAndRenderPreview(state)
      return dispatch({ type: 'setMdText', md })
    }
    case 'setMetaAndRender': {
      const { key, value, state } = action
      const { meta } = state.doc
      meta[key] = value
      renderPreview(state)
      return dispatch({ type: 'setMeta', meta })
    }
    case 'setSplitAndRender': {
      const { split } = action
      if (split !== 'onlyEditor') {
        // for the case when the preview is shown for the first time
        parseYamlAndRenderPreview({ ...action.state, split })
      }
      if (split !== 'onlyPreview') {
        setTimeout(refreshEditor)
      }
      return dispatch({ type: 'setSplit', split })
    }
    default: {
      return dispatch(action)
    }
  }
})
