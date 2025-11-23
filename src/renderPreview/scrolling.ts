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
  , scrollSource: 'editor' | 'preview' | null = null  // Track which pane initiated scroll
  , scrollLockTimeout: NodeJS.Timeout | undefined

// Binary search to find the closest entry for a given preview scroll position
// Interpolates between entries for more accurate positioning
const findEditorPosition = (previewScrollY: number): number | undefined => {
  if (!reverseScrollMapEntries || reverseScrollMapEntries.length === 0) {
    return undefined;
  }

  const entries = reverseScrollMapEntries;
  let left = 0;
  let right = entries.length - 1;

  // Handle edge cases
  if (previewScrollY <= entries[0].previewPos) {
    return entries[0].editorPos;
  }
  if (previewScrollY >= entries[right].previewPos) {
    return entries[right].editorPos;
  }

  // Binary search for the interval containing previewScrollY
  while (left < right - 1) {
    const mid = Math.floor((left + right) / 2);
    if (entries[mid].previewPos <= previewScrollY) {
      left = mid;
    } else {
      right = mid;
    }
  }

  // Interpolate between entries[left] and entries[right]
  const leftEntry = entries[left];
  const rightEntry = entries[right];

  // Calculate the interpolation factor
  const previewRange = rightEntry.previewPos - leftEntry.previewPos;
  if (previewRange === 0) {
    return leftEntry.editorPos;
  }

  const factor = (previewScrollY - leftEntry.previewPos) / previewRange;
  const editorRange = rightEntry.editorPos - leftEntry.editorPos;

  const result = Math.round(leftEntry.editorPos + factor * editorRange);
  console.log('Interpolation:', {
    previewScrollY,
    leftEntry,
    rightEntry,
    factor: factor.toFixed(3),
    result
  });

  return result;
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
  // Ignore if preview initiated the scroll (prevent feedback loop)
  if (scrollSource === 'preview') {
    return;
  }

  if (!scrollPreviewPending && frameWindow) {
    scrollPreviewPending = true;
    requestAnimationFrame(() => {
      if (frameWindow) {
        // Build scroll map if needed
        if (!scrollMap) {
          buildScrollMap(editor, editorOffset);
        }

        // Get actual scrollable ranges for both panes
        const editorScrollInfo = editor.getScrollInfo();
        const editorScrollableRange = editorScrollInfo.height - editorScrollInfo.clientHeight;
        const previewScrollableRange = frameWindow.document.documentElement.scrollHeight - frameWindow.innerHeight;

        if (editorScrollableRange <= 0 || previewScrollableRange <= 0 || !scrollMap) {
          scrollPreviewPending = false;
          return;
        }

        // Get the scroll map value for line-based correlation
        const editorScrollTop = Math.round(editorScrollInfo.top);
        const clampedScrollTop = Math.min(editorScrollTop, scrollMap.length - 1);
        const scrollMapValue = scrollMap[clampedScrollTop];

        if (scrollMapValue === undefined) {
          scrollPreviewPending = false;
          return;
        }

        // Get the maximum value in the scroll map for consistent scaling
        const maxScrollMapValue = scrollMap[scrollMap.length - 1] || 1;

        // Scale the scroll map value to fit actual scrollable range
        // This preserves line correlation while ensuring both reach bottom together
        const previewScrollTo = Math.round((scrollMapValue / maxScrollMapValue) * previewScrollableRange);

        console.log('Editor→Preview:', {
          editorScrollTop,
          scrollMapValue,
          maxScrollMapValue,
          previewScrollableRange,
          previewScrollTo,
          ratio: (scrollMapValue / maxScrollMapValue * 100).toFixed(1) + '%'
        });

        // Set scroll lock to prevent feedback
        scrollSource = 'editor';
        if (scrollLockTimeout) clearTimeout(scrollLockTimeout);
        scrollLockTimeout = setTimeout(() => { scrollSource = null; }, 50);

        frameWindow.scrollTo(0, previewScrollTo);
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

    // Ignore if editor initiated the scroll (prevent feedback loop)
    if (scrollSource === 'editor') {
      return;
    }

    if (!scrollEditorPending && frameWindow !== undefined) {
      scrollEditorPending = true;
      requestAnimationFrame(() => {
        if (frameWindow !== undefined) {
          // Build scroll map if needed
          if (!reverseScrollMapEntries || !scrollMap) {
            buildScrollMap(editor, editorOffset);
          }

          // Get actual scrollable ranges for both panes
          const editorScrollInfo = editor.getScrollInfo();
          const editorScrollableRange = editorScrollInfo.height - editorScrollInfo.clientHeight;
          const previewScrollableRange = frameWindow.document.documentElement.scrollHeight - frameWindow.innerHeight;

          if (editorScrollableRange <= 0 || previewScrollableRange <= 0 || !scrollMap || !reverseScrollMapEntries) {
            scrollEditorPending = false;
            return;
          }

          // Get max values from scroll map for consistent scaling
          const maxEditorInMap = scrollMap.length - 1;
          const maxPreviewInMap = scrollMap[maxEditorInMap] || 1;

          // Convert actual preview scroll position to scroll map coordinates
          const previewScrollY = frameWindow.scrollY;
          const scaledPreviewY = (previewScrollY / previewScrollableRange) * maxPreviewInMap;

          // Use binary search with interpolation to find editor position
          const editorPosInMap = findEditorPosition(scaledPreviewY);

          if (editorPosInMap === undefined) {
            scrollEditorPending = false;
            return;
          }

          // editorPosInMap is already in pixel coordinates (same as editorScrollTop)
          // Don't scale it - use directly to maintain symmetry with Editor→Preview
          const editorScrollTo = editorPosInMap;

          console.log('Preview→Editor:', {
            previewScrollY: Math.round(previewScrollY),
            scaledPreviewY: Math.round(scaledPreviewY),
            editorPosInMap,
            editorScrollTo,
            ratio: (editorPosInMap / maxEditorInMap * 100).toFixed(1) + '%'
          });

          // Set scroll lock to prevent feedback
          scrollSource = 'preview';
          if (scrollLockTimeout) clearTimeout(scrollLockTimeout);
          scrollLockTimeout = setTimeout(() => { scrollSource = null; }, 50);

          editorScrollFrame?.scrollTo(0, editorScrollTo);
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
  // First, add the initial entry for position 0
  reverseEntries.push({
    previewPos: 0,
    editorPos: 0
  });

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

  console.log('Scroll map built:', {
    scrollMapSize: scrollMap.length,
    reverseEntriesCount: reverseScrollMapEntries.length,
    firstEntries: reverseScrollMapEntries.slice(0, 5),
    lastEntries: reverseScrollMapEntries.slice(-5),
    offsetSum,
    editorOffset,
    knownLineOffsetsCount: knownLineOffsets.length
  });
}

const resetScrollMaps = () => {
  scrollMap = undefined;
  reverseScrollMapEntries = undefined;
}
