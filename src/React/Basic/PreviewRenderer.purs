module React.Basic.PreviewRenderer where

import Prelude

import Effect (Effect)

foreign import renderMd :: String -> Effect Unit

foreign import printPreview :: Effect Unit