module Electron.IpcRenderer where

import Prelude
import Effect (Effect)

foreign import on :: String      -- ^ Channel name
                  -> Effect Unit -- ^ Listener callback
                  -> Effect Unit
