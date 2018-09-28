module Editor where

import Prelude (pure, unit)
import Data.Maybe (maybe)

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

    render { props, state, setState } = React.fragment
      [ R.textarea
          { onChange: Events.handler targetValue \val ->
                        setState \_ -> {htmlEls: maybe [] renderMd val}
          , autoFocus: "autofocus"
          , defaultValue: """# hi how are we today?"""
          }
      , R.div
          { className: "preview"
          }
      , R.div
          { children: state.htmlEls
          , className: "htmlEls"
          }
      ]