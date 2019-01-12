"use strict";

const path   = require('path')
    , shell  = require('electron').shell
    , app = require('electron').remote.app
    ;

var singleFrame
  , frame1
  , frame2
  ;

function injectBaseTag(contentWindow, filePath) {
  // so relative image URLs etc. are found
  const cwd = path.dirname(filePath)
      , base = document.createElement('base')
      ;
  base.setAttribute("href", "file://" + cwd + path.sep);
  contentWindow.document.head.append(base);
}

function injectMathLib(contentWindow) {
  [ app.getAppPath() + "/node_modules/katex/dist/katex.min.css"
  , app.getAppPath() + "/node_modules/markdown-it-texmath/css/texmath.css"
  ].forEach(href => {
    const link = document.createElement('link');
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", href);
    contentWindow.document.head.appendChild(link);
  });
}

function interceptClicks(contentWindow, e) {
  e.preventDefault();
  e.returnValue = false;
  if (e.target.href) {
    const hrefStart = e.target.href.substr(0, 7);
    if (hrefStart === "file://" && e.target.hash) {
      // probably in-document navigation by hash
      const element = contentWindow.document.querySelector(e.target.hash);
      if (element) {
        element.scrollIntoView();
      }
    } else if(hrefStart === "http://" || hrefStart === "https:/") {
      // external link
      shell.openExternal(e.target.href);
    }
  }
  return false;
}

async function insertFrame(src, target, filePath=undefined, sandbox=undefined) {
  const frame = document.createElement('iframe');
  if (sandbox !== undefined) {
    frame.setAttribute("sandbox", sandbox);
  }
  frame.setAttribute("src", src);
  frame.setAttribute("style", "width: 100%; height: 100%;");
  target.appendChild(frame);
  return new Promise(resolve => {
    const contentWindow = frame.contentWindow
    contentWindow.addEventListener('DOMContentLoaded', () => {
      if (filePath) {
        injectBaseTag(contentWindow, filePath);
      }
      injectMathLib(contentWindow);
      contentWindow.addEventListener("click", interceptClicks.bind(this, contentWindow));
      return resolve(frame);
    })
  })
}

async function setupSingleFrame(target, filePath) {
  if (!singleFrame) {
    singleFrame = await insertFrame("previewFrame.html", target, filePath);
  }
  if (frame1) {
    frame1.remove();
    frame1 = undefined
  }
  if (frame2) {
    frame2.remove();
    frame2 = undefined
  }
}

async function setupSwapFrames(target, filePath) {
  if (!frame1) {
    frame1 = await insertFrame("previewFramePaged.html", target, filePath)
    frame2 = await insertFrame("previewFramePaged.html", target, filePath)
  }
  if (singleFrame) {
    singleFrame.remove();
    singleFrame = undefined
  }
}

async function renderAndSwap(previewDiv, filePath, renderFn) {
  await setupSwapFrames(previewDiv, filePath);
  return renderFn(frame1.contentWindow).then( function(){
    frame1.contentWindow.scrollTo(0, frame2.contentWindow.scrollY);
    frame1.style.display = 'block';
    frame2.style.display = 'none';
    [frame2, frame1] = [frame1, frame2];
    return frame2.contentWindow;
  });
}


module.exports.plain = async function(doc, previewDiv){
  await setupSingleFrame(previewDiv, doc.getPath());
  const cssStr = await doc.getCss()
      , content = [
          '<style>', cssStr, '</style>', doc.getHtml()
        ].join('')
  singleFrame.contentDocument.body.innerHTML = content;
  return singleFrame.contentWindow;
}

function createStyleEl(text) {
  const style = document.createElement('style');
  style.textContent = text;
  return style;
}

const pagedjsStyleEl = createStyleEl(`
@media screen {
  .pagedjs_pages {
    overflow: scroll;
    padding: 90px 50px 50px 50px;
  }

  .pagedjs_page {
    background-color: white;
    margin: 0 auto;
    margin-bottom: 50px;
  }
}
`);

module.exports.pagedjs = async function(doc, previewDiv){
  return renderAndSwap(previewDiv, doc.getPath(), async (frameWindow) => {

    const cssStr     = await doc.getCss()
        , content    = doc.getHtml()
        , frameHead  = frameWindow.document.head
        , renderTo   = frameWindow.document.body
        , renderDone = new Promise(resolveRender => {
            frameWindow.PagedConfig = {
              before: () => Promise.all(
                // wait for images to have loaded
                Array.from(renderTo.querySelectorAll('img')).map(img =>
                  new Promise(resolve => {
                    if (img.complete) {
                      resolve();
                    } else {
                      img.addEventListener('load',  resolve, {once: true});
                      img.addEventListener('error', resolve, {once: true});
                    }
                  })
                )
              )
            , after: resolveRender
            }
          });
        ;

    // Unfortunately, pagedjs removes our style elements from <head>
    // and appends its transformed styles – on each render.
    frameHead.querySelectorAll('style').forEach(s => s.remove())
    renderTo.innerHTML = content;

    // repopulate
    frameHead.appendChild( createStyleEl(cssStr) );
    frameHead.appendChild(pagedjsStyleEl);
    injectMathLib(frameWindow);

    const s = document.createElement('script');
    s.src = app.getAppPath() + "/node_modules/pagedjs/dist/paged.legacy.polyfill.js";
    s.async = false;
    renderTo.appendChild(s);

    return renderDone;
  })
}
