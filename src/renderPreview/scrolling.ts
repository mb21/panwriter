import { Editor } from 'codemirror'

let editor: Editor
  , editorOffset = 0
  , scrollEditorFn: ((e: Event) => void) | undefined
  , scrollMap: number[] | undefined
  , reverseScrollMapEntries: Array<{previewPos: number, editorPos: number}> | undefined
  , frameWindow: Window | undefined
  , scrollPreviewPending = false
  , scrollEditorPending = false
  , paginated = false

// Binary search to find the closest entry for a given preview scroll position
const findEditorPosition = (previewScrollY: number): number | undefined => {
  if (!reverseScrollMapEntries || reverseScrollMapEntries.length === 0) {
    return undefined;
  }

  let left = 0;
  let right = reverseScrollMapEntries.length - 1;

  // Handle edge cases
  if (previewScrollY <= reverseScrollMapEntries[0].previewPos) {
    return reverseScrollMapEntries[0].editorPos;
  }
  if (previewScrollY >= reverseScrollMapEntries[right].previewPos) {
    return reverseScrollMapEntries[right].editorPos;
  }

  // Binary search for closest position
  while (left < right - 1) {
    const mid = Math.floor((left + right) / 2);
    if (reverseScrollMapEntries[mid].previewPos <= previewScrollY) {
      left = mid;
    } else {
      right = mid;
    }
  }

  // Return the closest match (prefer the one before current position)
  return reverseScrollMapEntries[left].editorPos;
}

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

export const scrollPreview = () => {
  if (!scrollPreviewPending && frameWindow) {
    scrollPreviewPending = true;
    requestAnimationFrame(() => {
      if (frameWindow) {
        if (!scrollMap) {
          buildScrollMap(editor, editorOffset);
        }
        const scrollTop = Math.round(editor.getScrollInfo().top);
        const scrollTo = scrollMap![scrollTop];
        if (scrollTo !== undefined) {
          frameWindow.scrollTo(0, scrollTo);
        }
      }
      scrollPreviewPending = false;
    });
  }
};

export const registerScrollEditor = (ed: Editor) => {
  editor = ed;
  const codeMirrorLines = document.querySelector('.CodeMirror-lines')
  editorOffset = codeMirrorLines
    ? parseInt(window.getComputedStyle(codeMirrorLines).getPropertyValue('padding-top'), 10)
    : 0
  const editorScrollFrame = document.querySelector('.CodeMirror-scroll')

  scrollEditorFn = (e: Event) => {
    e.preventDefault();
    if (!scrollEditorPending && frameWindow !== undefined) {
      scrollEditorPending = true;
      requestAnimationFrame(() => {
        if (frameWindow !== undefined) {
          if (!reverseScrollMapEntries) {
            buildScrollMap(editor, editorOffset);
          }
          const editorPos = findEditorPosition(frameWindow.scrollY);
          if (editorPos !== undefined) {
            editorScrollFrame?.scrollTo(0, editorPos);
          }
        }
        scrollEditorPending = false;
      });
    }
  };
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

  // We'll build reverseScrollMapEntries as a sorted array for O(log n) binary search
  const reverseEntries: Array<{previewPos: number, editorPos: number}> = [];

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
    // Use Math.round for consistency with other rounding operations
    scrollMap[offsetSum] = Math.round(lastEl.getBoundingClientRect().bottom + frameWindow.scrollY);
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
    // Build sorted array entries for binary search
    reverseEntries.push({
      previewPos: scrollMap[i],
      editorPos: i
    });
  }

  // Sort by preview position for binary search and remove duplicates
  reverseEntries.sort((a, b) => a.previewPos - b.previewPos);

  // Deduplicate: keep last entry for each preview position (most accurate)
  const deduped: Array<{previewPos: number, editorPos: number}> = [];
  for (let i = 0; i < reverseEntries.length; i++) {
    if (i === reverseEntries.length - 1 ||
        reverseEntries[i].previewPos !== reverseEntries[i + 1].previewPos) {
      deduped.push(reverseEntries[i]);
    }
  }

  reverseScrollMapEntries = deduped;
}

const resetScrollMaps = () => {
  scrollMap = undefined;
  reverseScrollMapEntries = undefined;
}
