module Panwriter.Button where

import Data.Monoid (guard)

import React.Basic (JSX)
import React.Basic.DOM as R
import React.Basic.Events (EventHandler)

type Props = {
  active   :: Boolean
, children :: Array JSX
, onClick  :: EventHandler
}

button :: Props -> JSX
button props = 
  R.button
    { className: guard props.active "active"
    , children:  props.children
    , onClick:   props.onClick
    }
