module Panwriter.App where

import Prelude
import Data.Monoid (guard)
import Electron.IpcRenderer as Ipc
import Panwriter.File (initFile, setWindowDirty)
import Panwriter.Toolbar (toolbar, ViewSplit(..))
import React.Basic.CodeMirror as CodeMirror
import React.Basic.PreviewRenderer (renderMd, printPreview)

import React.Basic (Component, JSX, StateUpdate(..), capture_, createComponent, make, send)
import React.Basic.DOM as R
import React.Basic.Events as Events

component :: Component Props
component = createComponent "App"

type Props = {}

data Action = Zoom (Number -> Number -> Number)
            | SplitChange ViewSplit
            | Paginate Boolean
            | TextChanged String
            | FileSaved String
            | FileLoaded String String

app :: Props -> JSX
app = make component
  { initialState:
      { text: ""
      , fileName: "Untitled"
      , fileDirty: false
      , split: Split
      , paginated: true
      , previewScale: 0.5
      }

  , didMount: \self -> do
      let splitChange = const <<< send self <<< SplitChange
      Ipc.on "splitViewOnlyEditor"  $ splitChange OnlyEditor
      Ipc.on "splitViewSplit"       $ splitChange Split
      Ipc.on "splitViewOnlyPreview" $ splitChange OnlyPreview
      initFile
        { onFileLoad: \name txt -> send self $ FileLoaded name txt
        , onFileSave: send self <<< FileSaved
        }
  
  , update: \{state} action -> case action of
      Zoom op             -> Update state {previewScale = op state.previewScale 0.125}
      SplitChange sp      -> Update state {split = sp}
      Paginate p          -> UpdateAndSideEffects state {paginated = p}
                              \self -> renderMd self.state.text p
      TextChanged txt     -> UpdateAndSideEffects state {text = txt, fileDirty = true}
                               \self -> do
                                 setWindowDirty
                                 renderMd txt self.state.paginated
      FileSaved name      -> Update state {fileName = name, fileDirty = false}
      FileLoaded name txt -> UpdateAndSideEffects state 
                               { text      = txt
                               , fileName  = name
                               , fileDirty = false
                               }
                               \self -> renderMd txt self.state.paginated

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
        , CodeMirror.uncontrolled
            { -- unfortunately, onChange is called on first text load
              -- see https://github.com/scniro/react-codemirror2/issues/119
              onChange: send self <<< TextChanged
            , value: state.text
            , autoCursor: false
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
        , R.div
            { className: "preview" <> guard state.paginated " paginated"
            , children: [
                R.iframe
                { className: "previewFrame"
                , style: R.css
                  { transform: "scale(" <> show state.previewScale <> ")"
                  , width:  show (100.0 / state.previewScale) <> "%"
                  , height: show (100.0 / state.previewScale) <> "%"
                  }
                , src: "../previewFrame/previewFrame.html"
                }
              , R.button
                { className: "zoomBtn zoomIn"
                , onClick: capture_ self $ Zoom (+)
                , children: [R.text "+"]
                }
              , R.button
                { className: "zoomBtn zoomOut"
                , onClick: capture_ self $ Zoom (-)
                , children: [R.text "-"]
                }
              , R.button
                { className: "exportBtn"
                , onClick: Events.handler_ printPreview
                , children: [R.text "🖨"]
                }
              ]
            }
        ]
    }
  }
