module Editor where

import Prelude

import Data.Maybe (maybe)
import React.Basic as React
import React.Basic.CommonmarkRenderer (renderMd, printPreview)
import React.Basic.DOM as R
import React.Basic.DOM.Events (targetValue)
import React.Basic.Events as Events

type Props = {}

initialText :: String
initialText = """---
css: |
  @page {
    margin: 5cm;
  }
  body {
    font-family: Helvetica;
  }
  h1 {
    color: blue;
  }
---

# hi how are we today?

good? great!
"""

component :: React.Component Props
component = React.component { displayName: "Editor", initialState, receiveProps, render }
  where
    initialState =
      { htmlEls: renderMd initialText -- :: Array React.JSX
      , previewScale: 0.75
      }

    receiveProps _ =
      pure unit

    render { props, state, setState } =
      let zoom op = Events.handler_ $ setState \s -> s {previewScale = op s.previewScale 0.125}
      in  React.fragment
          [ R.textarea
              { onChange: Events.handler targetValue \val ->
                            setState \s -> s {htmlEls = maybe [] renderMd val}
              , autoFocus: "autofocus"
              , defaultValue: initialText
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