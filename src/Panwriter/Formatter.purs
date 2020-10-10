module Panwriter.Formatter (
  bold
, italic
, strikethrough
) where

import Prelude

bold :: String -> String
bold txt = "**" <> txt <> "**"

italic :: String -> String
italic txt = "_" <> txt <> "_"

strikethrough :: String -> String
strikethrough txt = "~~" <> txt <> "~~"
