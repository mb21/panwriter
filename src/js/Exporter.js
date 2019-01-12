"use strict";

const ipcRenderer = require('electron').ipcRenderer
    , remote      = require('electron').remote
    , spawn       = require('child_process').spawn
    , fs          = require('fs')
    , path        = require('path')
    , promisify   = require('util').promisify
    , jsYaml      = require('js-yaml')
    , Document    = require('./Document')
    ;

var previousExportConfig;

module.exports.getDataDirFileName = getDataDirFileName;

ipcRenderer.on('fileExport', function() {
  const win = remote.getCurrentWindow()
      , spawnOpts = {}
      , inputPath = Document.getPath()
      ;
  var defaultPath;
  if (inputPath !== undefined) {
    spawnOpts.cwd = path.dirname(inputPath);
    defaultPath   = path.basename(inputPath, path.extname(inputPath))
  }

  const outputPath = remote.dialog.showSaveDialog(win, {
    defaultPath: defaultPath
  , buttonLabel: 'Export'
  , filters: exportFormats()
  });
  if (outputPath !== undefined){
    let exp = {
      outputPath: outputPath
    , spawnOpts: spawnOpts
    };
    fileExport(exp).then( () => {
      previousExportConfig = exp;
    });
  }
});

ipcRenderer.on('fileExportLikePrevious', function() {
  if (previousExportConfig) {
    fileExport(previousExportConfig);
  } else {
    alert( "This document has not been exported yet, since it was opened.\n\n" +
           "Use 'File → Export' first." );
  }
});


// Calls pandoc, takes export settings object
async function fileExport(exp) {
  // simplified version of what I did in https://github.com/mb21/panrun
  const docMeta = Document.getMeta()
      , [extMeta, fileArg] = await defaultMeta(docMeta.type)
      , out = mergeAndValidate(docMeta, extMeta, exp.outputPath)
      ;
  const win  = remote.getCurrentWindow()
      , cmd  = 'pandoc'
      , args = fileArg.concat( toArgs(out) )
      , cmdDebug = cmd + ' ' + args.join(' ')
      ;
  const pandoc = spawn(cmd, args, exp.spawnOpts);
  pandoc.stdin.write( Document.getMd() );
  pandoc.stdin.end();

  pandoc.on('error', function(err) {
    alert("Failed to execute command:\n" + cmdDebug + '\n\n' + err.message
      + '\n\nHave you installed pandoc?');
  });

  const errout = [];
  pandoc.stderr.on('data', function(data) {
    errout.push(data);
  });
  
  pandoc.on('close', function(exitCode) {
    const success = exitCode === 0
        , toMsg = "Called: " + cmdDebug
        ;
    remote.dialog.showMessageBox(win, {
      type:    success ? 'info' : 'error'
    , message: success ? 'Success!' : 'Failed to export'
    , detail:  [toMsg, ''].concat( errout.join('') ).join('\n')
    , buttons: ['OK']
    });
  });
};

// merges both metas, sets proper defaults and returns output[toFormat] part
function mergeAndValidate(docMeta, extMeta, outputPath) {
  let toFormat = path.extname(outputPath)
  if (toFormat && toFormat[0] === '.') {
    toFormat = toFormat.substr(1);
  }
  if (toFormat === 'pdf') {
    toFormat = docMeta['pdf-format'] || extMeta['pdf-format'] || 'latex'
  } else if (toFormat === 'tex') {
    toFormat = 'latex'
  }

  const extractOut = meta => (meta.output && typeof meta.output === 'object')
                               ? meta.output[toFormat]
                               : {}
                               ;
  const out = Object.assign( extractOut(extMeta), extractOut(docMeta) );

  //make sure output goes to file user selected in GUI
  out.output = outputPath;

  // allow user to set `to: epub2`, `to: gfm`, `to: revealjs` etc.
  if (out.to === undefined) {
    out.to = toFormat;
  }

  // unless explicitly disabled, use `-s`
  if (out.standalone !== false) {
    out.standalone = true;
  }

  return out;
}

// reads the right default yaml file
async function defaultMeta(type) {
  try {
    const str = await readDataDirFile(type, '.yaml');
    return [ jsYaml.safeLoad(str), ['--metadata-file', fileName] ]
  } catch(e) {
    console.warn("Error loading or parsing YAML file." + e.message);
    return [ {}, [] ];
  }
}

// reads file from data directory, throws exception when not found
async function readDataDirFile(type, suffix) {
  const fileName = getDataDirFileName(type, suffix);
  return await promisify(fs.readFile)(fileName, 'utf8');
}

function getDataDirFileName(type, suffix) {
  if (typeof type !== 'string') {
    type = 'default'
  }
  const dataDir = [remote.app.getPath('appData'), 'PanWriterUserData', '']
                    .join(path.sep)
  return dataDir + type + suffix;
}

// constructs commandline arguments from object
function toArgs(out) {
  const args = [];

  Object.keys(out).forEach(opt => {
    const val = out[opt];
    if ( Array.isArray(val) ) {
      val.forEach(v => {
        args.push('--' + opt);
        args.push(v);
      });
    } else if (typeof val === 'object') {
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
function exportFormats() {
  return [
    { name: 'HTML (html)',                    extensions: ['html'] }
  , { name: 'Word (docx)',                    extensions: ['docx'] }
  , { name: 'LaTeX (latex)',                  extensions: ['tex'] }
  , { name: 'PDF (latex | context | html | ms)', extensions: ['pdf'] }
  , { name: 'ConTeXt (context)',              extensions: ['context'] }
  , { name: 'InDesign ICML (icml)',           extensions: ['icml'] }
  , { name: 'PowerPoint (pptx)',              extensions: ['pptx'] }
  , { name: 'OpenOffice/LibreOffice (odt)',   extensions: ['odt'] }
  , { name: 'RTF (rtf)',                      extensions: ['rtf'] }
  , { name: 'EPUB (epub)',                    extensions: ['epub'] }
  , { name: 'DocBook XML (docbook)',          extensions: ['docbook'] }
  , { name: 'JATS XML (jats)',                extensions: ['jats'] }
  , { name: 'Text Encoding Initiative (tei)', extensions: ['tei'] }
  , { name: 'OPML (opml)',                    extensions: ['opml'] }
  , { name: 'FictionBook2 (fb2)',             extensions: ['fb2'] }
  , { name: 'groff (ms)',                     extensions: ['ms'] }
  , { name: 'GNU Texinfo (texinfo)',          extensions: ['texinfo'] }
  , { name: 'Textile (textile)',              extensions: ['textile'] }
  , { name: 'DokuWiki (dokuwiki)',            extensions: ['dokuwiki'] }
  , { name: 'MediaWiki (mediawiki)',          extensions: ['mediawiki'] }
  , { name: 'Muse (muse)',                    extensions: ['muse'] }
  , { name: 'ZimWiki (zimwiki)',              extensions: ['zimwiki'] }
  , { name: 'AsciiDoc (asciidoc)',            extensions: ['asciidoc'] }
  , { name: 'Emacs Org mode (org)',           extensions: ['org'] }
  , { name: 'reStructuredText (rst)',         extensions: ['rst'] }
  , { name: 'Markdown (md)',                  extensions: ['md'] }
  , { name: 'Plain text (txt)',               extensions: ['txt'] }
  , { name: 'Other format',                   extensions: ['*'] }
  ];
}
