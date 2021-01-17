import { Doc, ViewSplit } from '../appState/AppState'

export type Action = {
  type: 'closeMetaEditorAndSetMd';
}
| {
  type: 'setMdAndRender';
  md: string;
}
| {
  type: 'setMetaAndRender';
  key: string;
  value: string;
}
| {
  type: 'setSplitAndRender';
  split: ViewSplit;
}
| {
  type: 'toggleMetaEditorOpen';
}
| {
  type: 'togglePaginated';
}
| {
  type: 'updateDoc';
  doc: Partial<Doc>;
}
