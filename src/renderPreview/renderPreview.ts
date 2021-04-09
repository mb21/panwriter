import { AppState } from '../appState/AppState'
import { convertMd } from './convertMd'
import { renderPlain, renderPaged } from './renderPreviewImpl'
import { clearPreview, initScroll } from './scrolling'

let renderInProgress = false
  , needsRerender = false
  , stateBuffer: AppState

/**
 * Converts md to html (eventually setting `state.doc.html`) and
 * renders into `state.previewDiv`.
 * Throttles when a render is still in progress.
 */
export const renderPreview = (state: AppState): void => {
  needsRerender = true
  if (state.split === 'onlyEditor') {
    clearPreview()
  } else {
    renderNext(state)
  }
}

/**
 * buffers the latest text change and renders when previous rendering is done
 */
const renderNext = (state: AppState) => {
  stateBuffer = state
  if (needsRerender && !renderInProgress) {
    renderInProgress = true
    render(state)
      .catch(e => console.warn('renderer crashed:', e.message, e.stack))
      .then(contentWindow => {
        renderInProgress = false
        if (contentWindow) {
          initScroll(contentWindow, state.paginated)
        }
        renderNext(stateBuffer)
      })
    needsRerender = false
  }
}

const render = async (state: AppState): Promise<Window | undefined> => {
  const { doc, paginated, previewDivRef } = state
  doc.html = convertMd(doc)
  const previewDiv = previewDivRef.current
  if (previewDiv) {
    if (paginated) {
      return renderPaged(doc, previewDiv)
    } else {
      return renderPlain(doc, previewDiv)
    }
  }
}
