module Panwriter.Toolbar where

import Prelude

import Effect (Effect)
import React.Basic as React
import React.Basic.DOM as R
import React.Basic.Events as Events

data ViewSplit = OnlyEditor | Split | OnlyPreview
derive instance eqViewSplit :: Eq ViewSplit

type Props = {
  fileName      :: String
, fileDirty     :: Boolean
, split         :: ViewSplit
, onSplitChange :: ViewSplit -> Effect Unit
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
          splitButton split =
            -- icons from https://material.io/tools/icons/
            let splitIcon OnlyEditor  = {alt: "Editor",  src: "notes.svg"}
                splitIcon Split       = {alt: "Split",   src: "vertical_split.svg"}
                splitIcon OnlyPreview = {alt: "Preview", src: "visibility.svg"}
            in  R.button
                  { className: if split == props.split
                              then "active"
                              else ""
                  , children: [R.img $ splitIcon split]
                  , onClick: Events.handler_ $ props.onSplitChange split
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
                    , R.div
                        { className: "btns"
                        , children: [
                            R.div
                              { className: "btngroup"
                              , children: [
                                  splitButton OnlyEditor
                                , splitButton Split
                                , splitButton OnlyPreview
                                ]
                              }
                          ]
                        }
                    ]
                  }
              ]
            }
