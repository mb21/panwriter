import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import { BrowserWindow, clipboard, dialog, ipcMain } from 'electron'
import { basename, dirname, extname } from 'path'
import { Doc, JSON, Meta } from '../../src/appState/AppState'
import { Result } from '../../src/result'
import { readDataDirFile } from '../dataDir'
import { showModalWindow } from './modal'

interface ExportOptions {
  outputPath?: string;
  spawnOpts?: SpawnOptionsWithoutStdio;
  toClipboardFormat?: string;
  toClipboardHTML?: boolean;
}

interface Out {
  metadata?: Meta;
  output?: string;
  to?: string;
  standalone?: boolean;
  [key: string]: undefined | JSON;
}

declare class CustomBrowserWindow extends Electron.BrowserWindow {
  previousExportConfig?: ExportOptions;
}

export const fileExportDialog = async (win: CustomBrowserWindow, doc: Doc) => {
  const spawnOpts: SpawnOptionsWithoutStdio = {}
  const inputPath = doc.filePath

  var defaultPath;
  if (inputPath !== undefined) {
    spawnOpts.cwd = dirname(inputPath);
    defaultPath   = basename(inputPath, extname(inputPath))
  }

  const res = await dialog.showSaveDialog(win, {
    defaultPath: defaultPath
  , buttonLabel: 'Export'
  , filters: exportFormats
  })

  const outputPath = res.filePath
  if (outputPath){
    const exp = {
      outputPath
    , spawnOpts
    };
    await fileExport(win, doc, exp)
    win.previousExportConfig = exp
  }
}

export const fileExportLikePrevious = (win: CustomBrowserWindow, doc: Doc) => {
  if (win.previousExportConfig) {
    fileExport(win, doc, win.previousExportConfig)
  } else {
    fileExportDialog(win, doc)
  }
}

export const fileExportToClipboard = async (win: BrowserWindow, doc: Doc) => {
  showModalWindow(win, 'chooseFormat')
  ipcMain.handleOnce('chooseFormat', async (_event, format: unknown) => {
    if (format === 'closingWindow') {
      // we fire this event so the ipcMain.handleOnce stops listening
      return
    }
    if (typeof format === 'string') {
      const res = await runFileExport(win, doc, { toClipboardFormat: format })
      if (typeof res === 'string') {
        return true
      } else {
        dialog.showMessageBox(win, {
          type:    'error'
        , message: 'Failed to export'
        , detail:  res.error
        , buttons: ['OK']
        })
        return false
      }
    }
  })
}

export const fileExportHTMLToClipboard = (win: BrowserWindow, doc: Doc) => {
  fileExport(win, doc, { toClipboardFormat: 'html', toClipboardHTML: true })
}


/**
 * Calls pandoc, takes export settings object and renders dialog
 */
const fileExport = async (win: BrowserWindow, doc: Doc, exp: ExportOptions) => {
  const detail = await runFileExport(win, doc, exp)

  const success = typeof detail === 'string'
  dialog.showMessageBox(win, {
    type:    success ? 'info' : 'error'
  , message: success ? 'Success!' : 'Failed to export'
  , detail:  success ? detail : detail.error
  , buttons: ['OK']
  })
}

/**
 * Calls pandoc, takes export settings object
 */
const runFileExport = async (
  win: BrowserWindow,
  doc: Doc,
  exp: ExportOptions
): Promise<Result<string>> => {
  // simplified version of what I did in https://github.com/mb21/panrun
  const docMeta = doc.meta
  const type = typeof docMeta.type === 'string'
    ? docMeta.type
    : 'default'
  const [extMeta, fileName] = await readDataDirFile(type + '.yaml')
  const out = mergeAndValidate(docMeta, extMeta || {}, exp.outputPath, exp.toClipboardFormat)

  const cmd  = 'pandoc'
  const args = (extMeta ? ['--metadata-file', fileName] : []).concat( toArgs(out) )
  const cmdDebug = cmd + ' ' + args.map(a => a.includes(' ') ? `'${a}'` : a).join(' ')
  let receivedError = false

  const resultPromise = new Promise<Result<string>>(resolve => {
    try {
      const pandoc = spawn(cmd, args, exp.spawnOpts);
      pandoc.stdin.write(doc.md);
      pandoc.stdin.end();

      pandoc.on('error', err => {
        receivedError = true
        dialog.showMessageBox(win, {
          type: 'error'
        , message: 'Failed to call pandoc'
        , detail: `Make sure you have it installed, see pandoc.org/installing

Failed to execute command:
${cmdDebug}

${err.message}`
        })
      });

      const errout: string[] = [];
      pandoc.stderr.on('data', data => {
        errout.push(data.toString('utf8'));
      });

      const stdout: string[] = [];
      if (exp.toClipboardFormat) {
        pandoc.stdout.on('data', data => {
          stdout.push(data.toString('utf8'));
        });
      }

      pandoc.on('close', exitCode => {
        const success = exitCode === 0
        const toMsg = 'Called: ' + cmdDebug
        if (success && exp.toClipboardFormat) {
          if (exp.toClipboardHTML) {
            clipboard.write({
              text: doc.md,
              html: stdout.join('')
            });
          } else {
            clipboard.writeText(stdout.join(''));
          }
        }
        if (!receivedError) {
          const detail = [toMsg, ''].concat( errout.join('') ).join('\n')
          if (success) {
            resolve(detail)
          } else {
            resolve({ error: detail })
          }
        }
      });
    } catch (e) {
      console.error('Failed to spawn pandoc', e)
      resolve({ error: `Failed to spawn pandoc ${e}` })
    }
  })
  return resultPromise
}

