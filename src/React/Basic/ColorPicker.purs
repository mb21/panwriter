module React.Basic.ColorPicker where

import Prelude
import Data.Maybe (fromMaybe)
import Effect (Effect)
import React.Basic (Component, JSX, StateUpdate(..), createComponent, make, capture_)
import React.Basic.DOM as R
import React.Basic.DOM.Events (targetValue)
import React.Basic.Events (handler)
import React.Basic.ReactColor (reactColor)

type Props = {
  id       :: String
, value    :: String
, onChange :: String -> Effect Unit
}

data Action = Focus | Blur

component :: Component Props
component = createComponent "ColorPicker"

colorPicker :: Props -> JSX
colorPicker = make component
  { initialState: { showPicker: false }
  , update: \{state} action -> case action of
      Focus -> Update state { showPicker = true }
      Blur  -> Update state { showPicker = false }
  , render: \self ->
      let value = self.props.value
      in R.div
        { className: "colorpicker"
        , children: [
            R.input
              { id: self.props.id
              , value: value
              , onChange: handler targetValue (\mv -> self.props.onChange $ fromMaybe "" mv)
              , onFocus: capture_ self Focus
              }
          , R.div { className: "rectangle", style: R.css {background: value}, onClick: capture_ self Focus }
          ] <>
            if self.state.showPicker
            then [
              R.div { className: "background", onClick: capture_ self Blur }
            , reactColor { color: value, onChange: self.props.onChange }
            ]
            else []
        }
  }
