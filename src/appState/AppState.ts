export interface AppState {
  doc: Doc;
  metaEditorOpen: boolean;
  split: ViewSplit;
  paginated: boolean;
}

export interface Doc {
  md: string;
  yaml: string;
  bodyMd: string;
  meta: Meta;
  html: string;
  fileName?: string;
  filePath?: string;
  fileDirty: boolean;
}

export type Meta = object;

export const viewSplits = ['onlyEditor', 'split', 'onlyPreview'] as const
export type ViewSplit = typeof viewSplits[number]
