module AppRenderer where

import Prelude
import Editor as Editor

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Exception (throw)
import React.Basic (element)
import React.Basic.DOM (render)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toNonElementParentNode)
import Web.HTML.Window (document)

main :: Effect Unit
main = do
  mc <- getElementById "container" =<< (map toNonElementParentNode $ document =<< window)
  case mc of
    Nothing -> throw "Container element not found."
    Just c  ->
      let app = element Editor.component {}
      in render app c