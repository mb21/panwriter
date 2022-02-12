---
title: PanWriter Manual
---

## Export preview to PDF

Select `File -> 'Print / PDF'` and `PDF -> 'Save as PDF'` in the print dialog (exact naming might depend on your OS).

This will export exactly what’s shown in the preview, and not use pandoc at all.

You can change the styling of the preview and immediately see the changes.

![](https://github.com/mb21/panwriter/raw/master/screenshot-css.png)

## Export via pandoc

First, install the [latest pandoc version](http://pandoc.org/installing.html), then:

Select `File -> Export` and choose a format.

![](https://github.com/mb21/panwriter/raw/master/screenshot-export.png)

If you have a YAML metadata block, like in the following example, PanWriter will look at the extension of the filename you chose in the dialog, and look up the corresponding key in the `output` YAML metadata, for example when exporting the following markdown to `test.html`:

    ---
    title: my document
    fontsize: 18px
    pdf-format: latex  # optional
    output:
      html:
        katex: true  # for math output
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

See the [pandoc user's guide](http://pandoc.org/MANUAL.html) for available options.

There are two exceptions to the rule that the key in the `output` YAML is the file extension:

1. When exporting to a `.tex` file, the key should be named `latex`.
2. When exporting to a `.pdf` file, the key for PanWriter to look up in the `output` YAML can be specified with the `pdf-format` key (see example above). Default is also `latex`, but you can also use `context`, `html`, `ms`, `beamer`, `revealjs`, etc.  In fact, you could set it to anything, if you had a corresponding key in the `output` YAML with a `to:` field. See also [Creating a PDF with pandoc](http://pandoc.org/MANUAL.html#creating-a-pdf).

## User Data Directory

You can place certain files in the PanWriter user directory, which [should be](https://electronjs.org/docs/api/app#appgetpathname):

- macOS: `/Users/your-user-name/Library/Application Support/PanWriterUserData`
- Linux: `~/.config/PanWriterUserData`
- Windows: `C:\Users\your-user-name\AppData\Local\PanWriterUserData`

If the directory does not exist, you can create it.

## Settings

If you put a `settings.yaml` file in the data directory, PanWriter will read it on startup. Possible fields are currently only:

    autoUpdateApp: true

## Default CSS and YAML

If you put a `default.yaml` file in the data directory, PanWriter will merge this with the YAML in your input file (to determine the command-line arguments to call pandoc with) and add the `--metadata-file` option. The YAML should be in the same format as above.

To include CSS in your `default.yaml`, you can also use the same format as in-document metadata, for example:

    header-includes: |-
      <style>
      blockquote {
        font-style: italic;
      }
      </style>

## Document types / themes

You can e.g. put `type: letter` in the YAML of your input document. In that case, PanWriter will look for `letter.yaml` instead of `default.yaml` in the user data directory.

## Markdown syntax

We use `markdown-it` for the preview pane, which is fully [CommonMark](https://commonmark.org/)-compliant. It supports [GFM](https://github.github.com/gfm/) tables (basically pandoc `pipe_tables`) and GFM Strikethrough (`strikeout`) out of the box. We also added a [bunch of plugins](https://github.com/mb21/markdown-it-pandoc), to make the preview behave as much as pandoc as possible (including attributes, [`fenced_divs`](http://pandoc.org/MANUAL.html#extension-fenced_divs), `definition_lists`, `footnotes`, `grid_tables`, `implicit_figures`, `subscript`, `superscript`, `yaml_metadata_block` and `tex_math_dollars`). We explicitly don't support `raw_html` or `raw_tex`, since everything should be doable with the `fenced_divs`, `bracketed_spans` and `raw_attribute` extensions.

However, there might still be minor differences between the preview and `File -> 'Print / PDF'` on one hand, and `File -> Export` on the other.

Things we should emulate in the preview, but for which there are [no markdown-it plugins yet](https://github.com/atom-community/markdown-preview-plus/wiki/markdown-it-vs.-pandoc):

- [`raw_attribute`](http://pandoc.org/MANUAL.html#extension-raw_attribute): we should probably just strip them from preview
- backslash at end of paragraph, e.g. `![](foo.png) \` An ugly workaround that already works is `![](foo.png) &nbsp;`

Pandoc markdown supports a few more things which will not render correctly in the preview, but which are not so commonly used. However, you can still use them in your markdown file, and export via pandoc will work.

## Launching from the command-line

You can set up your system to launch PanWriter with:

    panwriter myfile.md

On macOS, you should put the following in your `~/.bash_profile` or similar:

    function panwriter(){ open -a PanWriter "$@"; }

On Linux and Windows, you can make an alias to the correct location of the `panwriter` executable.


# About CSS for print

Unfortunately, still no browser fully implements the CSS specs for paged media (paged media are e.g. print or PDF). Therefore, PanWriter's preview is powered by [pagedjs](https://gitlab.pagedmedia.org/tools/pagedjs) – a collection of paged media polyfills by [pagedmedia.org](https://pagedmedia.org). Some background on using CSS for print:

- [Motivating article on A List Apart](https://alistapart.com/article/building-books-with-css3)
- [Print-CSS resources, tools](https://print-css.rocks)
- [W3C Paged Media Module](https://www.w3.org/TR/css-page-3/)
- [W3C Generated Content for Paged Media](https://www.w3.org/TR/css-gcpm-3/)

