import { Editor } from 'codemirror'
import { throttle } from './throttle'

let editor: Editor
  , editorOffset = 0
  , scrollEditorFn: ((e: Event) => void) | undefined
  , scrollMap: number[] | undefined
  , reverseScrollMap: number[] | undefined
  , frameWindow: Window | undefined
  , scrollSyncTimeout: NodeJS.Timeout | undefined // shared between scrollPreview and scrollEditorFn
  , paginated = false

export const printPreview = () => {
  if (frameWindow) {
    frameWindow.print()
  } else {
    alert('To print, please open a preview view first (e.g. View -> Show Split View)')
  }
}

window.ipcApi?.on.printFile(printPreview)

export const initScroll = (contentWindow: Window, isPaginated: boolean) => {
  paginated = isPaginated
  resetScrollMaps();
  frameWindow = contentWindow
  frameWindow.addEventListener('resize', resetScrollMaps);
  if (scrollEditorFn) {
    frameWindow.addEventListener('scroll', scrollEditorFn);
  }
}

export const clearPreview = () => {
  frameWindow = undefined;
}

export const refreshEditor = () => {
  if (editor) {
    editor.refresh()
  }
}

export const scrollPreview = throttle(() => {
  if (frameWindow) {
    if (!scrollMap) {
      buildScrollMap(editor, editorOffset);
    }
    var scrollTop = Math.round(editor.getScrollInfo().top)
      , scrollTo = scrollMap![scrollTop]
      ;
    if (scrollTo !== undefined && frameWindow) {
      frameWindow.scrollTo(0, scrollTo);
    }
  }
}, 30, scrollSyncTimeout);

export const registerScrollEditor = (ed: Editor) => {
  editor = ed;
  const codeMirrorLines = document.querySelector('.CodeMirror-lines')
  editorOffset = codeMirrorLines
    ? parseInt(window.getComputedStyle(codeMirrorLines).getPropertyValue('padding-top'), 10)
    : 0
  var editorScrollFrame = document.querySelector('.CodeMirror-scroll')

  scrollEditorFn = throttle( (e: Event) => {
    e.preventDefault();
    if (frameWindow !== undefined) {
      if (!reverseScrollMap) {
        buildScrollMap(editor, editorOffset);
      }
      for (var i=frameWindow.scrollY; i>=0; i--) {
        if (reverseScrollMap![i] !== undefined) {
          editorScrollFrame?.scrollTo(0, reverseScrollMap![i])
          break;
        }
      }
    }
  }, 30, scrollSyncTimeout);
}

/*
 * Private functions
 */

const buildScrollMap = (editor: Editor, editorOffset: number) => {
  if (!frameWindow) {
    console.error('frameWindow was undefined in buildScrollMap')
    return
  }

  // scrollMap maps source-editor-line-offsets to preview-element-offsets
  // (offset is the number of vertical pixels from the top)
  scrollMap = [];
  scrollMap[0] = 0;
  reverseScrollMap = [];

  // lineOffsets[i] holds top-offset of line i in the source editor
  var lineOffsets = [undefined as any as number, 0]
    , knownLineOffsets = []
    , offsetSum = 0
    ;
  editor.eachLine((line: any) => {
    offsetSum += line.height;
    lineOffsets.push(offsetSum);
  });

  var lastEl: Element | undefined = undefined
    , selector = paginated ? '.pagedjs_page_content [data-source-line]'
                           : 'body > [data-source-line]'
    ;
  for (const el of frameWindow.document.querySelectorAll(selector)) {
    // for each element in the preview with source annotation
    var line = parseInt(el.getAttribute('data-source-line') || '1', 10)
      , lineOffset = lineOffsets[line]
      , elOffset = Math.round(el.getBoundingClientRect().top + frameWindow.scrollY);
      ;
    // fill in the target offset for the corresponding editor line
    if (scrollMap[lineOffset] === undefined) {
      // after pagination, we can have two elements in the preview
      // that have the same source line. We only use the first.
      scrollMap[lineOffset] = elOffset - editorOffset;
      knownLineOffsets.push(lineOffset)
    }

    lastEl = el;
  }
  if (lastEl) {
    scrollMap[offsetSum] = Math.ceil(lastEl.getBoundingClientRect().bottom + frameWindow.scrollY);
    knownLineOffsets.push(offsetSum);
  }

  if (knownLineOffsets[0] !== 0) {
    // make sure line zero is in the list, to guarantee a smooth scrolling start
    knownLineOffsets.unshift(0);
  }

  // fill in the blanks by interpolating between the two closest known line offsets
  var j = 0;
  for (var i=1; i < offsetSum; i++) {
    if (scrollMap[i] === undefined) {
      var a = knownLineOffsets[j]
        , b = knownLineOffsets[j + 1]
        ;
      scrollMap[i] = Math.round(( scrollMap[b]*(i - a) + scrollMap[a]*(b - i) ) / (b - a));
    } else {
      j++;
    }
    reverseScrollMap[ scrollMap[i] ] = i;
  }
}

const resetScrollMaps = () => {
  scrollMap = undefined;
  reverseScrollMap = undefined;
}
