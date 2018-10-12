module React.Basic.CommonmarkRenderer where

import Prelude

import Effect (Effect)

foreign import renderMd :: String -> Effect Unit

foreign import printPreview :: Effect Unit