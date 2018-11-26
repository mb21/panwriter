module Panwriter.Preview where

import Prelude
import Data.Monoid (guard)
import Effect (Effect)

import React.Basic (Component, JSX, StateUpdate(..), capture_, createComponent, make)
import React.Basic.DOM as R
import React.Basic.Events as Events

component :: Component Props
component = createComponent "Preview"

type Props = {
  paginated    :: Boolean
, printPreview :: Effect Unit
}

data Action = Zoom (Number -> Number -> Number)

preview :: Props -> JSX
preview = make component
  { initialState:
      { previewScale: 1.0
      }

  , update: \{state} action -> case action of
      Zoom op -> Update state {previewScale = op state.previewScale 0.125}

  , render: \self@{props, state} ->
      R.div
        { className: "preview" <> guard props.paginated " paginated"
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
            , onClick: Events.handler_ props.printPreview
            , children: [R.text "🖨"]
            }
          ]
        }
  }
