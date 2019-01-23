module Electron.CurrentWindow where

import Prelude (Unit)
import Effect (Effect)

foreign import close    :: Effect Unit
foreign import minimize :: Effect Unit
foreign import maximize :: Effect Unit
