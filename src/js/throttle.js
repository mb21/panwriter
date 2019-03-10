"use strict";

exports.throttle = function(func, wait, timeout) {
  // adapted from https://github.com/jashkenas/underscore/blob/master/underscore.js#L842
  var context, args, result;
  var previous = 0;

  var later = function() {
    previous = Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = Date.now();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  return throttled;
};
