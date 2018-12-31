module React.Basic.PreviewRenderer where

import Prelude

import Effect (Effect)

foreign import renderMd :: Boolean -- ^ render paginated
                        -> Effect Unit

foreign import printPreview :: Effect Unit

foreign import scrollPreview :: forall editor. Int -> editor -> Effect Unit
