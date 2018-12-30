module React.Basic.CodeMirror where

import Prelude
import Effect (Effect)
import React.Basic (JSX)

foreign import controlled :: forall a.
                                { value          :: String
                                , onBeforeChange :: String -> Effect Unit
                                | a }
                                -> JSX
foreign import uncontrolled :: forall a.
                                 { value    :: String
                                 , onChange :: String -> Effect Unit
                                 | a }
                                 -> JSX

-- triggers onChange
foreign import replaceSelection :: (String -> String) -- ^ replace function that receives selected text
                                -> Effect Unit
