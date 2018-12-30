module Panwriter.App where

import Prelude
import Electron.IpcRenderer as Ipc
import Panwriter.File (initFile, setWindowDirty)
import Panwriter.Preview (preview)
import Panwriter.Toolbar (toolbar, ViewSplit(..))
import Panwriter.Document (updateDocument)
import Panwriter.Formatter as Formatter
import React.Basic.CodeMirror as CodeMirror
import React.Basic.PreviewRenderer (renderMd, printPreview)

import React.Basic (Component, JSX, StateUpdate(..), capture_, createComponent, make, send)
import React.Basic.DOM as R

component :: Component Props
component = createComponent "App"

type Props = {}

data Action = SplitChange ViewSplit
            | Paginate Boolean
            | TextChange String
            | FileSaved String
            | FileLoaded String String

app :: Props -> JSX
app = make component
  { initialState:
      { text: ""
      , fileName: "Untitled"
      , fileDirty: false
      , split: OnlyEditor
      , paginated: false
      }

  , didMount: \self -> do
      let splitChange = send self <<< SplitChange
      Ipc.on "splitViewOnlyEditor"  $ splitChange OnlyEditor
      Ipc.on "splitViewSplit"       $ splitChange Split
      Ipc.on "splitViewOnlyPreview" $ splitChange OnlyPreview
      initFile
        { onFileLoad: \name txt -> send self $ FileLoaded name txt
        , onFileSave: send self <<< FileSaved
        }
      Ipc.on "addBold"          $ CodeMirror.replaceSelection Formatter.bold
      Ipc.on "addItalic"        $ CodeMirror.replaceSelection Formatter.italic
      Ipc.on "addStrikethrough" $ CodeMirror.replaceSelection Formatter.strikethrough
      Ipc.on "addMetadataStyle" $ do
        Formatter.addStyle >>= send self <<< TextChange
        send self $ Paginate true
  
  , update: \{state} action -> case action of
      SplitChange sp      -> UpdateAndSideEffects state {split = sp}
                              \self -> CodeMirror.refresh
      Paginate p          -> UpdateAndSideEffects state {paginated = p}
                              \self -> renderMd p
      TextChange txt      -> UpdateAndSideEffects state {text = txt, fileDirty = true}
                               \self -> do
                                 setWindowDirty
                                 updateDocument txt
                                 renderMd self.state.paginated
      FileSaved name      -> Update state {fileName = name, fileDirty = false}
      FileLoaded name txt -> UpdateAndSideEffects state 
                               { text      = txt
                               , fileName  = name
                               , fileDirty = false
                               }
                               \self -> do
                                 updateDocument txt
                                 renderMd self.state.paginated

  , render: \self@{state} ->
      R.div {
        className: case state.split of
                     OnlyEditor  -> "app onlyeditor"
                     Split       -> "app split"
                     OnlyPreview -> "app onlypreview"
      , children: [
          toolbar
            { fileName:          state.fileName
            , fileDirty:         state.fileDirty
            , split:             state.split
            , onSplitChange:     capture_ self <<< SplitChange
            , paginated:         state.paginated
            , onPaginatedChange: capture_ self <<< Paginate
            }
        , CodeMirror.controlled
            { onBeforeChange: send self <<< TextChange
            , value: state.text
            , autoCursor: true
            , options:
                { mode:
                  { name: "yaml-frontmatter"
                  , base: "markdown"
                  }
                , theme: "paper"
                , indentUnit: 4 -- because of how numbered lists behave in CommonMark
                , tabSize: 4
                , lineNumbers: false
                , lineWrapping: true
                , autofocus: true
                , extraKeys:
                    { "Enter": "newlineAndIndentContinueMarkdownList"
                    , "Tab": "indentMore"
                    , "Shift-Tab": "indentLess"
                    }
              }
            }
        , preview
            { paginated: state.paginated
            , printPreview: printPreview
            }  
        ]
    }
  }
