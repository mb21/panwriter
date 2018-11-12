module Panwriter.Formatter (
  bold
, italic
, strikethrough
, addStyle
) where

import Prelude


import Data.Argonaut.Core as A
import Data.Maybe (Maybe(..), isJust)
import Data.String (length, trim)
import Effect (Effect)
import Foreign.Object as O
import Panwriter.Document (getDocument, Document, Meta)
import Web.HTML (window)
import Web.HTML.Window (alert)


bold :: String -> String
bold txt = "**" <> txt <> "**"

italic :: String -> String
italic txt = "_" <> txt <> "_"

strikethrough :: String -> String
strikethrough txt = "~~" <> txt <> "~~"

addStyle :: Effect String
addStyle = do
  doc <- getDocument
  if isJust (lookupStyle doc.meta)
    then do
      window >>= alert "There is already a 'style' field in your document metadata."
      pure doc.md
    else
      pure $ appendToYaml doc defaultStyle


lookupStyle :: Meta -> Maybe String
lookupStyle meta = O.lookup "style" meta >>= A.caseJsonString Nothing pure

appendToYaml :: Document -> String -> String
appendToYaml doc str = "---\n"
               <> (if length doc.yaml > 0
                   then doc.yaml <> "\n"
                   else "")
               <> str
               <> "---\n\n"
               <> trim doc.bodyMd

defaultStyle :: String
defaultStyle = """style: |
  @page {
    size: A4;
    margin-top: 1.5cm;
  }
  h1, h2, h3 {
    font-family: 'Palatino';
  }
"""
