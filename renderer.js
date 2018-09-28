// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// following https://kritzcreek.github.io/posts/2016-07-05-purescript-electron.html
require('./output/Main').main()

const Previewer = require('pagedjs/lib').Previewer;
let renderTo = document.querySelector('.preview');
let content  = document.querySelector('.htmlEls');

document.querySelector('textarea').addEventListener('input', e => {
  let paged = new Previewer();
  renderTo.innerHTML = '';
  paged.preview(content, [], renderTo).then(flow => {
    console.log("Rendered", flow.total, "pages.");
  })
});