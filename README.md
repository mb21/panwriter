# Panwriter

## Usage

### Export preview to PDF

Select `File -> 'Print / PDF'` and `PDF -> 'Save as PDF'` in the print dialog (exact naming might depend on your OS).

This will export exactly as shown in the preview pane.

### Export via pandoc

Select `File -> Export` and choose a format.

If you have a YAML metadata block, like in the following example, Panwriter will look at the extension of the filename you chose in the dialog, and look up the corresponding key in the `output` YAML metadata, for example when exporting the following markdown to `test.html`:

    ---
    title: my document
    pdf-format: latex  # optional
    output:
      html:
        toc: true
        include-in-header:
          - foo.css
          - bar.js
      latex:
        pdf-engine: xelatex
        toc: true
        toc-depth: 3
        template: letter.tex
        metadata:
          fontsize: 12pt
      epub:
        to: epub2  # default would be epub3
    ---
    
    # my document

this command will be executed:

    pandoc --toc --include-in-header foo.css --include-in-header bar.js --output test.html --to html --standalone

There are two exceptions to the rule that the key in the `output` YAML is the file extension:

1. When exporting to a `.tex` file, the key should be named `latex`.
2. When exporting to a `.pdf` file, the key for Panwriter to look up in the `output` YAML can be specified with the `pdf-format` key (see example above). Default is also `latex`, but you can also use `context`, `html`, `ms`, `beamer`, `revealjs`, etc.  In fact, you could set it to anything, as long as you have a corresponding key in the `output` YAML, which has a `to:` field. See also [Creating a PDF with pandoc](http://pandoc.org/MANUAL.html#creating-a-pdf).

## Develop

    # Install JavaScript dependencies
    npm install

    # Install PureScript dependencies
    bower install

    # Compile PureScript
    pulp --watch build

    # rebuild packaged pagedjs (usually not necessary)
    npm install -g browserify
    cd previewFrame
    clear; cd pagedjs && npm run-script compile && cd .. && browserify previewFrame.js -o previewFrame.bundle.js

    # Run the app
    npm start


## Powered by

- [pandoc](http://pandoc.org/MANUAL.html) (import/export)
- [Electron](https://electronjs.org/docs/tutorial/application-architecture) (app framework)
- [CodeMirror](https://codemirror.net) (editor pane)
- [pagedjs](https://gitlab.pagedmedia.org/tools/pagedjs) (preview pane)
