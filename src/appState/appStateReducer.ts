import { AppState } from './AppState'
import { renderPreview } from '../renderPreview/renderPreview'
import { refreshEditor } from '../renderPreview/scrolling'
import { parseYaml, serializeMetaToMd } from '../renderPreview/convertYaml'
import { Action } from './Action'


export const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'closeMetaEditorAndSetMd': {
      const { doc } = state
      doc.md = serializeMetaToMd(doc)
      doc.fileDirty = true
      return { ...state, doc }
    }
    case 'setMdAndRender': {
      const { md } = action
      const { doc } = state
      doc.md = md
      doc.fileDirty = true
      const newState = { ...state, doc }
      parseYamlAndRenderPreview(newState)
      return newState
    }
    case 'setMetaAndRender': {
      const { key, value } = action
      const { doc } = state
      doc.meta[key] = value
      renderPreview(state)
      // doc.fileDirty = true
      return { ...state, doc }
    }
    case 'setSplitAndRender': {
      const { split } = action
      const newState = { ...state, split }
      if (split !== 'onlyEditor') {
        // for the case when the preview is shown for the first time
        parseYamlAndRenderPreview(newState)
      }
      if (split !== 'onlyPreview') {
        setTimeout(refreshEditor)
      }
      return newState
    }
    case 'toggleMetaEditorOpen': {
      return { ...state, metaEditorOpen: !state.metaEditorOpen }
    }
    case 'togglePaginated': {
      return { ...state, paginated: !state.paginated }
    }
    case 'updateDoc': {
      const doc = { ...state.doc, ...action.doc }
      return { ...state, doc }
    }
  }
}

const parseYamlAndRenderPreview = (state: AppState) => {
  const { doc } = state
  state.doc = { ...doc, ...parseYaml(doc.md) }
  renderPreview(state)
}
