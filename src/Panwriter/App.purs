module Panwriter.App where

import Prelude

import Electron.IpcRenderer as Ipc
import Panwriter.File (initFile, setWindowDirty)
import Panwriter.Toolbar (ViewSplit(..))
import Panwriter.Toolbar as Toolbar
import React.Basic as React
import React.Basic.CodeMirror as CodeMirror
import React.Basic.DOM as R
import React.Basic.Events as Events
import React.Basic.PreviewRenderer (renderMd, printPreview)

type Props = {}

component :: React.Component Props
component = React.component { displayName: "App", initialState, receiveProps, render }
  where
    initialState =
      { initialText: ""
      , fileName: "Untitled"
      , fileDirty: false
      , split: Split
      , previewScale: 0.5
      }

    receiveProps {isFirstMount: true, setState} = do
      let setSplit split = const $ void $ setState \s -> s {split = split}
      Ipc.on "splitViewOnlyEditor"  $ setSplit OnlyEditor
      Ipc.on "splitViewSplit"       $ setSplit Split
      Ipc.on "splitViewOnlyPreview" $ setSplit OnlyPreview
      initFile
        { onFileLoad: \name txt -> do
            void $ setState \s -> s { initialText = txt
                                    , fileName    = name
                                    , fileDirty   = false
                                    }
            renderMd txt
        , onFileSave: \name -> setState \s -> s {fileName = name, fileDirty = false}
        }
    receiveProps _ = pure unit

    render { props, state, setState } =
      let zoom op = Events.handler_ $ setState \s -> s {previewScale = op s.previewScale 0.125}
      in  React.fragment
          [ React.element
              Toolbar.component
                { fileName:  state.fileName
                , fileDirty: state.fileDirty
                , split:     state.split
                , onSplitChange: \sp -> setState \s -> s {split = sp}
                }
          , CodeMirror.uncontrolled
              { className: if state.split == OnlyPreview
                           then "_hidden"
                           else ""
                -- unfortunately, onChange is called on first text load
                -- see https://github.com/scniro/react-codemirror2/issues/119
              , onChange: \txt -> do
                  setState \s -> s {fileDirty = true}
                  setWindowDirty
                  renderMd txt
              , value: state.initialText
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
              { className: if state.split == OnlyEditor
                           then "_hidden"
                           else "preview"
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
                  , onClick: zoom (+)
                  , children: [R.text "+"]
                  }
                , R.button
                  { className: "zoomBtn zoomOut"
                  , onClick: zoom (-)
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
