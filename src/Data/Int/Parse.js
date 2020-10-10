"use strict";
// from https://github.com/athanclark/purescript-parseint/tree/master/src/Data/Int

exports.unsafeParseInt = function unsafeParseInt(input) {
    return parseInt(input, 10);
};
