import { AppState, ViewSplit } from './AppState'

export type PureAction = {
  type: 'toggleMetaEditorOpen';
}
| {
  type: 'setSplit';
  split: ViewSplit;
}
| {
  type: 'togglePaginated';
}
| {
  type: 'setText';
  text: string;
  }

export const pureReducer = (state: AppState, action: PureAction): AppState => {
  switch (action.type) {
    case 'toggleMetaEditorOpen': {
      return { ...state, metaEditorOpen: !state.metaEditorOpen }
    }
    case 'togglePaginated': {
      return { ...state, paginated: !state.paginated }
    }
    case 'setSplit': {
      return { ...state, split: action.split }
    }
    case 'setText': {
      const { doc } = state
      doc.md = action.text
      doc.fileDirty = true
      return { ...state, doc }
    }
  }
}
