module Panwriter.File where

import Prelude
import Effect (Effect)

foreign import initFile ::
  { onFileLoad   :: String -> Effect Unit   -- called with new file contents
  }
  -> Effect Unit

foreign import setDocumentEdited :: Effect Unit