module Panwriter.App where

import Prelude
import Data.Monoid (guard)
import Effect (Effect)

import Electron.IpcRenderer as Ipc
import Panwriter.Document (updateDocument)
import Panwriter.File (initFile, setWindowDirty)
import Panwriter.Formatter as Formatter
import Panwriter.MetaEditor (metaEditor)
import Panwriter.Preview (preview)
import Panwriter.Toolbar (ViewSplit(..), toolbar)
import React.Basic (Component, JSX, StateUpdate(..), capture_, createComponent, make, send)
import React.Basic.CodeMirror as CodeMirror
import React.Basic.DOM as R
import React.Basic.PreviewRenderer (renderMd, printPreview, registerScrollEditor,
                                    scrollPreview, clearPreview)

component :: Component Props
component = createComponent "App"

type Props = {}

data Action = OpenMetaEdit Boolean
            | ExitMetaEditor String
            | RenderPreview
            | SplitChange ViewSplit
            | Paginate Boolean
            | TextChange String
            | FileSaved String
            | FileLoaded String String


renderPreview :: forall t. { split :: ViewSplit
                           , paginated :: Boolean
                           | t } -> Effect Unit
renderPreview state =
  if state.split == OnlyEditor
  then clearPreview
  else renderMd state.paginated


app :: Props -> JSX
app = make component
  { initialState:
      { text: ""
      , fileName: "Untitled"
      , fileDirty: false
      , metaEditorOpen: false
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
  
  , update: \{state} action -> case action of
      OpenMetaEdit o      -> Update state {metaEditorOpen = o}
      SplitChange sp      -> UpdateAndSideEffects state {split = sp}
                               \self -> do
                                 renderPreview self.state
                                 CodeMirror.refresh
      Paginate p          -> UpdateAndSideEffects state {paginated = p}
                               \self -> renderMd p
      TextChange txt      -> UpdateAndSideEffects state {text = txt, fileDirty = true}
                               \self -> do
                                 setWindowDirty
                                 updateDocument txt
                                 renderPreview self.state
      ExitMetaEditor txt  -> UpdateAndSideEffects state {text = txt, metaEditorOpen = false}
                               \self -> do
                                 renderPreview self.state
                                 CodeMirror.refresh
      RenderPreview       -> UpdateAndSideEffects state
                               \self -> do
                                 renderPreview self.state
      FileSaved name      -> Update state {fileName = name, fileDirty = false}
      FileLoaded name txt -> UpdateAndSideEffects state 
                               { text      = txt
                               , fileName  = name
                               , fileDirty = false
                               }
                               \self -> do
                                 updateDocument txt
                                 renderPreview self.state

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
            , metaEditorOpen:    state.metaEditorOpen
            , onMetaEditorChange: capture_ self <<< OpenMetaEdit
            , split:             state.split
            , onSplitChange:     capture_ self <<< SplitChange
            , paginated:         state.paginated
            , onPaginatedChange: capture_ self <<< Paginate
            }
        , R.div
          { className: "editor"
          , children: [
              guard state.metaEditorOpen $ metaEditor
                { onBack: send self <<< ExitMetaEditor
                , onChange: send self $ RenderPreview
                }
            , CodeMirror.controlled
                { onBeforeChange: send self <<< TextChange
                , onScroll: scrollPreview
                , onEditorDidMount: registerScrollEditor
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
            ]
          }
        , preview
            { paginated: state.paginated
            , printPreview: printPreview
            }  
        ]
    }
  }
