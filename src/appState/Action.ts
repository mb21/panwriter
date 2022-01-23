import { Doc, Settings, ViewSplit } from '../appState/AppState'

export type Action = {
  type: 'closeMetaEditorAndSetMd';
}
| {
  type: 'initDoc';
  doc: Pick<Doc, 'md' | 'fileName' | 'filePath' | 'fileDirty'>;
  settings: Settings;
}
| {
  type: 'loadSettings';
  settings: Settings;
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
