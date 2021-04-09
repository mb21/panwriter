export const throttle = function<T>(fn: (...args: any[]) => T, wait: number, timeout?: NodeJS.Timeout) {
  // adapted from https://github.com/jashkenas/underscore/blob/master/underscore.js#L842
  var context: any;
  var args: any;
  var result: T;
  var previous = 0;

  var later = function() {
    previous = Date.now();
    timeout = undefined;
    result = fn.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function(this: any) {
    var now = Date.now();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      previous = now;
      result = fn.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  return throttled;
};
