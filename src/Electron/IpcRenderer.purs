module Electron.IpcRenderer where

import Prelude
import Effect (Effect)

foreign import on :: String
                  -> (String -> Effect Unit)
                  -> Effect Unit
