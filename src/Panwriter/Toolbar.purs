module Panwriter.Toolbar where

import Prelude
import Data.Functor (mapFlipped)

import Data.Monoid (guard)
import Panwriter.Button (button)
import React.Basic (Component, JSX, StateUpdate(..), capture_, createComponent, make)
import React.Basic.DOM as R
import React.Basic.Events (EventHandler)
import Electron.CurrentWindow as CurrentWindow

data ViewSplit = OnlyEditor | Split | OnlyPreview
derive instance eqViewSplit :: Eq ViewSplit

component :: Component Props
component = createComponent "Toolbar"

type Props = {
  fileName          :: String
, fileDirty         :: Boolean
, split             :: ViewSplit
, onSplitChange     :: ViewSplit -> EventHandler
, paginated         :: Boolean
, onPaginatedChange :: Boolean -> EventHandler
}

data Action = Close
            | Minimize
            | Maximize

showAction :: Action -> String
showAction Close = "close"
showAction Minimize = "minimize"
showAction Maximize = "maximize"

toolbar :: Props -> JSX
toolbar = make component
  { initialState: {}
  , update: \{state} action -> case action of
      Close    -> UpdateAndSideEffects state \self -> CurrentWindow.close
      Minimize -> UpdateAndSideEffects state \self -> CurrentWindow.minimize
      Maximize -> UpdateAndSideEffects state \self -> CurrentWindow.maximize
  , render: \self ->
      let paginatedBtn props = guard (props.split /= OnlyEditor)
            R.div
              { className: ""
              , children: [
                  button
                    { active:   props.paginated
                    , children: [ R.img
                                    { alt: "Paginated"
                                    , src: "page.svg"
                                    }
                                ]
                    , onClick:  props.onPaginatedChange $ not props.paginated
                    }
                ]
              }
              
          splitBtns props =
            R.div
              { className: "btngroup"
              , children: [
                  splitButton OnlyEditor
                , splitButton Split
                , splitButton OnlyPreview
                ]
              }
            where
              splitButton split =
                let splitIcon OnlyEditor  = {alt: "Editor",  src: "notes.svg"}
                    splitIcon Split       = {alt: "Split",   src: "vertical_split.svg"}
                    splitIcon OnlyPreview = {alt: "Preview", src: "visibility.svg"}
                in  button
                      { active:   split == props.split
                      , children: [R.img $ splitIcon split]
                      , onClick:  props.onSplitChange split
                      }
      in R.div
        { className: "toolbar"
        , children: [
            R.div
              { className: "toolbararea"
              , children: [
                  R.div
                    { className: "windowbuttons"
                    , children: mapFlipped [Close, Minimize, Maximize] \action ->
                        R.div {
                          onClick: capture_ self action
                        , children: [R.img { src: "macOS_window_" <> showAction action <> ".svg" }]
                        }
                    }
                , R.div
                    { className: "filename"
                    , children: [
                        R.span
                          { children: [R.text self.props.fileName]
                          }
                      , R.span
                          { className: "edited"
                          , children: [R.text $ guard self.props.fileDirty " — Edited"]
                          }
                      ]
                    }
                , R.div -- icons from https://material.io/tools/icons/
                    { className: "btns"
                    , children: [paginatedBtn self.props <> splitBtns self.props]
                    }
                ]
              }
          ]
        }
  }
