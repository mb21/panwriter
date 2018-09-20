module Editor where

import Prelude (pure, unit)
import Data.Maybe (maybe)
import Data.Array

import React.Basic as React
import React.Basic.CommonmarkRenderer (renderMd)
import React.Basic.DOM as R
import React.Basic.DOM.Events (targetValue)
import React.Basic.Events as Events

type Props = {}

component :: React.Component Props
component = React.component { displayName: "Editor", initialState, receiveProps, render }
  where
    initialState =
      { htmlEls: [] -- :: Array React.JSX
      }

    receiveProps _ =
      pure unit

    render { props, state, setState } = R.div
      { children:
          R.textarea
            { onChange: Events.handler targetValue \val ->
                          setState \_ -> {htmlEls: maybe [] renderMd val}
            }
          : state.htmlEls
      }