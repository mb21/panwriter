module Main where

import Prelude
import Effect (Effect)
import Effect.Console (log, logShow)

main :: Effect Unit
main = do
  log "look, show on Record:"
  logShow { apple: "banana" }