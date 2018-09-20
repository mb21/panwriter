module React.Basic.CommonmarkRenderer where

import React.Basic as React

-- TODO: return YAML, maybe using purescript-argonaut-core
foreign import renderMd :: String -> Array React.JSX