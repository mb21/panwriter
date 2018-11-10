module Panwriter.Button where

import Prelude

import Effect (Effect)
import React.Basic as React
import React.Basic.DOM as R
import React.Basic.Events as Events

type Props = {
  active   :: Boolean
, children :: Array React.JSX
, onClick  :: Effect Unit
}

component :: React.Component Props
component = React.component { displayName: "Button", initialState, receiveProps, render }
  where
    initialState = {}

    receiveProps _ = pure unit

    render { props } =
      R.button
        { className: if props.active
                     then "active"
                     else ""
        , children: props.children
        , onClick: Events.handler_ $ props.onClick
        }
