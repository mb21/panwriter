## TODOs

- Preview:
    - respect `css`, `toc` metadata fields
- Editor:
    - expand `Format` menu
    - spell check
    - improve find/replace
- expand things that can be controlled from the `settings.yaml` file (possibly add a Settings/Preferences window to add that file):
    - set a CodeMirror editor theme css
    - edit the default CSS and YAML files
    - choose `pandoc` executable (probably with file-open dialog, which we can use for app sandboxing with security-scoped bookmarks)
- Write pandoc lua filter that does some PanWriter-specific transformations:
  - add [page-break syntax](https://github.com/jgm/pandoc/issues/1934#issuecomment-274327751)
  - [Variable substitution in body](https://github.com/jgm/pandoc/issues/1950#issuecomment-427671251)
  - read out `type` metadata and if it references a css file, put the path into the `css` metadata variable
- GUI popup on file import: at least allow to set `-f`, `-t`, `--track-changes` and `--extract-media` pandoc options.
- Unify PanWriter custom document type and pandoc template concepts?
- Rename `type` metadata key to `doctype`?
