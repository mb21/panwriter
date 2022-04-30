export interface ImportOpts {
  fromFormat: string | 'docx' | 'xml';
  fromOpts: {
    'track-changes': 'accept' | 'reject' | 'all';
    'extract-media': boolean;
    wrap: 'auto' | 'none' | 'preserve';
  };
  toExtensions: Record<string, boolean>;
}
