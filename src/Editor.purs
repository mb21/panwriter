module Editor where

import Data.Maybe (maybe)
import Effect (Effect)
import Prelude

import React.Basic as React
import React.Basic.CommonmarkRenderer (renderMd, printPreview)
import React.Basic.DOM as R
import React.Basic.DOM.Events (targetValue)
import React.Basic.Events as Events

import Panwriter.File (initFile, setDocumentEdited)

type Props = {}

updateText :: forall st. ( ({text :: String | st} -> {text :: String | st}) -> Effect Unit )
           -> String
           -> Effect Unit
updateText setState txt = do
  void $ setState \s -> s {text = txt}
  renderMd txt

component :: React.Component Props
component = React.component { displayName: "Editor", initialState, receiveProps, render }
  where
    initialState =
      { text: ""
      , previewScale: 0.5
      }

    receiveProps { isFirstMount: true, setState, instance_ } = do
      initFile
        { onFileLoad: updateText setState
        , compInstance: instance_
        }
    receiveProps _ = pure unit

    render { props, state, setState } =
      let zoom op = Events.handler_ $ setState \s -> s {previewScale = op s.previewScale 0.125}
      in  React.fragment
          [ R.textarea
              { onChange: Events.handler targetValue $ maybe (pure unit) \txt -> do
                            setDocumentEdited
                            updateText setState txt
              , autoFocus: "autofocus"
              , value: state.text
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