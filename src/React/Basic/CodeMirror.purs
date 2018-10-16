module React.Basic.CodeMirror where

import Prelude
import Effect (Effect)
import React.Basic (JSX)

foreign import uncontrolled :: forall a.
                                 { value    :: String
                                 , onChange :: String -> Effect Unit
                                 | a }
                                 -> JSX