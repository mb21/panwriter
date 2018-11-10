module Panwriter.Toolbar where

import Prelude

import Effect (Effect)
import Panwriter.Button as Button
import React.Basic as React
import React.Basic.DOM as R

data ViewSplit = OnlyEditor | Split | OnlyPreview
derive instance eqViewSplit :: Eq ViewSplit

type Props = {
  fileName          :: String
, fileDirty         :: Boolean
, split             :: ViewSplit
, onSplitChange     :: ViewSplit -> Effect Unit
, paginated         :: Boolean
, onPaginatedChange :: Boolean -> Effect Unit
}

component :: React.Component Props
component = React.component { displayName: "Toolbar", initialState, receiveProps, render }
  where
    initialState = {}

    receiveProps _ = pure unit

    render { props, state, setState } =
      let editedStr = if props.fileDirty
                      then " — Edited"
                      else ""
          paginatedBtn =
            if props.split == OnlyEditor
            then []
            else [
              R.div
                { className: ""
                , children: [
                    React.element
                      Button.component
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
              ]
          splitBtns = [
            R.div
              { className: "btngroup"
              , children: [
                  splitButton OnlyEditor
                , splitButton Split
                , splitButton OnlyPreview
                ]
              }
            ]
            where
              splitButton split =
                let splitIcon OnlyEditor  = {alt: "Editor",  src: "notes.svg"}
                    splitIcon Split       = {alt: "Split",   src: "vertical_split.svg"}
                    splitIcon OnlyPreview = {alt: "Preview", src: "visibility.svg"}
                in  React.element
                      Button.component
                        { active:   split == props.split
                        , children: [R.img $ splitIcon split]
                        , onClick:  props.onSplitChange split
                        }
      in  R.div
            { className: "toolbar"
            , children: [
                R.div
                  { className: "toolbararea"
                  , children: [
                      R.div
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
                        , children: paginatedBtn <> splitBtns
                        }
                    ]
                  }
              ]
            }
