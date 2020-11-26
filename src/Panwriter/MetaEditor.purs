module Panwriter.MetaEditor where

import Prelude
import Control.Alt ((<|>))
import Data.Int.Parse (parseInt)
import Data.Argonaut.Core as A
import Data.Array (concatMap)
import Data.Maybe (fromMaybe)
import Data.String (null, stripPrefix, stripSuffix, Pattern(..))
import Effect (Effect)
import Foreign.Object as O
import React.Basic (Self, Component, JSX, StateUpdate(..), createComponent, make, capture, capture_, send)
import React.Basic.DOM as R
import React.Basic.DOM.Events (targetValue)
import Panwriter.Document (getDocument, defaultVars, setMeta, writeMetaToDoc, Meta)
import Panwriter.File (setWindowDirty)


type Kv = {
  label :: String
, name :: String 
, type :: FieldType
, placeholder :: String
} 

data FieldType = String
               | Textarea { onLoad :: String -> String, onDone :: String -> String }
               | Number   { onLoad :: String -> String, onDone :: String -> String, step :: String }
               | Select   { options :: Array String }

removeWrappingStyle :: String -> String
removeWrappingStyle s = fromMaybe s mbStripped
  where
    mbStripped = stripPrefix (Pattern "<style>\n") s >>= stripSuffix (Pattern "\n</style>")

addWrappingStyle :: String -> String
addWrappingStyle "" = ""
addWrappingStyle s = "<style>\n" <> s <> "\n</style>"

appendPx :: String -> String
appendPx "" = ""
appendPx s = s <> "px"

metaKvs :: Array Kv
metaKvs = [{
  name: "title"
, label: "Title"
, type: String
, placeholder: ""
}, {
  name: "author"
, label: "Author"
, type: String
, placeholder: ""
}, {
  name: "date"
, label: "Date"
, type: String
, placeholder: ""
}, {
  name: "lang"
, label: "Language"
, type: String
, placeholder: "en"
}]

layoutKvs :: Array Kv
layoutKvs = [{
  name: "mainfont"
, label: "Font"
, type: Select {
    options: [
        ""
      , "Georgia, serif"
      , "Helvetica, Arial, sans-serif"
      , "Palatino, Palatino Linotype, serif"
      ]
  }
, placeholder: ""
}, {
  name: "fontsize"
, label: "Font size"
, type: Number { step: "1", onLoad: \s -> fromMaybe "" (show <$> parseInt s), onDone: appendPx }
, placeholder: ""
}, {
  name: "linestretch"
, label: "Line height"
, type: Number { step: "0.1", onLoad: identity, onDone: identity }
, placeholder: ""
}, {
  name: "header-includes"
, label: "Include CSS"
, type: Textarea { onLoad: removeWrappingStyle , onDone: addWrappingStyle}
, placeholder: """blockquote {
  font-style: italic;
}"""
}]

type Props = {
  onBack :: String -> Effect Unit
, onChange :: Effect Unit
}

component :: Component Props
component = createComponent "MetaEditor"

renderKv :: Self Props {meta :: Meta} Action -> Kv -> Array JSX
renderKv self kv = [
  R.label
  { htmlFor: kv.name
  , children: [R.text $ kv.label <> ":"]
  }
, case kv.type of
    String     -> R.input    { id: kv.name, value: v, onChange: onChange identity, placeholder: p, type: "text" }
    Textarea t -> R.textarea { id: kv.name, value: t.onLoad v, onChange: onChange t.onDone, placeholder: p }
    Number n   -> R.input    { id: kv.name, value: n.onLoad v, onChange: onChange n.onDone, placeholder: p, type: "number", step: n.step }
    Select s   -> R.select   { id: kv.name, value: v, onChange: onChange identity, children: optsToJsx s.options }
]
  where
    p = kv.placeholder
    v = fromMaybe "" $ (lookup self.state.meta <|> lookup defaultVars) >>= A.toString
    lookup = O.lookup kv.name
    onChange fn = capture self targetValue (\mv -> SetMetaValue kv.name $ fn $ fromMaybe "" mv)
    optsToJsx opts = map fn opts
      where
        fn o = R.option { value: o, children: [R.text $ if null o then "System font, sans-serif" else o] }

data Action = SetMeta Meta
            | SetMetaValue String String
            | SaveAndExit

metaEditor :: Props -> JSX
metaEditor = make component
  { initialState: { meta: O.empty }
  , didMount: \self -> do
      doc <- getDocument
      send self $ SetMeta doc.meta
  , update: \{state} action -> case action of
      SetMeta m        -> Update state { meta = m }
      SetMetaValue k v -> let m = O.insert k (A.fromString v) state.meta
                          in  UpdateAndSideEffects state { meta = m }
                              \self -> do
                                setMeta m
                                self.props.onChange
      SaveAndExit      -> UpdateAndSideEffects state
                            \self -> do
                              setWindowDirty
                              txt <- writeMetaToDoc
                              self.props.onBack txt
  , render: \self ->
    R.div
      { className: "metaeditor"
      , children: [
          R.button
            { className: "backbtn"
            , onClick: capture_ self SaveAndExit
            , children: [ R.img
                { alt: "back"
                , src: "back.svg"
                , draggable: "false"
                }
              ]
            }
        , R.div
            { className: "content"
            , children: [
                R.h4
                  { children: [R.text "Document metadata"]
                  }
              , R.div
                  { className: "kvs"
                  , children: concatMap (renderKv self) metaKvs
                  }
              , R.h4
                  { children: [R.text "Layout"]
                  }
              , R.div
                  { className: "kvs"
                  , children: concatMap (renderKv self) layoutKvs
                  }
              ]
            }
        ]
      }
  }
