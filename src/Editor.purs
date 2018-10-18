module Editor where

import Prelude

import React.Basic as React
import React.Basic.CodeMirror as CodeMirror
import React.Basic.PreviewRenderer (renderMd, printPreview)
import React.Basic.DOM as R
import React.Basic.Events as Events

import Panwriter.File (initFile, setDocumentEdited)

type Props = {}

component :: React.Component Props
component = React.component { displayName: "Editor", initialState, receiveProps, render }
  where
    initialState =
      { initialText: ""
      , previewScale: 0.5
      }

    receiveProps {isFirstMount: true, setState} =
      initFile
        { onFileLoad: \txt -> do
            void $ setState \s -> s {initialText = txt}
            renderMd txt
        }
    receiveProps _ = pure unit

    render { props, state, setState } =
      let zoom op = Events.handler_ $ setState \s -> s {previewScale = op s.previewScale 0.125}
      in  React.fragment
          [ CodeMirror.uncontrolled
              { onChange: \txt -> do
                  setDocumentEdited
                  renderMd txt
              , value: state.initialText
              , autoCursor: false
              , options:
                  { mode:
                    { name: "yaml-frontmatter"
                    , base: "markdown"
                    }
                  , theme: "paper"
                  , indentUnit: 4
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
              { className: "preview"
              , children: [
                  R.iframe
                  { className: "previewFrame"
                  , style: R.css
                    { transform: "scale(" <> show state.previewScale <> ")"
                    , width:  show (100.0 / state.previewScale) <> "%"
                    , height: show (100.0 / state.previewScale) <> "%"
                    }
                  , src: "previewFrame/previewFrame.html"
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