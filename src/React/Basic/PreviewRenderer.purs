module React.Basic.PreviewRenderer where

import Prelude (Unit)

import Effect (Effect)
import Effect.Uncurried (EffectFn2, runEffectFn2)

foreign import renderMd :: Boolean -- ^ render paginated
                        -> Effect Unit

foreign import printPreview :: Effect Unit

foreign import scrollPreviewImpl :: forall editor. EffectFn2 Int editor Unit

scrollPreview :: forall editor. Int -> editor -> Effect Unit
scrollPreview = runEffectFn2 scrollPreviewImpl
