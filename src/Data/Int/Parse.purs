--from https://github.com/athanclark/purescript-parseint/tree/master/src/Data/Int

module Data.Int.Parse (parseInt) where

import Data.Maybe (Maybe (..))
import Data.Int (round)
import Data.Function.Uncurried (Fn1, runFn1)
import Global (isNaN)


foreign import unsafeParseInt :: Fn1 String Number

-- | Warning - this function follows the same semantics as native JS's `parseInt()` function -
-- | it will parse "as much as it can", when it can - sometimes it succeeds when the input isn't
-- | completely sanitary.
parseInt :: String -> Maybe Int
parseInt s =
  let x = runFn1 unsafeParseInt s
  in  if isNaN x
      then Nothing
      else Just (round x)
