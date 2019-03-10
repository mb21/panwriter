module React.Basic.PreviewRenderer where

import Prelude (Unit)

import Effect (Effect)
import Effect.Uncurried (EffectFn1, runEffectFn1)

foreign import renderMd :: Boolean -- ^ render paginated
                        -> Effect Unit

foreign import printPreview :: Effect Unit

foreign import registerScrollEditorImpl :: forall editor. EffectFn1 editor Unit

registerScrollEditor :: forall editor. editor -> Effect Unit
registerScrollEditor = runEffectFn1 registerScrollEditorImpl

foreign import scrollPreview :: Effect Unit

foreign import clearPreview :: Effect Unit
