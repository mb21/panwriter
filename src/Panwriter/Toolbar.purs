module Panwriter.Toolbar where

import Prelude
import Data.Monoid (guard)

import Panwriter.Button (button)
import React.Basic (JSX)
import React.Basic.DOM as R
import React.Basic.Events (EventHandler)

data ViewSplit = OnlyEditor | Split | OnlyPreview
derive instance eqViewSplit :: Eq ViewSplit

type Props = {
  fileName          :: String
, fileDirty         :: Boolean
, split             :: ViewSplit
, onSplitChange     :: ViewSplit -> EventHandler
, paginated         :: Boolean
, onPaginatedChange :: Boolean -> EventHandler
}

toolbar :: Props -> JSX
toolbar props = 
  R.div
    { className: "toolbar"
    , children: [
        R.div
          { className: "toolbararea"
          , children: [
              R.img
                { src: "macOS_window_buttons.png"
                , className: "windowbuttons"
                , height: "12"
                }
            , R.div
                { className: "filename"
                , children: [
                    R.span
                      { children: [R.text props.fileName]
                      }
                  , R.span
                      { className: "edited"
                      , children: [R.text editedStr]
                      }
                  ]
                }
            , R.div -- icons from https://material.io/tools/icons/
                { className: "btns"
                , children: [paginatedBtn <> splitBtns]
                }
            ]
          }
      ]
    }
    where
      editedStr = guard props.fileDirty " — Edited"
      paginatedBtn = guard (props.split /= OnlyEditor)
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
      splitBtns =
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