/**
 * merges both metas, sets proper defaults and returns output[toFormat] part
 */
const mergeAndValidate = (docMeta: Meta, extMeta: Meta, outputPath?: string, toClipboardFormat?: string): Out => {
  let toFormat: string
  if (outputPath) {
    toFormat = extname(outputPath)
    if (toFormat && toFormat[0] === '.') {
      toFormat = toFormat.substr(1);
    }
    if (toFormat === 'pdf') {
      const fmt = docMeta['pdf-format'] || extMeta['pdf-format'] || 'latex';
      if (typeof fmt === 'string') {
        toFormat = fmt
      }
    } else if (toFormat === 'tex') {
      toFormat = 'latex';
    }
  } else if (toClipboardFormat) {
    toFormat = toClipboardFormat;
  } else {
    return {}
  }

  const jsonToObj = (m: JSON): Meta =>
    (m && typeof m === 'object' && !Array.isArray(m))
    ? m
    : {}

  const extractOut = (meta: Meta) =>
    (meta?.output && typeof meta.output === 'object' && !Array.isArray(meta.output))
    ? jsonToObj(meta.output[toFormat])
    : {}
  const out: Out = { ...extractOut(extMeta), ...extractOut(docMeta) }

  if (typeof out.metadata !== 'object') {
    out.metadata = {};
  }
  if (docMeta.mainfont === undefined) {
    out.metadata.mainfont = '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  }
  if (docMeta.monobackgroundcolor === undefined) {
    out.metadata.monobackgroundcolor = '#f0f0f0';
  }

  if (outputPath) {
    //make sure output goes to file user selected in GUI
    out.output = outputPath;
  }

  // allow user to set `to: epub2`, `to: gfm`, `to: revealjs` etc.
  if (out.to === undefined) {
    out.to = toFormat;
  }

  // unless explicitly disabled, use `-s`
  if (out.standalone !== false && !toClipboardFormat) {
    out.standalone = true;
  }

  return out;
}

// constructs commandline arguments from object
const toArgs = (out: Out) => {
  const args: string[] = [];

  Object.keys(out).forEach(opt => {
    const val = out[opt];
    if ( Array.isArray(val) ) {
      val.forEach(v => {
        if (typeof v === 'string') {
          args.push('--' + opt);
          args.push(v);
        }
      });
    } else if (val && typeof val === 'object') {
      Object.keys(val).forEach(k => {
        args.push('--' + opt);
        args.push(k + '=' + val[k]);
      });
    } else if (val !== false) {
      args.push('--' + opt);
      if (val && val !== true) {
        // pandoc boolean options don't take a value
        args.push( val.toString() );
      }
    }
  });

  return args;
}

// we rely on the extension to detect target format
// see https://github.com/electron/electron/issues/15254
// list based on https://github.com/jgm/pandoc/blob/master/README.md
const exportFormats = [
  { name: 'HTML (html)',                       extensions: ['html'] }
, { name: 'Word (docx)',                       extensions: ['docx'] }
, { name: 'LaTeX (latex)',                     extensions: ['tex'] }
, { name: 'PDF (latex | context | html | ms)', extensions: ['pdf'] }
, { name: 'ConTeXt (context)',                 extensions: ['context'] }
, { name: 'InDesign ICML (icml)',              extensions: ['icml'] }
, { name: 'PowerPoint (pptx)',                 extensions: ['pptx'] }
, { name: 'OpenOffice/LibreOffice (odt)',      extensions: ['odt'] }
, { name: 'RTF (rtf)',                         extensions: ['rtf'] }
, { name: 'EPUB (epub)',                       extensions: ['epub'] }
, { name: 'DocBook XML (docbook)',             extensions: ['docbook'] }
, { name: 'JATS XML (jats)',                   extensions: ['jats'] }
, { name: 'Text Encoding Initiative (tei)',    extensions: ['tei'] }
, { name: 'OPML (opml)',                       extensions: ['opml'] }
, { name: 'FictionBook2 (fb2)',                extensions: ['fb2'] }
, { name: 'groff (ms)',                        extensions: ['ms'] }
, { name: 'GNU Texinfo (texinfo)',             extensions: ['texinfo'] }
, { name: 'Textile (textile)',                 extensions: ['textile'] }
, { name: 'Jira/Confluence (jira)',            extensions: ['jira'] }
, { name: 'DokuWiki (dokuwiki)',               extensions: ['dokuwiki'] }
, { name: 'MediaWiki (mediawiki)',             extensions: ['mediawiki'] }
, { name: 'Muse (muse)',                       extensions: ['muse'] }
, { name: 'ZimWiki (zimwiki)',                 extensions: ['zimwiki'] }
, { name: 'AsciiDoc (asciidoc)',               extensions: ['asciidoc'] }
, { name: 'Emacs Org mode (org)',              extensions: ['org'] }
, { name: 'reStructuredText (rst)',            extensions: ['rst'] }
, { name: 'Markdown (md)',                     extensions: ['md'] }
, { name: 'Plain text (txt)',                  extensions: ['txt'] }
, { name: 'Other format',                      extensions: ['*'] }
]
