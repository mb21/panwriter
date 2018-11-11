module Panwriter.Document where

import Prelude
import Effect (Effect)
import Data.Argonaut.Core as A
import Foreign.Object as O

type Meta = O.Object A.Json

type Document = {
  md     :: String
, yaml   :: String
, bodyMd :: String
, meta   :: Meta
, html   :: String
}


foreign import getDocument :: Effect Document

-- note: this does not cause a rerender
foreign import updateDocument :: String -- ^ markdown string
                              -> Effect Unit
