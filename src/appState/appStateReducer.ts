import { AppState } from './AppState'
import { clearPreview, refreshEditor } from '../renderPreview/scrolling'
import { parseYaml, serializeMetaToMd } from '../renderPreview/convertYaml'
import { Action } from './Action'


export const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'closeMetaEditorAndSetMd': {
      const doc = {
        ...state.doc,
        md: serializeMetaToMd(state.doc),
        fileDirty: true
      }
      return { ...state, doc }
    }
    case 'initDoc': {
      const { settings } = action
      const { md } = action.doc
      const doc = { ...state.doc, ...action.doc, ...parseYaml(md) }
      return { ...state, doc, settings }
    }
    case 'loadSettings': {
      const { settings } = action
      return { ...state, settings }
    }
    case 'setMdAndRender': {
      const { md } = action
      const doc = {
        ...state.doc,
        ...parseYaml(md),
        md,
        fileDirty: true
      }
      return { ...state, doc }
    }
    case 'setMetaAndRender': {
      const { key, value } = action
      const doc = { ...state.doc }
      doc.meta[key] = value
      // doc.fileDirty = true
      return { ...state, doc }
    }
    case 'setSplitAndRender': {
      const { split } = action
      let { doc } = state
      if (split !== 'onlyEditor' && Object.keys(doc.meta).length === 0) {
        // for the case when the preview is shown for the first time
        doc = { ...doc, ...parseYaml(doc.md) }
      }
      if (split === 'onlyEditor') {
        clearPreview()
      }
      if (split !== 'onlyPreview') {
        setTimeout(refreshEditor)
      }
      return { ...state, doc, split }
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
