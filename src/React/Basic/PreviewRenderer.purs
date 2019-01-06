module React.Basic.PreviewRenderer where

import Prelude (Unit)

import Effect (Effect)
import Effect.Uncurried (EffectFn1, EffectFn2, runEffectFn1, runEffectFn2)

foreign import renderMd :: Boolean -- ^ render paginated
                        -> Effect Unit

foreign import printPreview :: Effect Unit

foreign import registerScrollEditorImpl :: forall editor. EffectFn1 editor Unit

registerScrollEditor :: forall editor. editor -> Effect Unit
registerScrollEditor = runEffectFn1 registerScrollEditorImpl

foreign import scrollPreviewImpl :: forall editor. EffectFn2 Int editor Unit

scrollPreview :: forall editor. Int -> editor -> Effect Unit
scrollPreview = runEffectFn2 scrollPreviewImpl
