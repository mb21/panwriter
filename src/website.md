## Distraction-free writing environment

Focus on the content of your text. No fiddling around in menus or getting distracted by buttons. No selecting fonts and layouting before your text is actually written. Instead, you can write text in [Markdown](https://commonmark.org/help/) – a convention on how to write plain text files. Basically, it's like you would write an Email.

![Markdown on the left, preview on the right](https://github.com/mb21/panwriter/raw/master/screenshot.png)

PanWriter highlights a few things, like headings, for you. Other than that, it just gets out of the way, so you can focus on your text.


## Beautifully simple GUI – all the power of pandoc underneath

[Pandoc](https://pandoc.org) is a well-known and treasured tool among hackers.[^1] It can convert between all sorts of document formats – from and to Markdown, HTML webpages, MS Office Word `.docx`, EPUB eBooks, LaTeX for academic publishing, and many more. You can even generate PDF and PowerPoint slide-shows, as well as export to InDesign ICML. But until now, users had to master the command-line, before they could tap into the power of pandoc. No longer!

But if you eventually need to automate your workflow, it's easy to start using pandoc on the command-line, write [pandoc scripts](http://pandoc.org/lua-filters.html) that transform your documents in highly customizable ways, or integrate with web services or other applications – all while continuing to write in PanWriter.

[^1]: [Hacker-News](https://news.ycombinator.com/item?id=17855104)


## Import/Export: Word, HTML and plenty of other formats

Simply drag a `.docx`-file onto the PanWriter app: it will be converted to Markdown and opened so you can edit the text in the distraction-free writing environment of PanWriter. When you're done, use `File -> Export` to convert the text back to .docx, or any other of pandoc's output formats.

![Export formats](https://github.com/mb21/panwriter/raw/master/screenshot-export.png)


## Paginated preview for print and PDF

Once you've written a first draft of your text, you might want to see how it would look like in print. Instead of exporting, you can simply open the preview pane. A unique feature among markdown editors is that PanWriter actually lays out your text on pages in the preview – suddenly your text becomes tangible, and you can see where pagebreaks end up.

It's not a good idea to start layouting before you've finished the hard work of the first few drafts. But once you're there, you can apply a pre-defined layout template – or tune the layout yourself by adding a few lines of [CSS](https://developer.mozilla.org/docs/Glossary/CSS), the layouting language of the web. Changes are reflected live in the preview.

![CSS is reflected live](https://github.com/mb21/panwriter/raw/master/screenshot-css.png)


## Free and Open Source

PanWriter is free and open source software. Visit [PanWriter on GitHub](https://github.com/mb21/panwriter#panwriter) and please open an issue if you have a question or would like to give feedback.
