// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// following https://kritzcreek.github.io/posts/2016-07-05-purescript-electron.html
require('./output/Main').main()



let iframe   = document.querySelector('.previewFrame');
let content  = document.querySelector('.htmlEls');

iframe.addEventListener("load", () => {
  document.querySelector('textarea').addEventListener('input', e => {
    iframe.contentWindow.render(content);
  });
});