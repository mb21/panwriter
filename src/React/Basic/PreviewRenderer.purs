module React.Basic.PreviewRenderer where

import Prelude

import Effect (Effect)

foreign import renderMd :: String  -- ^ HTML String
                        -> Boolean -- ^ render paginated
                        -> Effect Unit

foreign import printPreview :: Effect Unit
