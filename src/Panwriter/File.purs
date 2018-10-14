module Panwriter.File where

import Prelude
import Effect (Effect)
import React.Basic as React

foreign import initFile ::
  { onFileLoad   :: String -> Effect Unit   -- called with new file contents
  , compInstance :: React.ComponentInstance -- to get at state.text, see https://github.com/lumihq/purescript-react-basic/blob/master/src/React/Basic.purs#L54
  }
  -> Effect Unit

foreign import setDocumentEdited :: Effect Unit