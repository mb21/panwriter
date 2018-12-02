"use strict";

async function insertFrame(src, target, sandbox=undefined) {
  var frame = document.createElement('iframe');
  if (sandbox !== undefined) {
    frame.setAttribute("sandbox", sandbox);
  }
  frame.setAttribute("src", src);
  frame.setAttribute("style", "width: 100%; height: 100%;");
  target.appendChild(frame);
  return new Promise(resolve =>
    frame.contentWindow.addEventListener('DOMContentLoaded', () => resolve(frame))
  )
}

var singleFrame
  , frame1
  , frame2
  ;

async function setupSingleFrame(target) {
  if (!singleFrame) {
    singleFrame = await insertFrame("previewFrame.html", target);
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

async function setupSwapFrames(target) {
  if (!frame1) {
    frame1 = await insertFrame("previewFramePaged.html", target)
    frame2 = await insertFrame("previewFramePaged.html", target)
  }
  if (singleFrame) {
    singleFrame.remove();
    singleFrame = undefined
  }
}

async function docToStr(doc) {
  var htmlStr  = doc.getHtml()
    , cssStr   = await doc.getCss()
    ;
  return [
      '<style>', cssStr, '</style>'
    , htmlStr
    ].join('')
}

async function renderAndSwap(previewDiv, renderFn) {
  await setupSwapFrames(previewDiv);
  return renderFn(frame1.contentWindow).then( function(){
    frame1.style.display = 'block';
    frame2.style.display = 'none';
    [frame2, frame1] = [frame1, frame2]
    return frame2.contentWindow.print;
  });
}


module.exports.plain = async function(doc, previewDiv){
  await setupSingleFrame(previewDiv);
  var content = await docToStr(doc);
  singleFrame.contentDocument.body.innerHTML = content;
  return singleFrame.contentWindow.print;
}

module.exports.pagedjs = async function(doc, previewDiv){
  return renderAndSwap(previewDiv, async function(frameWindow) {
    var content = await docToStr(doc);
    return frameWindow.render(content);
  })
}
