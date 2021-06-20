import { Doc } from '../appState/AppState'
import { getCss } from './templates/getCss'

let singleFrame: HTMLIFrameElement | undefined
  , frame1: HTMLIFrameElement | undefined
  , frame2: HTMLIFrameElement | undefined
  ;

const injectMathCss = (contentWindow: Window) =>
  [ './katex/katex.min.css', './katex/texmath.css'].forEach(href =>
    contentWindow.document.head.appendChild( createLinkEl(href) )
  )

const interceptClicks = (contentWindow: Window, e: MouseEvent) => {
  e.preventDefault()
  e.returnValue = false
  if (e.target && ('href' in e.target)) {
    const target = e.target as HTMLAnchorElement
    const { href, hash } = target
    const hrefStart = href.substr(0, 7)
    if (hrefStart === "file://" && hash) {
      // probably in-document navigation by hash
      // this currently does not work in dev mode since hrefStart === http://localhost:3000, but works in prod build
      // Note that you need to add ids to link to manually in markdown, like `# myTitle {#myId}`
      const element = contentWindow.document.querySelector(hash)
      if (element) {
        element.scrollIntoView()
      }
    } else if (hrefStart === "http://" || hrefStart === "https:/") {
      // external link
      if (window.ipcApi) {
        window.ipcApi.send.openLink(href)
      } else {
        window.open(href, '_blank')
      }
    }
  }
  return false
}

async function insertFrame(
  src: string
, target: HTMLElement
, noScriptsInFrame: boolean
): Promise<HTMLIFrameElement> {
  const frame = document.createElement('iframe')
  if (noScriptsInFrame) {
    // adding a sandbox attribute prevents script execution. but we still set the frame to have same-origin as parent,
    // in order to write the text to be previewed into the frame directly instead of the slower window.postMessage.
    // we need allow-modals for window.print()
    frame.setAttribute('sandbox', 'allow-same-origin allow-modals')
  }
  frame.setAttribute('src', src)
  frame.setAttribute('style', 'width: 100%; height: 100%;')
  target.appendChild(frame)
  return new Promise(resolve => {
    const contentWindow = frame.contentWindow
    contentWindow?.addEventListener('DOMContentLoaded', () => {
      injectMathCss(contentWindow)
      contentWindow.addEventListener('click', e => interceptClicks(contentWindow, e))
      return resolve(frame);
    })
  })
}

async function setupSingleFrame(target: HTMLElement) {
  if (!singleFrame) {
    singleFrame = await insertFrame('previewFrame.html', target, true)
  }
  if (frame1) {
    frame1.remove();
    frame1 = undefined
  }
  if (frame2) {
    frame2.remove();
    frame2 = undefined
  }
  return singleFrame
}

const setupSwapFrames = async (target: HTMLElement) => {
  if (!frame1 || !frame2) {
    frame1 = await insertFrame('previewFramePaged.html', target, false)
    frame2 = await insertFrame('previewFramePaged.html', target, false)
  }
  if (singleFrame) {
    singleFrame.remove();
    singleFrame = undefined
  }
  return [frame1, frame2] as const
}

const renderAndSwap = async (
  previewDiv: HTMLDivElement
, renderFn: (w: Window) => Promise<Window>
): Promise<Window> => {
  const [f1, f2] = await setupSwapFrames(previewDiv)
  if (!f1.contentWindow) {
    throw Error('f1.contentWindow was null in renderAndSwap')
  }
  return renderFn(f1.contentWindow).then(() => {
    if (!f1.contentWindow || !f2.contentWindow) {
      throw Error(`contentWindow was null in renderAndSwap ${f1.contentWindow} ${f2.contentWindow}`)
    }
    f1.contentWindow?.scrollTo(0, f2.contentWindow.scrollY || 0)
    f1.style.top = '0'
    f2.style.top = '-1000vh'; // `display: none` would break pagedjs
    [frame2, frame1] = [frame1, frame2]
    return f1.contentWindow
  })
}


export const renderPlain = async (doc: Doc, previewDiv: HTMLDivElement): Promise<Window> => {
  const { contentWindow } = await setupSingleFrame(previewDiv);
  const content = [
          '<style>', await getCss(doc), '</style>'
        , doc.meta['header-includes']
        , doc.html
        ].join('')
  if (!contentWindow) {
    throw Error('contentWindow was undefined in renderPlain')
  }
  contentWindow.document.body.innerHTML = content
  return contentWindow
}

const createStyleEl = (text: string) => {
  const style = document.createElement('style')
  style.textContent = text
  return style
}

const createLinkEl = (href: string): HTMLLinkElement => {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', href)
  return link
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

export const renderPaged = async (doc: Doc, previewDiv: HTMLDivElement): Promise<Window> => {
  return renderAndSwap(previewDiv, async frameWindow => {

    const cssStr     = await getCss(doc)
        , metaHtml   = doc.meta['header-includes']
        , content    = doc.html
        , frameHead  = frameWindow.document.head
        , frameBody  = frameWindow.document.body
        ;

    // Unfortunately, pagedjs removes our style elements from <head>
    // and appends its transformed styles – on each render. Thus we not only
    // need to clear the body, but also remove the styles from the head.
    frameHead.querySelectorAll('style').forEach(s => s.remove())
    frameBody.innerHTML = content

    // repopulate styles
    injectMathCss(frameWindow)
    frameHead.appendChild( createStyleEl(cssStr) )
    if (typeof metaHtml === 'string') {
      frameHead.insertAdjacentHTML('beforeend', metaHtml)
    }
    frameHead.appendChild(pagedjsStyleEl);

    (frameWindow as any).PagedConfig = {
      auto: false
    };

    await new Promise(resolve => {
      const s = document.createElement('script')
      s.src = './paged.polyfill.js'
      s.async = false
      s.addEventListener('load', resolve)
      frameBody.appendChild(s)
    })

    // wait for images etc. to have loaded
    await new Promise(resolve => {
      if (frameWindow.document.readyState === 'complete') {
        resolve(undefined)
      } else {
        frameWindow.addEventListener('load', resolve, {once: true})
      }
    })

    return (frameWindow as any).PagedPolyfill.preview()
  })
}
