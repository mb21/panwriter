<img src="icons/icon.png" align="right" width="128">

# PanWriter

PanWriter is a distraction-free markdown editor with two unique features:

1. Tight integration with pandoc for import/export to/from plenty of file formats (including HTML, docx, LaTeX and EPUB).
2. Preview pane that can show pages – including page breaks etc. Layout adjustments are immediately reflected in the preview.

Read the **[MANUAL](https://www.panwriter.com/MANUAL.html)** for more info.

**[Download PanWriter](https://www.panwriter.com)**

You also have to [install pandoc](https://pandoc.org/installing.html) to export to most formats.

![](screenshot.png)

Feedback, suggestions and contributions very much welcome! Please open an issue to start a conversation.


## Develop

Install git (if you haven't already) and [install Volta](https://docs.volta.sh/guide/getting-started) (which will make the correct Node.js and Yarn versions availlable in the project directory), then:

    git clone git@github.com:mb21/panwriter.git
    cd panwriter
    yarn install

    ## To run the app in development mode:
    yarn run electron:dev

    ## To build distributable app package (goes to ./dist):
    yarn dist

Check out the `package.json` for more scripts to run.


## Powered by

PanWriter is powered by (amongst other open source libraries):

- [pandoc](http://pandoc.org) (import/export)
- [Electron](https://electronjs.org) (app framework)
- [CodeMirror](https://codemirror.net) (editor)
- For the preview pane:
    - [pagedjs](https://gitlab.pagedmedia.org/tools/pagedjs)
    - [markdown-it](https://github.com/markdown-it/markdown-it#markdown-it)
    - [KaTeX](https://katex.org)
