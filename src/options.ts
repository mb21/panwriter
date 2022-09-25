import { Kv } from "./components/EditorKv/EditorKv";

export interface ImportOpts {
  fromFormat: string | 'docx' | 'xml';
  fromOpts: {
    'track-changes': 'accept' | 'reject' | 'all';
    'extract-media': 'true' | '';
  };
  // toExtensions: Record<string, boolean>;
}

export const parseImportOpts = (opts: unknown): ImportOpts => {
  return opts as any // TODO
}

export const fromOptsKvs: Kv[] = [{
  name: 'track-changes'
, label: 'Docx track changes'
, type: 'select'
, options: [
    { label: 'Accept proposed changes', value: 'accept' }
  , { label: 'Reject proposed changes', value: 'reject' }
  ]
}, {
  name: 'extract-media'
, label: 'Docx extract images and media to folder'
, type: 'checkbox'
}]
