module Panwriter.File where

import Prelude
import Effect (Effect)

type Filename = String

foreign import initFile ::
  { onFileLoad :: Filename -> String -> Effect Unit
  , onFileSave :: Filename -> Effect Unit
  }
  -> Effect Unit

foreign import setWindowDirty :: Effect Unit
