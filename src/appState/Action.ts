import { AppState, Doc, ViewSplit } from '../appState/AppState'
import { PureAction } from './pureReducer'

export type Action = PureAction
| {
  type: 'closeMetaEditorAndSetMd';
  doc: Doc;
}
| {
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
  type: 'setSplitAndRender';
  split: ViewSplit;
  state: AppState;
}
