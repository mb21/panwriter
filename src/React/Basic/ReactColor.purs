module React.Basic.ReactColor where

import Prelude
import Effect (Effect)
import React.Basic (JSX)

-- hex color string like #ffffff
type Color = String

foreign import reactColor :: {color :: Color, onChange :: Color -> Effect Unit} -> JSX
