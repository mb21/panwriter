(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":21}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":22}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":23}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":24}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":25}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":26}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":27}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":28}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":29}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":30}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":31}],12:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _promise = require("../core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new _promise2.default(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          _promise2.default.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof _symbol2.default === "function" && _symbol2.default.asyncIterator) {
    AsyncGenerator.prototype[_symbol2.default.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function wrap(fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function _await(value) {
      return new AwaitValue(value);
    }
  };
}();
},{"../core-js/promise":9,"../core-js/symbol":10}],13:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _promise = require("../core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
},{"../core-js/promise":9}],14:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],15:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":5}],16:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":4,"../core-js/object/set-prototype-of":8,"../helpers/typeof":19}],17:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":19}],18:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _from = require("../core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
},{"../core-js/array/from":1}],19:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":10,"../core-js/symbol/iterator":11}],20:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":299}],21:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;

},{"../../modules/_core":39,"../../modules/es6.array.from":109,"../../modules/es6.string.iterator":119}],22:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/core.get-iterator":108,"../modules/es6.string.iterator":119,"../modules/web.dom.iterable":125}],23:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":39,"../../modules/es6.object.assign":111}],24:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

},{"../../modules/_core":39,"../../modules/es6.object.create":112}],25:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":39,"../../modules/es6.object.define-property":113}],26:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;

},{"../../modules/_core":39,"../../modules/es6.object.get-prototype-of":114}],27:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;

},{"../../modules/_core":39,"../../modules/es6.object.keys":115}],28:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;

},{"../../modules/_core":39,"../../modules/es6.object.set-prototype-of":116}],29:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
require('../modules/es7.promise.finally');
require('../modules/es7.promise.try');
module.exports = require('../modules/_core').Promise;

},{"../modules/_core":39,"../modules/es6.object.to-string":117,"../modules/es6.promise":118,"../modules/es6.string.iterator":119,"../modules/es7.promise.finally":121,"../modules/es7.promise.try":122,"../modules/web.dom.iterable":125}],30:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/_core":39,"../../modules/es6.object.to-string":117,"../../modules/es6.symbol":120,"../../modules/es7.symbol.async-iterator":123,"../../modules/es7.symbol.observable":124}],31:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/_wks-ext":105,"../../modules/es6.string.iterator":119,"../../modules/web.dom.iterable":125}],32:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],33:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],34:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],35:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":59}],36:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":96,"./_to-iobject":98,"./_to-length":99}],37:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":38,"./_wks":106}],38:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],39:[function(require,module,exports){
var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],40:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":72,"./_property-desc":85}],41:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":32}],42:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],43:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":48}],44:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":50,"./_is-object":59}],45:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],46:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":77,"./_object-keys":80,"./_object-pie":81}],47:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":39,"./_ctx":41,"./_global":50,"./_has":51,"./_hide":52}],48:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],49:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":35,"./_ctx":41,"./_is-array-iter":57,"./_iter-call":60,"./_to-length":99,"./core.get-iterator-method":107}],50:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],51:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],52:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":43,"./_object-dp":72,"./_property-desc":85}],53:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":50}],54:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":43,"./_dom-create":44,"./_fails":48}],55:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],56:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":38}],57:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":65,"./_wks":106}],58:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":38}],59:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],60:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":35}],61:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":52,"./_object-create":71,"./_property-desc":85,"./_set-to-string-tag":90,"./_wks":106}],62:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":47,"./_hide":52,"./_iter-create":61,"./_iterators":65,"./_library":66,"./_object-gpo":78,"./_redefine":87,"./_set-to-string-tag":90,"./_wks":106}],63:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":106}],64:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],65:[function(require,module,exports){
module.exports = {};

},{}],66:[function(require,module,exports){
module.exports = true;

},{}],67:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":48,"./_has":51,"./_is-object":59,"./_object-dp":72,"./_uid":102}],68:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":38,"./_global":50,"./_task":95}],69:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":32}],70:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":48,"./_iobject":56,"./_object-gops":77,"./_object-keys":80,"./_object-pie":81,"./_to-object":100}],71:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":35,"./_dom-create":44,"./_enum-bug-keys":45,"./_html":53,"./_object-dps":73,"./_shared-key":91}],72:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":35,"./_descriptors":43,"./_ie8-dom-define":54,"./_to-primitive":101}],73:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":35,"./_descriptors":43,"./_object-dp":72,"./_object-keys":80}],74:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":43,"./_has":51,"./_ie8-dom-define":54,"./_object-pie":81,"./_property-desc":85,"./_to-iobject":98,"./_to-primitive":101}],75:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":76,"./_to-iobject":98}],76:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":45,"./_object-keys-internal":79}],77:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],78:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":51,"./_shared-key":91,"./_to-object":100}],79:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":36,"./_has":51,"./_shared-key":91,"./_to-iobject":98}],80:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":45,"./_object-keys-internal":79}],81:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],82:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":39,"./_export":47,"./_fails":48}],83:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],84:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":35,"./_is-object":59,"./_new-promise-capability":69}],85:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],86:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":52}],87:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":52}],88:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":35,"./_ctx":41,"./_is-object":59,"./_object-gopd":74}],89:[function(require,module,exports){
'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":39,"./_descriptors":43,"./_global":50,"./_object-dp":72,"./_wks":106}],90:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":51,"./_object-dp":72,"./_wks":106}],91:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":92,"./_uid":102}],92:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":39,"./_global":50,"./_library":66}],93:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":32,"./_an-object":35,"./_wks":106}],94:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":42,"./_to-integer":97}],95:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":38,"./_ctx":41,"./_dom-create":44,"./_global":50,"./_html":53,"./_invoke":55}],96:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":97}],97:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],98:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":42,"./_iobject":56}],99:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":97}],100:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":42}],101:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":59}],102:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],103:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":50}],104:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":39,"./_global":50,"./_library":66,"./_object-dp":72,"./_wks-ext":105}],105:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":106}],106:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":50,"./_shared":92,"./_uid":102}],107:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":37,"./_core":39,"./_iterators":65,"./_wks":106}],108:[function(require,module,exports){
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":35,"./_core":39,"./core.get-iterator-method":107}],109:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":40,"./_ctx":41,"./_export":47,"./_is-array-iter":57,"./_iter-call":60,"./_iter-detect":63,"./_to-length":99,"./_to-object":100,"./core.get-iterator-method":107}],110:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":33,"./_iter-define":62,"./_iter-step":64,"./_iterators":65,"./_to-iobject":98}],111:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":47,"./_object-assign":70}],112:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":47,"./_object-create":71}],113:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":43,"./_export":47,"./_object-dp":72}],114:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":78,"./_object-sap":82,"./_to-object":100}],115:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":80,"./_object-sap":82,"./_to-object":100}],116:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":47,"./_set-proto":88}],117:[function(require,module,exports){

},{}],118:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":32,"./_an-instance":34,"./_classof":37,"./_core":39,"./_ctx":41,"./_export":47,"./_for-of":49,"./_global":50,"./_is-object":59,"./_iter-detect":63,"./_library":66,"./_microtask":68,"./_new-promise-capability":69,"./_perform":83,"./_promise-resolve":84,"./_redefine-all":86,"./_set-species":89,"./_set-to-string-tag":90,"./_species-constructor":93,"./_task":95,"./_user-agent":103,"./_wks":106}],119:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":62,"./_string-at":94}],120:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":35,"./_descriptors":43,"./_enum-keys":46,"./_export":47,"./_fails":48,"./_global":50,"./_has":51,"./_hide":52,"./_is-array":58,"./_is-object":59,"./_library":66,"./_meta":67,"./_object-create":71,"./_object-dp":72,"./_object-gopd":74,"./_object-gopn":76,"./_object-gopn-ext":75,"./_object-gops":77,"./_object-keys":80,"./_object-pie":81,"./_property-desc":85,"./_redefine":87,"./_set-to-string-tag":90,"./_shared":92,"./_to-iobject":98,"./_to-primitive":101,"./_uid":102,"./_wks":106,"./_wks-define":104,"./_wks-ext":105}],121:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":39,"./_export":47,"./_global":50,"./_promise-resolve":84,"./_species-constructor":93}],122:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":47,"./_new-promise-capability":69,"./_perform":83}],123:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":104}],124:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":104}],125:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":50,"./_hide":52,"./_iterators":65,"./_wks":106,"./es6.array.iterator":110}],126:[function(require,module,exports){
module.exports={"generic":true,"types":{"absolute-size":"xx-small | x-small | small | medium | large | x-large | xx-large","alpha-value":"<number> | <percentage>","angle-percentage":"<angle> | <percentage>","animateable-feature":"scroll-position | contents | <custom-ident>","attachment":"scroll | fixed | local","auto-repeat":"repeat( [ auto-fill | auto-fit ] , [ <line-names>? <fixed-size> ]+ <line-names>? )","auto-track-list":"[ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>? <auto-repeat> [ <line-names>? [ <fixed-size> | <fixed-repeat> ] ]* <line-names>?","baseline-position":"[ first | last ]? baseline","basic-shape":"<inset()> | <circle()> | <ellipse()> | <polygon()>","bg-image":"none | <image>","bg-layer":"<bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>","bg-position":"[ [ left | center | right | top | bottom | <length-percentage> ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] | [ center | [ left | right ] <length-percentage>? ] && [ center | [ top | bottom ] <length-percentage>? ] ]","bg-size":"[ <length-percentage> | auto ]{1,2} | cover | contain","blur()":"blur( <length> )","blend-mode":"normal | multiply | screen | overlay | darken | lighten | color-dodge | color-burn | hard-light | soft-light | difference | exclusion | hue | saturation | color | luminosity","box":"border-box | padding-box | content-box","br-style":"none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset","br-width":"<length> | thin | medium | thick","brightness()":"brightness( <number-percentage> )","calc()":"calc( <calc-sum> )","calc-sum":"<calc-product> [ [ '+' | '-' ] <calc-product> ]*","calc-product":"<calc-value> [ '*' <calc-value> | '/' <number> ]*","calc-value":"<number> | <dimension> | <percentage> | ( <calc-sum> )","cf-final-image":"<image> | <color>","cf-mixing-image":"<percentage>? && <image>","circle()":"circle( [ <shape-radius> ]? [ at <position> ]? )","clip-source":"<url>","color":"<rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>","color-stop":"<color> <length-percentage>?","color-stop-list":"<color-stop>#{2,}","common-lig-values":"[ common-ligatures | no-common-ligatures ]","composite-style":"clear | copy | source-over | source-in | source-out | source-atop | destination-over | destination-in | destination-out | destination-atop | xor","compositing-operator":"add | subtract | intersect | exclude","contextual-alt-values":"[ contextual | no-contextual ]","content-distribution":"space-between | space-around | space-evenly | stretch","content-list":"[ <string> | contents | <url> | <quote> | <attr()> | counter( <ident> , <'list-style-type'>? ) ]+","content-position":"center | start | end | flex-start | flex-end","content-replacement":"<image>","contrast()":"contrast( [ <number-percentage> ] )","counter-style":"<counter-style-name> | symbols( )","counter-style-name":"<custom-ident>","cross-fade()":"cross-fade( <cf-mixing-image> , <cf-final-image>? )","cubic-bezier-timing-function":"ease | ease-in | ease-out | ease-in-out | cubic-bezier( <number> , <number> , <number> , <number> )","deprecated-system-color":"ActiveBorder | ActiveCaption | AppWorkspace | Background | ButtonFace | ButtonHighlight | ButtonShadow | ButtonText | CaptionText | GrayText | Highlight | HighlightText | InactiveBorder | InactiveCaption | InactiveCaptionText | InfoBackground | InfoText | Menu | MenuText | Scrollbar | ThreeDDarkShadow | ThreeDFace | ThreeDHighlight | ThreeDLightShadow | ThreeDShadow | Window | WindowFrame | WindowText","discretionary-lig-values":"[ discretionary-ligatures | no-discretionary-ligatures ]","display-box":"contents | none","display-inside":"flow | flow-root | table | flex | grid | subgrid | ruby","display-internal":"table-row-group | table-header-group | table-footer-group | table-row | table-cell | table-column-group | table-column | table-caption | ruby-base | ruby-text | ruby-base-container | ruby-text-container","display-legacy":"inline-block | inline-list-item | inline-table | inline-flex | inline-grid","display-listitem":"<display-outside>? && [ flow | flow-root ]? && list-item","display-outside":"block | inline | run-in","drop-shadow()":"drop-shadow( <length>{2,3} <color>? )","east-asian-variant-values":"[ jis78 | jis83 | jis90 | jis04 | simplified | traditional ]","east-asian-width-values":"[ full-width | proportional-width ]","element()":"element( <id-selector> )","ellipse()":"ellipse( [ <shape-radius>{2} ]? [ at <position> ]? )","ending-shape":"circle | ellipse","explicit-track-list":"[ <line-names>? <track-size> ]+ <line-names>?","family-name":"<string> | <custom-ident>+","feature-tag-value":"<string> [ <integer> | on | off ]?","feature-value-name":"<custom-ident>","fill-rule":"nonzero | evenodd","filter-function":"<blur()> | <brightness()> | <contrast()> | <drop-shadow()> | <grayscale()> | <hue-rotate()> | <invert()> | <opacity()> | <saturate()> | <sepia()>","filter-function-list":"[ <filter-function> | <url> ]+","final-bg-layer":"<'background-color'> || <bg-image> || <bg-position> [ / <bg-size> ]? || <repeat-style> || <attachment> || <box> || <box>","fit-content()":"fit-content( [ <length> | <percentage> ] )","fixed-breadth":"<length-percentage>","fixed-repeat":"repeat( [ <positive-integer> ] , [ <line-names>? <fixed-size> ]+ <line-names>? )","fixed-size":"<fixed-breadth> | minmax( <fixed-breadth> , <track-breadth> ) | minmax( <inflexible-breadth> , <fixed-breadth> )","font-variant-css21":"[ normal | small-caps ]","frames-timing-function":"frames( <integer> )","frequency-percentage":"<frequency> | <percentage>","generic-family":"serif | sans-serif | cursive | fantasy | monospace | -apple-system","generic-name":"serif | sans-serif | cursive | fantasy | monospace","geometry-box":"<shape-box> | fill-box | stroke-box | view-box","gradient":"<-legacy-gradient> | <linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()>","grayscale()":"grayscale( <number-percentage> )","grid-line":"auto | <custom-ident> | [ <integer> && <custom-ident>? ] | [ span && [ <integer> || <custom-ident> ] ]","historical-lig-values":"[ historical-ligatures | no-historical-ligatures ]","hsl()":"hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? ) | hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )","hsla()":"hsla( <hue> <percentage> <percentage> [ / <alpha-value> ]? ) | hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )","hue":"<number> | <angle>","hue-rotate()":"hue-rotate( <angle> )","image":"<url> | <image()> | <image-set()> | <element()> | <cross-fade()> | <gradient>","image()":"image( [ [ <image> | <string> ]? , <color>? ]! )","image-set()":"image-set( <image-set-option># )","image-set-option":"[ <image> | <string> ] <resolution>","inflexible-breadth":"<length> | <percentage> | min-content | max-content | auto","inset()":"inset( <length-percentage>{1,4} [ round <'border-radius'> ]? )","invert()":"invert( <number-percentage> )","keyframes-name":"<custom-ident> | <string>","keyframe-selector":"from | to | <percentage>","leader()":"leader( <leader-type> )","leader-type":"dotted | solid | space | <string>","length-percentage":"<length> | <percentage>","line-names":"'[' <custom-ident>* ']'","line-name-list":"[ <line-names> | <name-repeat> ]+","linear-gradient()":"linear-gradient( [ <angle> | to <side-or-corner> ]? , <color-stop-list> )","mask-layer":"<mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || <geometry-box> || [ <geometry-box> | no-clip ] || <compositing-operator> || <masking-mode>","mask-position":"[ <length-percentage> | left | center | right ] [ <length-percentage> | top | center | bottom ]?","mask-reference":"none | <image> | <mask-source>","mask-source":"<url>","masking-mode":"alpha | luminance | match-source","matrix()":"matrix( <number> [, <number> ]{5} )","matrix3d()":"matrix3d( <number> [, <number> ]{15} )","media-type":"<ident>","mf-boolean":"<mf-name>","mf-name":"<ident>","minmax()":"minmax( [ <length> | <percentage> | <flex> | min-content | max-content | auto ] , [ <length> | <percentage> | <flex> | min-content | max-content | auto ] )","named-color":"transparent | aliceblue | antiquewhite | aqua | aquamarine | azure | beige | bisque | black | blanchedalmond | blue | blueviolet | brown | burlywood | cadetblue | chartreuse | chocolate | coral | cornflowerblue | cornsilk | crimson | cyan | darkblue | darkcyan | darkgoldenrod | darkgray | darkgreen | darkgrey | darkkhaki | darkmagenta | darkolivegreen | darkorange | darkorchid | darkred | darksalmon | darkseagreen | darkslateblue | darkslategray | darkslategrey | darkturquoise | darkviolet | deeppink | deepskyblue | dimgray | dimgrey | dodgerblue | firebrick | floralwhite | forestgreen | fuchsia | gainsboro | ghostwhite | gold | goldenrod | gray | green | greenyellow | grey | honeydew | hotpink | indianred | indigo | ivory | khaki | lavender | lavenderblush | lawngreen | lemonchiffon | lightblue | lightcoral | lightcyan | lightgoldenrodyellow | lightgray | lightgreen | lightgrey | lightpink | lightsalmon | lightseagreen | lightskyblue | lightslategray | lightslategrey | lightsteelblue | lightyellow | lime | limegreen | linen | magenta | maroon | mediumaquamarine | mediumblue | mediumorchid | mediumpurple | mediumseagreen | mediumslateblue | mediumspringgreen | mediumturquoise | mediumvioletred | midnightblue | mintcream | mistyrose | moccasin | navajowhite | navy | oldlace | olive | olivedrab | orange | orangered | orchid | palegoldenrod | palegreen | paleturquoise | palevioletred | papayawhip | peachpuff | peru | pink | plum | powderblue | purple | rebeccapurple | red | rosybrown | royalblue | saddlebrown | salmon | sandybrown | seagreen | seashell | sienna | silver | skyblue | slateblue | slategray | slategrey | snow | springgreen | steelblue | tan | teal | thistle | tomato | turquoise | violet | wheat | white | whitesmoke | yellow | yellowgreen | <-non-standard-color>","namespace-prefix":"<ident>","number-percentage":"<number> | <percentage>","numeric-figure-values":"[ lining-nums | oldstyle-nums ]","numeric-fraction-values":"[ diagonal-fractions | stacked-fractions ]","numeric-spacing-values":"[ proportional-nums | tabular-nums ]","opacity()":"opacity( [ <number-percentage> ] )","overflow-position":"unsafe | safe","outline-radius":"<border-radius>","perspective()":"perspective( <length> )","polygon()":"polygon( <fill-rule>? , [ <length-percentage> <length-percentage> ]# )","position":"[ [ left | center | right ] || [ top | center | bottom ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]? | [ [ left | right ] <length-percentage> ] && [ [ top | bottom ] <length-percentage> ] ]","quote":"open-quote | close-quote | no-open-quote | no-close-quote","radial-gradient()":"radial-gradient( [ <ending-shape> || <size> ]? [ at <position> ]? , <color-stop-list> )","relative-size":"larger | smaller","repeat-style":"repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}","repeating-linear-gradient()":"repeating-linear-gradient( [ <angle> | to <side-or-corner> ]? , <color-stop-list> )","repeating-radial-gradient()":"repeating-radial-gradient( [ <ending-shape> || <size> ]? [ at <position> ]? , <color-stop-list> )","rgb()":"rgb( <percentage>{3} [ / <alpha-value> ]? ) | rgb( <number>{3} [ / <alpha-value> ]? ) | rgb( <percentage>#{3} , <alpha-value>? ) | rgb( <number>#{3} , <alpha-value>? )","rgba()":"rgba( <percentage>{3} [ / <alpha-value> ]? ) | rgba( <number>{3} [ / <alpha-value> ]? ) | rgba( <percentage>#{3} , <alpha-value>? ) | rgba( <number>#{3} , <alpha-value>? )","rotate()":"rotate( <angle> )","rotate3d()":"rotate3d( <number> , <number> , <number> , <angle> )","rotateX()":"rotateX( <angle> )","rotateY()":"rotateY( <angle> )","rotateZ()":"rotateZ( <angle> )","saturate()":"saturate( <number-percentage> )","scale()":"scale( <number> [, <number> ]? )","scale3d()":"scale3d( <number> , <number> , <number> )","scaleX()":"scaleX( <number> )","scaleY()":"scaleY( <number> )","scaleZ()":"scaleZ( <number> )","self-position":"center | start | end | self-start | self-end | flex-start | flex-end","shape-radius":"<length-percentage> | closest-side | farthest-side","skew()":"skew( <angle> [, <angle> ]? )","skewX()":"skewX( <angle> )","skewY()":"skewY( <angle> )","sepia()":"sepia( <number-percentage> )","shadow":"inset? && <length>{2,4} && <color>?","shadow-t":"[ <length>{2,3} && <color>? ]","shape":"rect( [ [ <top> , <right> , <bottom> , <left> ] | [ <top> <right> <bottom> <left> ] ] )","shape-box":"<box> | margin-box","side-or-corner":"[ left | right ] || [ top | bottom ]","single-animation":"<time> || <single-timing-function> || <time> || <single-animation-iteration-count> || <single-animation-direction> || <single-animation-fill-mode> || <single-animation-play-state> || [ none | <keyframes-name> ]","single-animation-direction":"normal | reverse | alternate | alternate-reverse","single-animation-fill-mode":"none | forwards | backwards | both","single-animation-iteration-count":"infinite | <number>","single-animation-play-state":"running | paused","single-timing-function":"linear | <cubic-bezier-timing-function> | <step-timing-function> | <frames-timing-function>","single-transition":"<single-transition-timing-function> || [ none | <single-transition-property> ] || <time> || <time>","single-transition-timing-function":"<single-timing-function>","single-transition-property":"all | <custom-ident>","size":"closest-side | farthest-side | closest-corner | farthest-corner | <length> | <length-percentage>{2}","step-timing-function":"step-start | step-end | steps( <integer> [, [ start | end ] ]? )","symbol":"<string> | <image> | <custom-ident>","target":"<target-counter()> | <target-counters()> | <target-text()>","target-counter()":"target-counter( [ <string> | <url> ] , <custom-ident> , <counter-style>? )","target-counters()":"target-counters( [ <string> | <url> ] , <custom-ident> , <string> , <counter-style>? )","target-text()":"target-text( [ <string> | <url> ] , [ content | before | after | first-letter ]? )","time-percentage":"<time> | <percentage>","track-breadth":"<length-percentage> | <flex> | min-content | max-content | auto","track-list":"[ <line-names>? [ <track-size> | <track-repeat> ] ]+ <line-names>?","track-repeat":"repeat( [ <positive-integer> ] , [ <line-names>? <track-size> ]+ <line-names>? )","track-size":"<track-breadth> | minmax( <inflexible-breadth> , <track-breadth> ) | fit-content( [ <length> | <percentage> ] )","transform-function":"<matrix()> | <translate()> | <translateX()> | <translateY()> | <scale()> | <scaleX()> | <scaleY()> | <rotate()> | <skew()> | <skewX()> | <skewY()> | <matrix3d()> | <translate3d()> | <translateZ()> | <scale3d()> | <scaleZ()> | <rotate3d()> | <rotateX()> | <rotateY()> | <rotateZ()> | <perspective()>","transform-list":"<transform-function>+","translate()":"translate( <length-percentage> [, <length-percentage> ]? )","translate3d()":"translate3d( <length-percentage> , <length-percentage> , <length> )","translateX()":"translateX( <length-percentage> )","translateY()":"translateY( <length-percentage> )","translateZ()":"translateZ( <length> )","type-or-unit":"string | integer | color | url | integer | number | length | angle | time | frequency | em | ex | px | rem | vw | vh | vmin | vmax | mm | q | cm | in | pt | pc | deg | grad | rad | ms | s | Hz | kHz | %","viewport-length":"auto | <length-percentage>","-legacy-gradient":"<-webkit-gradient()> | <-legacy-linear-gradient> | <-legacy-repeating-linear-gradient> | <-legacy-radial-gradient> | <-legacy-repeating-radial-gradient>","-legacy-linear-gradient":"-moz-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-linear-gradient( <-legacy-linear-gradient-arguments> )","-legacy-repeating-linear-gradient":"-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> ) | -o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )","-legacy-linear-gradient-arguments":"[ <angle> | <side-or-corner> ]? , <color-stop-list>","-legacy-radial-gradient":"-moz-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-radial-gradient( <-legacy-radial-gradient-arguments> )","-legacy-repeating-radial-gradient":"-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> ) | -o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )","-legacy-radial-gradient-arguments":"[ <position> , ]? [ [ [ <-legacy-radial-gradient-shape> || <-legacy-radial-gradient-size> ] | [ <length> | <percentage> ]{2} ] , ]? <color-stop-list>","-legacy-radial-gradient-size":"closest-side | closest-corner | farthest-side | farthest-corner | contain | cover","-legacy-radial-gradient-shape":"circle | ellipse","-non-standard-font":"-apple-system-body | -apple-system-headline | -apple-system-subheadline | -apple-system-caption1 | -apple-system-caption2 | -apple-system-footnote | -apple-system-short-body | -apple-system-short-headline | -apple-system-short-subheadline | -apple-system-short-caption1 | -apple-system-short-footnote | -apple-system-tall-body","-non-standard-color":"-moz-ButtonDefault | -moz-ButtonHoverFace | -moz-ButtonHoverText | -moz-CellHighlight | -moz-CellHighlightText | -moz-Combobox | -moz-ComboboxText | -moz-Dialog | -moz-DialogText | -moz-dragtargetzone | -moz-EvenTreeRow | -moz-Field | -moz-FieldText | -moz-html-CellHighlight | -moz-html-CellHighlightText | -moz-mac-accentdarkestshadow | -moz-mac-accentdarkshadow | -moz-mac-accentface | -moz-mac-accentlightesthighlight | -moz-mac-accentlightshadow | -moz-mac-accentregularhighlight | -moz-mac-accentregularshadow | -moz-mac-chrome-active | -moz-mac-chrome-inactive | -moz-mac-focusring | -moz-mac-menuselect | -moz-mac-menushadow | -moz-mac-menutextselect | -moz-MenuHover | -moz-MenuHoverText | -moz-MenuBarText | -moz-MenuBarHoverText | -moz-nativehyperlinktext | -moz-OddTreeRow | -moz-win-communicationstext | -moz-win-mediatext | -moz-activehyperlinktext | -moz-default-background-color | -moz-default-color | -moz-hyperlinktext | -moz-visitedhyperlinktext | -webkit-activelink | -webkit-focus-ring-color | -webkit-link | -webkit-text","-non-standard-image-rendering":"optimize-contrast | -moz-crisp-edges | -o-crisp-edges | -webkit-optimize-contrast","-non-standard-overflow":"-moz-scrollbars-none | -moz-scrollbars-horizontal | -moz-scrollbars-vertical | -moz-hidden-unscrollable","-non-standard-width":"min-intrinsic | intrinsic | -moz-min-content | -moz-max-content | -webkit-min-content | -webkit-max-content","-non-standard-word-break":"break-word","-webkit-gradient()":"-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point> | , <-webkit-gradient-radius> , <-webkit-gradient-point> ] [, <-webkit-gradient-radius> ]? [, <-webkit-gradient-color-stop> ]* )","-webkit-gradient-color-stop":"from( <color> ) | color-stop( [ <number-zero-one> | <percentage> ] , <color> ) | to( <color> )","-webkit-gradient-point":"[ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ]","-webkit-gradient-radius":"<length> | <percentage>","-webkit-gradient-type":"linear | radial","-webkit-mask-box-repeat":"repeat | stretch | round","-webkit-mask-clip-style":"border | border-box | padding | padding-box | content | content-box | text","-ms-filter":"[ <progid> | FlipH | FlipV ]+","age":"child | young | old","border-radius":"<length-percentage>{1,2}","bottom":"<length> | auto","generic-voice":"[ <age>? <gender> <integer>? ]","gender":"male | female | neutral","left":"<length> | auto","mask-image":"<mask-reference>#","name-repeat":"repeat( [ <positive-integer> | auto-fill ] , <line-names>+ )","paint":"none | currentColor | <color> | <url> [ none | currentColor | <color> ]?","path()":"path( <string> )","right":"<length> | auto","svg-length":"<percentage> | <length> | <number>","svg-writing-mode":"lr-tb | rl-tb | tb-rl | lr | rl | tb","top":"<length> | auto","x":"<number>","y":"<number>"},"properties":{"-ms-accelerator":"false | true","-ms-block-progression":"tb | rl | bt | lr","-ms-content-zoom-chaining":"none | chained","-ms-content-zooming":"none | zoom","-ms-content-zoom-limit":"<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>","-ms-content-zoom-limit-max":"<percentage>","-ms-content-zoom-limit-min":"<percentage>","-ms-content-zoom-snap":"<'-ms-content-zoom-snap-type'> || <'-ms-content-zoom-snap-points'>","-ms-content-zoom-snap-points":"snapInterval( <percentage> , <percentage> ) | snapList( <percentage># )","-ms-content-zoom-snap-type":"none | proximity | mandatory","-ms-filter":"<string>","-ms-flow-from":"[ none | <custom-ident> ]#","-ms-flow-into":"[ none | <custom-ident> ]#","-ms-high-contrast-adjust":"auto | none","-ms-hyphenate-limit-chars":"auto | <integer>{1,3}","-ms-hyphenate-limit-lines":"no-limit | <integer>","-ms-hyphenate-limit-zone":"<percentage> | <length>","-ms-ime-align":"auto | after","-ms-overflow-style":"auto | none | scrollbar | -ms-autohiding-scrollbar","-ms-scrollbar-3dlight-color":"<color>","-ms-scrollbar-arrow-color":"<color>","-ms-scrollbar-base-color":"<color>","-ms-scrollbar-darkshadow-color":"<color>","-ms-scrollbar-face-color":"<color>","-ms-scrollbar-highlight-color":"<color>","-ms-scrollbar-shadow-color":"<color>","-ms-scrollbar-track-color":"<color>","-ms-scroll-chaining":"chained | none","-ms-scroll-limit":"<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>","-ms-scroll-limit-x-max":"auto | <length>","-ms-scroll-limit-x-min":"<length>","-ms-scroll-limit-y-max":"auto | <length>","-ms-scroll-limit-y-min":"<length>","-ms-scroll-rails":"none | railed","-ms-scroll-snap-points-x":"snapInterval( <length-percentage> , <length-percentage> ) | snapList( <length-percentage># )","-ms-scroll-snap-points-y":"snapInterval( <length-percentage> , <length-percentage> ) | snapList( <length-percentage># )","-ms-scroll-snap-type":"none | proximity | mandatory","-ms-scroll-snap-x":"<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>","-ms-scroll-snap-y":"<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>","-ms-scroll-translation":"none | vertical-to-horizontal","-ms-text-autospace":"none | ideograph-alpha | ideograph-numeric | ideograph-parenthesis | ideograph-space","-ms-touch-select":"grippers | none","-ms-user-select":"none | element | text","-ms-wrap-flow":"auto | both | start | end | maximum | clear","-ms-wrap-margin":"<length>","-ms-wrap-through":"wrap | none","-moz-appearance":"none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized","-moz-binding":"<url> | none","-moz-border-bottom-colors":"<color>+ | none","-moz-border-left-colors":"<color>+ | none","-moz-border-right-colors":"<color>+ | none","-moz-border-top-colors":"<color>+ | none","-moz-context-properties":"none | [ fill | fill-opacity | stroke | stroke-opacity ]#","-moz-float-edge":"border-box | content-box | margin-box | padding-box","-moz-force-broken-image-icon":"<integer>","-moz-image-region":"<shape> | auto","-moz-orient":"inline | block | horizontal | vertical","-moz-outline-radius":"<outline-radius>{1,4} [ / <outline-radius>{1,4} ]?","-moz-outline-radius-bottomleft":"<outline-radius>","-moz-outline-radius-bottomright":"<outline-radius>","-moz-outline-radius-topleft":"<outline-radius>","-moz-outline-radius-topright":"<outline-radius>","-moz-stack-sizing":"ignore | stretch-to-fit","-moz-text-blink":"none | blink","-moz-user-focus":"ignore | normal | select-after | select-before | select-menu | select-same | select-all | none","-moz-user-input":"auto | none | enabled | disabled","-moz-user-modify":"read-only | read-write | write-only","-moz-window-dragging":"drag | no-drag","-moz-window-shadow":"default | menu | tooltip | sheet | none","-webkit-appearance":"none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | listbox | listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button | media-seek-forward-button | media-slider | media-sliderthumb | menulist | menulist-button | menulist-text | menulist-textfield | push-button | radio | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | searchfield-cancel-button | searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical | square-button | textarea | textfield","-webkit-border-before":"<'border-width'> || <'border-style'> || <'color'>","-webkit-border-before-color":"<'color'>","-webkit-border-before-style":"<'border-style'>","-webkit-border-before-width":"<'border-width'>","-webkit-box-reflect":"[ above | below | right | left ]? <length>? <image>?","-webkit-mask":"[ <mask-reference> || <position> [ / <bg-size> ]? || <repeat-style> || [ <box> | border | padding | content | text ] || [ <box> | border | padding | content ] ]#","-webkit-mask-attachment":"<attachment>#","-webkit-mask-clip":"<-webkit-mask-clip-style> [, <-webkit-mask-clip-style> ]*","-webkit-mask-composite":"<composite-style>#","-webkit-mask-image":"<mask-reference>#","-webkit-mask-origin":"[ <box> | border | padding | content ]#","-webkit-mask-position":"<position>#","-webkit-mask-position-x":"[ <length-percentage> | left | center | right ]#","-webkit-mask-position-y":"[ <length-percentage> | top | center | bottom ]#","-webkit-mask-repeat":"<repeat-style>#","-webkit-mask-repeat-x":"repeat | no-repeat | space | round","-webkit-mask-repeat-y":"repeat | no-repeat | space | round","-webkit-mask-size":"<bg-size>#","-webkit-overflow-scrolling":"auto | touch","-webkit-tap-highlight-color":"<color>","-webkit-text-fill-color":"<color>","-webkit-text-stroke":"<length> || <color>","-webkit-text-stroke-color":"<color>","-webkit-text-stroke-width":"<length>","-webkit-touch-callout":"default | none","-webkit-user-modify":"read-only | read-write | read-write-plaintext-only","align-content":"normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>","align-items":"normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]","align-self":"auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position>","all":"initial | inherit | unset | revert","animation":"<single-animation>#","animation-delay":"<time>#","animation-direction":"<single-animation-direction>#","animation-duration":"<time>#","animation-fill-mode":"<single-animation-fill-mode>#","animation-iteration-count":"<single-animation-iteration-count>#","animation-name":"[ none | <keyframes-name> ]#","animation-play-state":"<single-animation-play-state>#","animation-timing-function":"<single-timing-function>#","appearance":"auto | none","azimuth":"<angle> | [ [ left-side | far-left | left | center-left | center | center-right | right | far-right | right-side ] || behind ] | leftwards | rightwards","backdrop-filter":"none | <filter-function-list>","backface-visibility":"visible | hidden","background":"[ <bg-layer> , ]* <final-bg-layer>","background-attachment":"<attachment>#","background-blend-mode":"<blend-mode>#","background-clip":"<box>#","background-color":"<color>","background-image":"<bg-image>#","background-origin":"<box>#","background-position":"<bg-position>#","background-position-x":"[ center | [ left | right | x-start | x-end ]? <length-percentage>? ]#","background-position-y":"[ center | [ top | bottom | y-start | y-end ]? <length-percentage>? ]#","background-repeat":"<repeat-style>#","background-size":"<bg-size>#","block-overflow":"clip | ellipsis | <string>","block-size":"<'width'>","border":"<br-width> || <br-style> || <color>","border-block-end":"<'border-width'> || <'border-style'> || <'color'>","border-block-end-color":"<'color'>","border-block-end-style":"<'border-style'>","border-block-end-width":"<'border-width'>","border-block-start":"<'border-width'> || <'border-style'> || <'color'>","border-block-start-color":"<'color'>","border-block-start-style":"<'border-style'>","border-block-start-width":"<'border-width'>","border-bottom":"<br-width> || <br-style> || <color>","border-bottom-color":"<color>","border-bottom-left-radius":"<length-percentage>{1,2}","border-bottom-right-radius":"<length-percentage>{1,2}","border-bottom-style":"<br-style>","border-bottom-width":"<br-width>","border-collapse":"collapse | separate","border-color":"<color>{1,4}","border-image":"<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>","border-image-outset":"[ <length> | <number> ]{1,4}","border-image-repeat":"[ stretch | repeat | round | space ]{1,2}","border-image-slice":"<number-percentage>{1,4} && fill?","border-image-source":"none | <image>","border-image-width":"[ <length-percentage> | <number> | auto ]{1,4}","border-inline-end":"<'border-width'> || <'border-style'> || <'color'>","border-inline-end-color":"<'color'>","border-inline-end-style":"<'border-style'>","border-inline-end-width":"<'border-width'>","border-inline-start":"<'border-width'> || <'border-style'> || <'color'>","border-inline-start-color":"<'color'>","border-inline-start-style":"<'border-style'>","border-inline-start-width":"<'border-width'>","border-left":"<br-width> || <br-style> || <color>","border-left-color":"<color>","border-left-style":"<br-style>","border-left-width":"<br-width>","border-radius":"<length-percentage>{1,4} [ / <length-percentage>{1,4} ]?","border-right":"<br-width> || <br-style> || <color>","border-right-color":"<color>","border-right-style":"<br-style>","border-right-width":"<br-width>","border-spacing":"<length> <length>?","border-style":"<br-style>{1,4}","border-top":"<br-width> || <br-style> || <color>","border-top-color":"<color>","border-top-left-radius":"<length-percentage>{1,2}","border-top-right-radius":"<length-percentage>{1,2}","border-top-style":"<br-style>","border-top-width":"<br-width>","border-width":"<br-width>{1,4}","bottom":"<length> | <percentage> | auto","box-align":"start | center | end | baseline | stretch","box-decoration-break":"slice | clone","box-direction":"normal | reverse | inherit","box-flex":"<number>","box-flex-group":"<integer>","box-lines":"single | multiple","box-ordinal-group":"<integer>","box-orient":"horizontal | vertical | inline-axis | block-axis | inherit","box-pack":"start | center | end | justify","box-shadow":"none | <shadow>#","box-sizing":"content-box | border-box","break-after":"auto | avoid | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region","break-before":"auto | avoid | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region","break-inside":"auto | avoid | avoid-page | avoid-column | avoid-region","caption-side":"top | bottom | block-start | block-end | inline-start | inline-end","caret-color":"auto | <color>","clear":"none | left | right | both | inline-start | inline-end","clip":"<shape> | auto","clip-path":"<clip-source> | [ <basic-shape> || <geometry-box> ] | none","color":"<color>","color-adjust":"economy | exact","column-count":"<integer> | auto","column-fill":"auto | balance | balance-all","column-gap":"normal | <length-percentage>","column-rule":"<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>","column-rule-color":"<color>","column-rule-style":"<'border-style'>","column-rule-width":"<'border-width'>","column-span":"none | all","column-width":"<length> | auto","columns":"<'column-width'> || <'column-count'>","contain":"none | strict | content | [ size || layout || style || paint ]","content":"normal | none | [ <content-replacement> | <content-list> ] [ / <string> ]?","counter-increment":"[ <custom-ident> <integer>? ]+ | none","counter-reset":"[ <custom-ident> <integer>? ]+ | none","cursor":"[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing | hand | -webkit-grab | -webkit-grabbing | -webkit-zoom-in | -webkit-zoom-out | -moz-grab | -moz-grabbing | -moz-zoom-in | -moz-zoom-out ] ]","direction":"ltr | rtl","display":"none | inline | block | list-item | inline-list-item | inline-block | inline-table | table | table-cell | table-column | table-column-group | table-footer-group | table-header-group | table-row | table-row-group | flex | inline-flex | grid | inline-grid | run-in | ruby | ruby-base | ruby-text | ruby-base-container | ruby-text-container | contents | -ms-flexbox | -ms-inline-flexbox | -ms-grid | -ms-inline-grid | -webkit-flex | -webkit-inline-flex | -webkit-box | -webkit-inline-box | -moz-inline-stack | -moz-box | -moz-inline-box","empty-cells":"show | hide","filter":"none | <filter-function-list> | <-ms-filter>","flex":"none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]","flex-basis":"content | <'width'>","flex-direction":"row | row-reverse | column | column-reverse","flex-flow":"<'flex-direction'> || <'flex-wrap'>","flex-grow":"<number>","flex-shrink":"<number>","flex-wrap":"nowrap | wrap | wrap-reverse","float":"left | right | none | inline-start | inline-end","font":"[ [ <'font-style'> || <font-variant-css21> || <'font-weight'> || <'font-stretch'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] | caption | icon | menu | message-box | small-caption | status-bar | <-non-standard-font>","font-family":"[ <family-name> | <generic-family> ]#","font-feature-settings":"normal | <feature-tag-value>#","font-kerning":"auto | normal | none","font-language-override":"normal | <string>","font-optical-sizing":"auto | none","font-variation-settings":"normal | [ <string> <number> ]#","font-size":"<absolute-size> | <relative-size> | <length-percentage>","font-size-adjust":"none | <number>","font-stretch":"normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded","font-style":"normal | italic | oblique","font-synthesis":"none | [ weight || style ]","font-variant":"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]","font-variant-alternates":"normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]","font-variant-caps":"normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps","font-variant-east-asian":"normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]","font-variant-ligatures":"normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]","font-variant-numeric":"normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]","font-variant-position":"normal | sub | super","font-weight":"normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900","gap":"<'row-gap'> <'column-gap'>?","grid":"<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>","grid-area":"<grid-line> [ / <grid-line> ]{0,3}","grid-auto-columns":"<track-size>+","grid-auto-flow":"[ row | column ] || dense","grid-auto-rows":"<track-size>+","grid-column":"<grid-line> [ / <grid-line> ]?","grid-column-end":"<grid-line>","grid-column-gap":"<length-percentage>","grid-column-start":"<grid-line>","grid-gap":"<'grid-row-gap'> <'grid-column-gap'>?","grid-row":"<grid-line> [ / <grid-line> ]?","grid-row-end":"<grid-line>","grid-row-gap":"<length-percentage>","grid-row-start":"<grid-line>","grid-template":"none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?","grid-template-areas":"none | <string>+","grid-template-columns":"none | <track-list> | <auto-track-list>","grid-template-rows":"none | <track-list> | <auto-track-list>","hanging-punctuation":"none | [ first || [ force-end | allow-end ] || last ]","height":"[ <length> | <percentage> ] && [ border-box | content-box ]? | available | min-content | max-content | fit-content | auto","hyphens":"none | manual | auto","image-orientation":"from-image | <angle> | [ <angle>? flip ]","image-rendering":"auto | crisp-edges | pixelated | optimizeSpeed | optimizeQuality | <-non-standard-image-rendering>","image-resolution":"[ from-image || <resolution> ] && snap?","ime-mode":"auto | normal | active | inactive | disabled","initial-letter":"normal | [ <number> <integer>? ]","initial-letter-align":"[ auto | alphabetic | hanging | ideographic ]","inline-size":"<'width'>","isolation":"auto | isolate","justify-content":"normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]","justify-items":"normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | legacy | legacy && [ left | right | center ]","justify-self":"auto | normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ]","left":"<length> | <percentage> | auto","letter-spacing":"normal | <length-percentage>","line-break":"auto | loose | normal | strict","line-clamp":"none | <integer>","line-height":"normal | <number> | <length> | <percentage>","line-height-step":"none | <length>","list-style":"<'list-style-type'> || <'list-style-position'> || <'list-style-image'>","list-style-image":"<url> | none","list-style-position":"inside | outside","list-style-type":"<counter-style> | <string> | none","margin":"[ <length> | <percentage> | auto ]{1,4}","margin-block-end":"<'margin-left'>","margin-block-start":"<'margin-left'>","margin-bottom":"<length> | <percentage> | auto","margin-inline-end":"<'margin-left'>","margin-inline-start":"<'margin-left'>","margin-left":"<length> | <percentage> | auto","margin-right":"<length> | <percentage> | auto","margin-top":"<length> | <percentage> | auto","mask":"<mask-layer>#","mask-border":"<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>","mask-border-mode":"luminance | alpha","mask-border-outset":"[ <length> | <number> ]{1,4}","mask-border-repeat":"[ stretch | repeat | round | space ]{1,2}","mask-border-slice":"<number-percentage>{1,4} fill?","mask-border-source":"none | <image>","mask-border-width":"[ <length-percentage> | <number> | auto ]{1,4}","mask-clip":"[ <geometry-box> | no-clip ]#","mask-composite":"<compositing-operator>#","mask-image":"<mask-reference>#","mask-mode":"<masking-mode>#","mask-origin":"<geometry-box>#","mask-position":"<position>#","mask-repeat":"<repeat-style>#","mask-size":"<bg-size>#","mask-type":"luminance | alpha","max-block-size":"<'max-width'>","max-height":"<length> | <percentage> | none | max-content | min-content | fit-content | fill-available","max-inline-size":"<'max-width'>","max-lines":"none | <integer>","max-width":"<length> | <percentage> | none | max-content | min-content | fit-content | fill-available | <-non-standard-width>","min-block-size":"<'min-width'>","min-height":"<length> | <percentage> | auto | max-content | min-content | fit-content | fill-available","min-inline-size":"<'min-width'>","min-width":"<length> | <percentage> | auto | max-content | min-content | fit-content | fill-available | <-non-standard-width>","mix-blend-mode":"<blend-mode>","object-fit":"fill | contain | cover | none | scale-down","object-position":"<position>","offset":"[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?","offset-anchor":"auto | <position>","offset-block-end":"<'left'>","offset-block-start":"<'left'>","offset-inline-end":"<'left'>","offset-inline-start":"<'left'>","offset-distance":"<length-percentage>","offset-path":"none | ray( [ <angle> && <size>? && contain? ] ) | <path()> | <url> | [ <basic-shape> || <geometry-box> ]","offset-position":"auto | <position>","offset-rotate":"[ auto | reverse ] || <angle>","opacity":"<number-zero-one>","order":"<integer>","orphans":"<integer>","outline":"[ <'outline-color'> || <'outline-style'> || <'outline-width'> ]","outline-color":"<color> | invert","outline-offset":"<length>","outline-style":"auto | <br-style>","outline-width":"<br-width>","overflow":"visible | hidden | scroll | auto | <-non-standard-overflow>","overflow-anchor":"auto | none","overflow-block":"<'overflow'>","overflow-clip-box":"padding-box | content-box","overflow-inline":"<'overflow'>","overflow-wrap":"normal | break-word","overflow-x":"visible | hidden | clip | scroll | auto","overflow-y":"visible | hidden | clip | scroll | auto","overscroll-behavior":"[ contain | none | auto ]{1,2}","overscroll-behavior-x":"contain | none | auto","overscroll-behavior-y":"contain | none | auto","padding":"[ <length> | <percentage> ]{1,4}","padding-block-end":"<'padding-left'>","padding-block-start":"<'padding-left'>","padding-bottom":"<length> | <percentage>","padding-inline-end":"<'padding-left'>","padding-inline-start":"<'padding-left'>","padding-left":"<length> | <percentage>","padding-right":"<length> | <percentage>","padding-top":"<length> | <percentage>","page-break-after":"auto | always | avoid | left | right | recto | verso","page-break-before":"auto | always | avoid | left | right | recto | verso","page-break-inside":"auto | avoid","paint-order":"normal | [ fill || stroke || markers ]","perspective":"none | <length>","perspective-origin":"<position>","place-content":"<'align-content'> <'justify-content'>?","pointer-events":"auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit","position":"static | relative | absolute | sticky | fixed | -webkit-sticky","quotes":"none | [ <string> <string> ]+","resize":"none | both | horizontal | vertical","right":"<length> | <percentage> | auto","rotate":"none | [ x | y | z | <number>{3} ]? && <angle>","row-gap":"normal | <length-percentage>","ruby-align":"start | center | space-between | space-around","ruby-merge":"separate | collapse | auto","ruby-position":"over | under | inter-character","scale":"none | <number>{1,3}","scroll-behavior":"auto | smooth","scroll-snap-coordinate":"none | <position>#","scroll-snap-destination":"<position>","scroll-snap-points-x":"none | repeat( <length-percentage> )","scroll-snap-points-y":"none | repeat( <length-percentage> )","scroll-snap-type":"none | mandatory | proximity","scroll-snap-type-x":"none | mandatory | proximity","scroll-snap-type-y":"none | mandatory | proximity","shape-image-threshold":"<number>","shape-margin":"<length-percentage>","shape-outside":"none | <shape-box> || <basic-shape> | <image>","tab-size":"<integer> | <length>","table-layout":"auto | fixed","text-align":"start | end | left | right | center | justify | match-parent","text-align-last":"auto | start | end | left | right | center | justify","text-combine-upright":"none | all | [ digits <integer>? ]","text-decoration":"<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'>","text-decoration-color":"<color>","text-decoration-line":"none | [ underline || overline || line-through || blink ]","text-decoration-skip":"none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]","text-decoration-skip-ink":"auto | none","text-decoration-style":"solid | double | dotted | dashed | wavy","text-emphasis":"<'text-emphasis-style'> || <'text-emphasis-color'>","text-emphasis-color":"<color>","text-emphasis-position":"[ over | under ] && [ right | left ]","text-emphasis-style":"none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>","text-indent":"<length-percentage> && hanging? && each-line?","text-justify":"auto | inter-character | inter-word | none","text-orientation":"mixed | upright | sideways","text-overflow":"[ clip | ellipsis | <string> ]{1,2}","text-rendering":"auto | optimizeSpeed | optimizeLegibility | geometricPrecision","text-shadow":"none | <shadow-t>#","text-size-adjust":"none | auto | <percentage>","text-transform":"none | capitalize | uppercase | lowercase | full-width","text-underline-position":"auto | [ under || [ left | right ] ]","top":"<length> | <percentage> | auto","touch-action":"auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation","transform":"none | <transform-list>","transform-box":"border-box | fill-box | view-box","transform-origin":"[ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>? | [ <length-percentage> | left | center | right | top | bottom ]","transform-style":"flat | preserve-3d","transition":"<single-transition>#","transition-delay":"<time>#","transition-duration":"<time>#","transition-property":"none | <single-transition-property>#","transition-timing-function":"<single-transition-timing-function>#","translate":"none | <length-percentage> [ <length-percentage> <length>? ]?","unicode-bidi":"normal | embed | isolate | bidi-override | isolate-override | plaintext | -moz-isolate | -moz-isolate-override | -moz-plaintext | -webkit-isolate","user-select":"auto | text | none | contain | all","vertical-align":"baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>","visibility":"visible | hidden | collapse","white-space":"normal | pre | nowrap | pre-wrap | pre-line","widows":"<integer>","width":"[ <length> | <percentage> ] && [ border-box | content-box ]? | available | min-content | max-content | fit-content | auto","will-change":"auto | <animateable-feature>#","word-break":"normal | break-all | keep-all | <-non-standard-word-break>","word-spacing":"normal | <length-percentage>","word-wrap":"normal | break-word","writing-mode":"horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr | <svg-writing-mode>","z-index":"auto | <integer>","zoom":"normal | reset | <number> | <percentage>","-moz-background-clip":"padding | border","-moz-border-radius-bottomleft":"<'border-bottom-left-radius'>","-moz-border-radius-bottomright":"<'border-bottom-right-radius'>","-moz-border-radius-topleft":"<'border-top-left-radius'>","-moz-border-radius-topright":"<'border-bottom-right-radius'>","-moz-osx-font-smoothing":"auto | grayscale","-moz-user-select":"none | text | all | -moz-none","-ms-flex-align":"start | end | center | baseline | stretch","-ms-flex-item-align":"auto | start | end | center | baseline | stretch","-ms-flex-line-pack":"start | end | center | justify | distribute | stretch","-ms-flex-negative":"<'flex-shrink'>","-ms-flex-pack":"start | end | center | justify | distribute","-ms-flex-order":"<integer>","-ms-flex-positive":"<'flex-grow'>","-ms-flex-preferred-size":"<'flex-basis'>","-ms-interpolation-mode":"nearest-neighbor | bicubic","-ms-grid-column-align":"start | end | center | stretch","-ms-grid-row-align":"start | end | center | stretch","-webkit-background-clip":"[ <box> | border | padding | content | text ]#","-webkit-column-break-after":"always | auto | avoid","-webkit-column-break-before":"always | auto | avoid","-webkit-column-break-inside":"always | auto | avoid","-webkit-font-smoothing":"auto | none | antialiased | subpixel-antialiased","-webkit-line-clamp":"<positive-integer>","-webkit-mask-box-image":"[ <url> | <gradient> | none ] [ <length-percentage>{4} <-webkit-mask-box-repeat>{2} ]?","-webkit-print-color-adjust":"economy | exact","-webkit-text-security":"none | circle | disc | square","-webkit-user-drag":"none | element | auto","-webkit-user-select":"auto | none | text | all","alignment-baseline":"auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical","baseline-shift":"baseline | sub | super | <svg-length>","behavior":"<url>+","clip-rule":"nonzero | evenodd","cue":"<'cue-before'> <'cue-after'>?","cue-after":"<url> <decibel>? | none","cue-before":"<url> <decibel>? | none","dominant-baseline":"auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge","fill":"<paint>","fill-opacity":"<number-zero-one>","fill-rule":"nonzero | evenodd","glyph-orientation-horizontal":"<angle>","glyph-orientation-vertical":"<angle>","kerning":"auto | <svg-length>","marker":"none | <url>","marker-end":"none | <url>","marker-mid":"none | <url>","marker-start":"none | <url>","pause":"<'pause-before'> <'pause-after'>?","pause-after":"<time> | none | x-weak | weak | medium | strong | x-strong","pause-before":"<time> | none | x-weak | weak | medium | strong | x-strong","rest":"<'rest-before'> <'rest-after'>?","rest-after":"<time> | none | x-weak | weak | medium | strong | x-strong","rest-before":"<time> | none | x-weak | weak | medium | strong | x-strong","shape-rendering":"auto | optimizeSpeed | crispEdges | geometricPrecision","src":"[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#","speak":"auto | none | normal","speak-as":"normal | spell-out || digits || [ literal-punctuation | no-punctuation ]","stroke":"<paint>","stroke-dasharray":"none | [ <svg-length>+ ]#","stroke-dashoffset":"<svg-length>","stroke-linecap":"butt | round | square","stroke-linejoin":"miter | round | bevel","stroke-miterlimit":"<number-one-or-greater>","stroke-opacity":"<number-zero-one>","stroke-width":"<svg-length>","text-anchor":"start | middle | end","unicode-range":"<unicode-range>#","voice-balance":"<number> | left | center | right | leftwards | rightwards","voice-duration":"auto | <time>","voice-family":"[ [ <family-name> | <generic-voice> ] , ]* [ <family-name> | <generic-voice> ] | preserve","voice-pitch":"<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]","voice-range":"<frequency> && absolute | [ [ x-low | low | medium | high | x-high ] || [ <frequency> | <semitones> | <percentage> ] ]","voice-rate":"[ normal | x-slow | slow | medium | fast | x-fast ] || <percentage>","voice-stress":"normal | strong | moderate | none | reduced","voice-volume":"silent | [ [ x-soft | soft | medium | loud | x-loud ] || <decibel> ]"}}
},{}],127:[function(require,module,exports){
var List = require('../utils/list');

module.exports = function createConvertors(walk) {
    return {
        fromPlainObject: function(ast) {
            walk(ast, {
                enter: function(node) {
                    if (node.children && node.children instanceof List === false) {
                        node.children = new List().fromArray(node.children);
                    }
                }
            });

            return ast;
        },
        toPlainObject: function(ast) {
            walk(ast, {
                leave: function(node) {
                    if (node.children && node.children instanceof List) {
                        node.children = node.children.toArray();
                    }
                }
            });

            return ast;
        }
    };
};

},{"../utils/list":230}],128:[function(require,module,exports){
'use strict';

var sourceMap = require('./sourceMap');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function processChildren(node, delimeter) {
    var list = node.children;
    var prev = null;

    if (typeof delimeter !== 'function') {
        list.forEach(this.node, this);
    } else {
        list.forEach(function(node) {
            if (prev !== null) {
                delimeter.call(this, prev);
            }

            this.node(node);
            prev = node;
        }, this);
    }
}

module.exports = function createGenerator(config) {
    function processNode(node) {
        if (hasOwnProperty.call(types, node.type)) {
            types[node.type].call(this, node);
        } else {
            throw new Error('Unknown node type: ' + node.type);
        }
    }

    var types = {};

    if (config.node) {
        for (var name in config.node) {
            types[name] = config.node[name].generate;
        }
    }

    return function(node, options) {
        var buffer = '';
        var handlers = {
            children: processChildren,
            node: processNode,
            chunk: function(chunk) {
                buffer += chunk;
            },
            result: function() {
                return buffer;
            }
        };

        if (options) {
            if (typeof options.decorator === 'function') {
                handlers = options.decorator(handlers);
            }

            if (options.sourceMap) {
                handlers = sourceMap(handlers);
            }
        }

        handlers.node(node);

        return handlers.result();
    };
};

},{"./sourceMap":129}],129:[function(require,module,exports){
'use strict';

var SourceMapGenerator = require('source-map').SourceMapGenerator;
var trackNodes = {
    Atrule: true,
    Selector: true,
    Declaration: true
};

module.exports = function generateSourceMap(handlers) {
    var map = new SourceMapGenerator();
    var line = 1;
    var column = 0;
    var generated = {
        line: 1,
        column: 0
    };
    var original = {
        line: 0, // should be zero to add first mapping
        column: 0
    };
    var sourceMappingActive = false;
    var activatedGenerated = {
        line: 1,
        column: 0
    };
    var activatedMapping = {
        generated: activatedGenerated
    };

    var handlersNode = handlers.node;
    handlers.node = function(node) {
        if (node.loc && node.loc.start && trackNodes.hasOwnProperty(node.type)) {
            var nodeLine = node.loc.start.line;
            var nodeColumn = node.loc.start.column - 1;

            if (original.line !== nodeLine ||
                original.column !== nodeColumn) {
                original.line = nodeLine;
                original.column = nodeColumn;

                generated.line = line;
                generated.column = column;

                if (sourceMappingActive) {
                    sourceMappingActive = false;
                    if (generated.line !== activatedGenerated.line ||
                        generated.column !== activatedGenerated.column) {
                        map.addMapping(activatedMapping);
                    }
                }

                sourceMappingActive = true;
                map.addMapping({
                    source: node.loc.source,
                    original: original,
                    generated: generated
                });
            }
        }

        handlersNode.call(this, node);

        if (sourceMappingActive && trackNodes.hasOwnProperty(node.type)) {
            activatedGenerated.line = line;
            activatedGenerated.column = column;
        }
    };

    var handlersChunk = handlers.chunk;
    handlers.chunk = function(chunk) {
        for (var i = 0; i < chunk.length; i++) {
            if (chunk.charCodeAt(i) === 10) { // \n
                line++;
                column = 0;
            } else {
                column++;
            }
        }

        handlersChunk(chunk);
    };

    var handlersResult = handlers.result;
    handlers.result = function() {
        if (sourceMappingActive) {
            map.addMapping(activatedMapping);
        }

        return {
            css: handlersResult(),
            map: map
        };
    };

    return handlers;
};

},{"source-map":311}],130:[function(require,module,exports){
'use strict';

module.exports = require('./syntax');

},{"./syntax":162}],131:[function(require,module,exports){
'use strict';

var SyntaxReferenceError = require('./error').SyntaxReferenceError;
var MatchError = require('./error').MatchError;
var names = require('../utils/names');
var generic = require('./generic');
var parse = require('./grammar/parse');
var generate = require('./grammar/generate');
var walk = require('./grammar/walk');
var astToTokens = require('./ast-to-tokens');
var buildMatchGraph = require('./match-graph').buildMatchGraph;
var matchAsTree = require('./match').matchAsTree;
var trace = require('./trace');
var search = require('./search');
var getStructureFromConfig = require('./structure').getStructureFromConfig;
var cssWideKeywords = buildMatchGraph(parse('inherit | initial | unset'));
var cssWideKeywordsWithExpression = buildMatchGraph(parse('inherit | initial | unset | <expression>'));

function dumpMapSyntax(map, syntaxAsAst) {
    var result = {};

    for (var name in map) {
        if (map[name].syntax) {
            result[name] = syntaxAsAst ? map[name].syntax : generate(map[name].syntax);
        }
    }

    return result;
}

function valueHasVar(value) {
    var hasVar = false;

    this.syntax.walk(value, function(node) {
        if (node.type === 'Function' && node.name.toLowerCase() === 'var') {
            hasVar = true;
        }
    });

    return hasVar;
}

function buildMatchResult(match, error, iterations) {
    return {
        matched: match,
        iterations: iterations,
        error: error,
        getTrace: trace.getTrace,
        isType: trace.isType,
        isProperty: trace.isProperty,
        isKeyword: trace.isKeyword
    };
}

function matchSyntax(lexer, syntax, node, useCommon) {
    if (!node) {
        return buildMatchResult(null, new Error('Node is undefined'));
    }

    if (valueHasVar.call(lexer, node)) {
        return buildMatchResult(null, new Error('Matching for a tree with var() is not supported'));
    }

    var tokens = lexer.syntax.generate(node, astToTokens);
    var result;

    if (useCommon) {
        result = matchAsTree(tokens, lexer.valueCommonSyntax, lexer);
    }

    if (!useCommon || !result.match) {
        result = matchAsTree(tokens, syntax.match, lexer);
        if (!result.match) {
            return buildMatchResult(
                null,
                new MatchError(result.reason, lexer, syntax.syntax, node, result),
                result.iterations
            );
        }
    }

    return buildMatchResult(result.match, null, result.iterations);
}

var Lexer = function(config, syntax, structure) {
    this.valueCommonSyntax = cssWideKeywords;
    this.syntax = syntax;
    this.generic = false;
    this.properties = {};
    this.types = {};
    this.structure = structure || getStructureFromConfig(config);

    if (config) {
        if (config.generic) {
            this.generic = true;
            for (var name in generic) {
                this.addType_(name, generic[name]);
            }
        }

        if (config.types) {
            for (var name in config.types) {
                this.addType_(name, config.types[name]);
            }
        }

        if (config.properties) {
            for (var name in config.properties) {
                this.addProperty_(name, config.properties[name]);
            }
        }
    }
};

Lexer.prototype = {
    structure: {},
    checkStructure: function(ast) {
        function collectWarning(node, message) {
            warns.push({
                node: node,
                message: message
            });
        }

        var structure = this.structure;
        var warns = [];

        this.syntax.walk(ast, function(node) {
            if (structure.hasOwnProperty(node.type)) {
                structure[node.type].check(node, collectWarning);
            } else {
                collectWarning(node, 'Unknown node type `' + node.type + '`');
            }
        });

        return warns.length ? warns : false;
    },

    createDescriptor: function(syntax, type, name) {
        var ref = {
            type: type,
            name: name
        };
        var descriptor = {
            type: type,
            name: name,
            syntax: null,
            match: null
        };

        if (typeof syntax === 'function') {
            descriptor.match = buildMatchGraph(syntax, ref);
        } else {
            if (typeof syntax === 'string') {
                // lazy parsing on first access
                Object.defineProperty(descriptor, 'syntax', {
                    get: function() {
                        Object.defineProperty(descriptor, 'syntax', {
                            value: parse(syntax)
                        });

                        return descriptor.syntax;
                    }
                });
            } else {
                descriptor.syntax = syntax;
            }

            Object.defineProperty(descriptor, 'match', {
                get: function() {
                    Object.defineProperty(descriptor, 'match', {
                        value: buildMatchGraph(descriptor.syntax, ref)
                    });

                    return descriptor.match;
                }
            });
        }

        return descriptor;
    },
    addProperty_: function(name, syntax) {
        this.properties[name] = this.createDescriptor(syntax, 'Property', name);
    },
    addType_: function(name, syntax) {
        this.types[name] = this.createDescriptor(syntax, 'Type', name);

        if (syntax === generic.expression) {
            this.valueCommonSyntax = cssWideKeywordsWithExpression;
        }
    },

    matchDeclaration: function(node) {
        if (node.type !== 'Declaration') {
            return buildMatchResult(null, new Error('Not a Declaration node'));
        }

        return this.matchProperty(node.property, node.value);
    },
    matchProperty: function(propertyName, value) {
        var property = names.property(propertyName);

        // don't match syntax for a custom property
        if (property.custom) {
            return buildMatchResult(null, new Error('Lexer matching doesn\'t applicable for custom properties'));
        }

        var propertySyntax = property.vendor
            ? this.getProperty(property.name) || this.getProperty(property.basename)
            : this.getProperty(property.name);

        if (!propertySyntax) {
            return buildMatchResult(null, new SyntaxReferenceError('Unknown property', propertyName));
        }

        return matchSyntax(this, propertySyntax, value, true);
    },
    matchType: function(typeName, value) {
        var typeSyntax = this.getType(typeName);

        if (!typeSyntax) {
            return buildMatchResult(null, new SyntaxReferenceError('Unknown type', typeName));
        }

        return matchSyntax(this, typeSyntax, value, false);
    },
    match: function(syntax, value) {
        if (!syntax || !syntax.type) {
            return buildMatchResult(null, new SyntaxReferenceError('Bad syntax'));
        }

        if (!syntax.match) {
            syntax = this.createDescriptor(syntax);
        }

        return matchSyntax(this, syntax, value, false);
    },

    findValueFragments: function(propertyName, value, type, name) {
        return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
    },
    findDeclarationValueFragments: function(declaration, type, name) {
        return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
    },
    findAllFragments: function(ast, type, name) {
        var result = [];

        this.syntax.walk(ast, {
            visit: 'Declaration',
            enter: function(declaration) {
                result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
            }.bind(this)
        });

        return result;
    },

    getProperty: function(name) {
        return this.properties.hasOwnProperty(name) ? this.properties[name] : null;
    },
    getType: function(name) {
        return this.types.hasOwnProperty(name) ? this.types[name] : null;
    },

    validate: function() {
        function validate(syntax, name, broken, descriptor) {
            if (broken.hasOwnProperty(name)) {
                return broken[name];
            }

            broken[name] = false;
            if (descriptor.syntax !== null) {
                walk(descriptor.syntax, function(node) {
                    if (node.type !== 'Type' && node.type !== 'Property') {
                        return;
                    }

                    var map = node.type === 'Type' ? syntax.types : syntax.properties;
                    var brokenMap = node.type === 'Type' ? brokenTypes : brokenProperties;

                    if (!map.hasOwnProperty(node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
                        broken[name] = true;
                    }
                }, this);
            }
        }

        var brokenTypes = {};
        var brokenProperties = {};

        for (var key in this.types) {
            validate(this, key, brokenTypes, this.types[key]);
        }

        for (var key in this.properties) {
            validate(this, key, brokenProperties, this.properties[key]);
        }

        brokenTypes = Object.keys(brokenTypes).filter(function(name) {
            return brokenTypes[name];
        });
        brokenProperties = Object.keys(brokenProperties).filter(function(name) {
            return brokenProperties[name];
        });

        if (brokenTypes.length || brokenProperties.length) {
            return {
                types: brokenTypes,
                properties: brokenProperties
            };
        }

        return null;
    },
    dump: function(syntaxAsAst) {
        return {
            generic: this.generic,
            types: dumpMapSyntax(this.types, syntaxAsAst),
            properties: dumpMapSyntax(this.properties, syntaxAsAst)
        };
    },
    toString: function() {
        return JSON.stringify(this.dump());
    }
};

module.exports = Lexer;

},{"../utils/names":231,"./ast-to-tokens":132,"./error":133,"./generic":134,"./grammar/generate":136,"./grammar/parse":138,"./grammar/walk":140,"./match":142,"./match-graph":141,"./search":143,"./structure":144,"./trace":145}],132:[function(require,module,exports){
module.exports = {
    decorator: function(handlers) {
        var curNode = null;
        var prev = null;
        var tokens = [];

        return {
            children: handlers.children,
            node: function(node) {
                var tmp = curNode;
                curNode = node;
                handlers.node.call(this, node);
                curNode = tmp;
            },
            chunk: function(chunk) {
                if (tokens.length > 0) {
                    switch (curNode.type) {
                        case 'Dimension':
                        case 'HexColor':
                        case 'IdSelector':
                        case 'Percentage':
                            if (prev.node === curNode) {
                                prev.value += chunk;
                                return;
                            }
                            break;

                        case 'Function':
                        case 'PseudoClassSelector':
                        case 'PseudoElementSelector':
                        case 'Url':
                            if (chunk === '(') {
                                prev.value += chunk;
                                return;
                            }
                            break;

                        case 'Atrule':
                            if (prev.node === curNode && prev.value === '@') {
                                prev.value += chunk;
                                return;
                            }
                            break;
                    }
                }

                tokens.push(prev = {
                    value: chunk,
                    node: curNode
                });
            },
            result: function() {
                return tokens;
            }
        };
    }
};

},{}],133:[function(require,module,exports){
'use strict';

var createCustomError = require('../utils/createCustomError');
var generateGrammar = require('./grammar/generate');

function fromMatchResult(matchResult) {
    var tokens = matchResult.tokens;
    var longestMatch = matchResult.longestMatch;
    var node = longestMatch < tokens.length ? tokens[longestMatch].node : null;
    var mismatchOffset = 0;
    var entries = 0;
    var css = '';

    for (var i = 0; i < tokens.length; i++) {
        if (i === longestMatch) {
            mismatchOffset = css.length;
        }

        if (node !== null && tokens[i].node === node) {
            if (i <= longestMatch) {
                entries++;
            } else {
                entries = 0;
            }
        }

        css += tokens[i].value;
    }

    if (node === null) {
        mismatchOffset = css.length;
    }

    return {
        node: node,
        css: css,
        mismatchOffset: mismatchOffset,
        last: node === null || entries > 1
    };
}

function getLocation(node, point) {
    var loc = node && node.loc && node.loc[point];

    if (loc) {
        return {
            offset: loc.offset,
            line: loc.line,
            column: loc.column
        };
    }

    return null;
}

var SyntaxReferenceError = function(type, referenceName) {
    var error = createCustomError(
        'SyntaxReferenceError',
        type + (referenceName ? ' `' + referenceName + '`' : '')
    );

    error.reference = referenceName;

    return error;
};

var MatchError = function(message, lexer, syntax, node, matchResult) {
    var error = createCustomError('SyntaxMatchError', message);
    var details = fromMatchResult(matchResult);
    var mismatchOffset = details.mismatchOffset || 0;
    var badNode = details.node || node;
    var end = getLocation(badNode, 'end');
    var start = details.last ? end : getLocation(badNode, 'start');
    var css = details.css;

    error.rawMessage = message;
    error.syntax = syntax ? generateGrammar(syntax) : '<generic>';
    error.css = css;
    error.mismatchOffset = mismatchOffset;
    error.loc = {
        source: (badNode && badNode.loc && badNode.loc.source) || '<unknown>',
        start: start,
        end: end
    };
    error.line = start ? start.line : undefined;
    error.column = start ? start.column : undefined;
    error.offset = start ? start.offset : undefined;
    error.message = message + '\n' +
        '  syntax: ' + error.syntax + '\n' +
        '   value: ' + (error.css || '<empty string>') + '\n' +
        '  --------' + new Array(error.mismatchOffset + 1).join('-') + '^';

    return error;
};

module.exports = {
    SyntaxReferenceError: SyntaxReferenceError,
    MatchError: MatchError
};

},{"../utils/createCustomError":229,"./grammar/generate":136}],134:[function(require,module,exports){
var tokenizerUtils = require('../tokenizer/utils');
var findIdentifierEnd = tokenizerUtils.findIdentifierEnd;
var findNumberEnd = tokenizerUtils.findNumberEnd;
var findDecimalNumberEnd = tokenizerUtils.findDecimalNumberEnd;
var isHex = tokenizerUtils.isHex;
var tokenizerConst = require('../tokenizer/const');
var SYMBOL_TYPE = tokenizerConst.SYMBOL_TYPE;
var IDENTIFIER = tokenizerConst.TYPE.Identifier;
var PLUSSIGN = tokenizerConst.TYPE.PlusSign;
var HYPHENMINUS = tokenizerConst.TYPE.HyphenMinus;
var NUMBERSIGN = tokenizerConst.TYPE.NumberSign;

var PERCENTAGE = {
    '%': true
};

// https://www.w3.org/TR/css-values-3/#lengths
var LENGTH = {
    // absolute length units
    'px': true,
    'mm': true,
    'cm': true,
    'in': true,
    'pt': true,
    'pc': true,
    'q': true,

    // relative length units
    'em': true,
    'ex': true,
    'ch': true,
    'rem': true,

    // viewport-percentage lengths
    'vh': true,
    'vw': true,
    'vmin': true,
    'vmax': true,
    'vm': true
};

var ANGLE = {
    'deg': true,
    'grad': true,
    'rad': true,
    'turn': true
};

var TIME = {
    's': true,
    'ms': true
};

var FREQUENCY = {
    'hz': true,
    'khz': true
};

// https://www.w3.org/TR/css-values-3/#resolution (https://drafts.csswg.org/css-values/#resolution)
var RESOLUTION = {
    'dpi': true,
    'dpcm': true,
    'dppx': true,
    'x': true      // https://github.com/w3c/csswg-drafts/issues/461
};

// https://drafts.csswg.org/css-grid/#fr-unit
var FLEX = {
    'fr': true
};

// https://www.w3.org/TR/css3-speech/#mixing-props-voice-volume
var DECIBEL = {
    'db': true
};

// https://www.w3.org/TR/css3-speech/#voice-props-voice-pitch
var SEMITONES = {
    'st': true
};

function consumeFunction(token, addTokenToMatch, getNextToken) {
    var length = 1;
    var cursor;

    do {
        cursor = getNextToken(length++);
    } while (cursor !== null && cursor.node !== token.node);

    if (cursor === null) {
        return false;
    }

    while (true) {
        // consume tokens until cursor
        if (addTokenToMatch() === cursor) {
            break;
        }
    }

    return true;
}

// TODO: implement
// can be used wherever <length>, <frequency>, <angle>, <time>, <percentage>, <number>, or <integer> values are allowed
// https://drafts.csswg.org/css-values/#calc-notation
function calc(token, addTokenToMatch, getNextToken) {
    if (token === null) {
        return false;
    }

    var name = token.value.toLowerCase();
    if (name !== 'calc(' &&
        name !== '-moz-calc(' &&
        name !== '-webkit-calc(') {
        return false;
    }

    return consumeFunction(token, addTokenToMatch, getNextToken);
}

function attr(token, addTokenToMatch, getNextToken) {
    if (token === null || token.value.toLowerCase() !== 'attr(') {
        return false;
    }

    return consumeFunction(token, addTokenToMatch, getNextToken);
}

function expression(token, addTokenToMatch, getNextToken) {
    if (token === null || token.value.toLowerCase() !== 'expression(') {
        return false;
    }

    return consumeFunction(token, addTokenToMatch, getNextToken);
}

function url(token, addTokenToMatch, getNextToken) {
    if (token === null || token.value.toLowerCase() !== 'url(') {
        return false;
    }

    return consumeFunction(token, addTokenToMatch, getNextToken);
}

function idSelector(token, addTokenToMatch) {
    if (token === null) {
        return false;
    }

    if (token.value.charCodeAt(0) !== NUMBERSIGN) {
        return false;
    }

    if (consumeIdentifier(token.value, 1) !== token.value.length) {
        return false;
    }

    addTokenToMatch();
    return true;
}

function isNumber(str) {
    return /^[-+]?(\d+|\d*\.\d+)([eE][-+]?\d+)?$/.test(str);
}

function consumeNumber(str, allowFraction) {
    var code = str.charCodeAt(0);

    return findNumberEnd(str, code === PLUSSIGN || code === HYPHENMINUS ? 1 : 0, allowFraction);
}

function consumeIdentifier(str, offset) {
    var code = str.charCodeAt(offset);

    if (code < 0x80 && SYMBOL_TYPE[code] !== IDENTIFIER && code !== HYPHENMINUS) {
        return offset;
    }

    return findIdentifierEnd(str, offset + 1);
}

function astNode(type) {
    return function(token, addTokenToMatch) {
        if (token === null || token.node.type !== type) {
            return false;
        }

        addTokenToMatch();
        return true;
    };
}

function dimension(type) {
    return function(token, addTokenToMatch, getNextToken) {
        if (calc(token, addTokenToMatch, getNextToken)) {
            return true;
        }

        if (token === null) {
            return false;
        }

        var numberEnd = consumeNumber(token.value, true);
        if (numberEnd === 0) {
            return false;
        }

        if (type) {
            if (!type.hasOwnProperty(token.value.substr(numberEnd).toLowerCase())) {
                return false;
            }
        } else {
            var unitEnd = consumeIdentifier(token.value, numberEnd);
            if (unitEnd === numberEnd || unitEnd !== token.value.length) {
                return false;
            }
        }

        addTokenToMatch();
        return true;
    };
}

function zeroUnitlessDimension(type) {
    var isDimension = dimension(type);

    return function(token, addTokenToMatch, getNextToken) {
        if (isDimension(token, addTokenToMatch, getNextToken)) {
            return true;
        }

        if (token === null || Number(token.value) !== 0) {
            return false;
        }

        addTokenToMatch();
        return true;
    };
}

function number(token, addTokenToMatch, getNextToken) {
    if (calc(token, addTokenToMatch, getNextToken)) {
        return true;
    }

    if (token === null) {
        return false;
    }

    var numberEnd = consumeNumber(token.value, true);
    if (numberEnd !== token.value.length) {
        return false;
    }

    addTokenToMatch();
    return true;
}

function numberZeroOne(token, addTokenToMatch, getNextToken) {
    if (calc(token, addTokenToMatch, getNextToken)) {
        return true;
    }

    if (token === null || !isNumber(token.value)) {
        return false;
    }

    var value = Number(token.value);
    if (value < 0 || value > 1) {
        return false;
    }

    addTokenToMatch();
    return true;
}

function numberOneOrGreater(token, addTokenToMatch, getNextToken) {
    if (calc(token, addTokenToMatch, getNextToken)) {
        return true;
    }

    if (token === null || !isNumber(token.value)) {
        return false;
    }

    var value = Number(token.value);
    if (value < 1) {
        return false;
    }

    addTokenToMatch();
    return true;
}

// TODO: fail on 10e-2
function integer(token, addTokenToMatch, getNextToken) {
    if (calc(token, addTokenToMatch, getNextToken)) {
        return true;
    }

    if (token === null) {
        return false;
    }

    var numberEnd = consumeNumber(token.value, false);
    if (numberEnd !== token.value.length) {
        return false;
    }

    addTokenToMatch();
    return true;
}

// TODO: fail on 10e-2
function positiveInteger(token, addTokenToMatch, getNextToken) {
    if (calc(token, addTokenToMatch, getNextToken)) {
        return true;
    }

    if (token === null) {
        return false;
    }

    var numberEnd = findDecimalNumberEnd(token.value, 0);
    if (numberEnd !== token.value.length || token.value.charCodeAt(0) === HYPHENMINUS) {
        return false;
    }

    addTokenToMatch();
    return true;
}

function hexColor(token, addTokenToMatch) {
    if (token === null || token.value.charCodeAt(0) !== NUMBERSIGN) {
        return false;
    }

    var length = token.value.length - 1;

    // valid length is 3, 4, 6 and 8 (+1 for #)
    if (length !== 3 && length !== 4 && length !== 6 && length !== 8) {
        return false;
    }

    for (var i = 1; i < length; i++) {
        if (!isHex(token.value.charCodeAt(i))) {
            return false;
        }
    }

    addTokenToMatch();
    return true;
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident
// https://drafts.csswg.org/css-values-4/#identifier-value
function customIdent(token, addTokenToMatch) {
    if (token === null) {
        return false;
    }

    var identEnd = consumeIdentifier(token.value, 0);
    if (identEnd !== token.value.length) {
        return false;
    }

    var name = token.value.toLowerCase();

    // § 3.2. Author-defined Identifiers: the <custom-ident> type
    // The CSS-wide keywords are not valid <custom-ident>s
    if (name === 'unset' || name === 'initial' || name === 'inherit') {
        return false;
    }

    // The default keyword is reserved and is also not a valid <custom-ident>
    if (name === 'default') {
        return false;
    }

    // TODO: ignore property specific keywords (as described https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)

    addTokenToMatch();
    return true;
}

module.exports = {
    'angle': zeroUnitlessDimension(ANGLE),
    'attr()': attr,
    'custom-ident': customIdent,
    'decibel': dimension(DECIBEL),
    'dimension': dimension(),
    'frequency': dimension(FREQUENCY),
    'flex': dimension(FLEX),
    'hex-color': hexColor,
    'id-selector': idSelector, // element( <id-selector> )
    'ident': astNode('Identifier'),
    'integer': integer,
    'length': zeroUnitlessDimension(LENGTH),
    'number': number,
    'number-zero-one': numberZeroOne,
    'number-one-or-greater': numberOneOrGreater,
    'percentage': dimension(PERCENTAGE),
    'positive-integer': positiveInteger,
    'resolution': dimension(RESOLUTION),
    'semitones': dimension(SEMITONES),
    'string': astNode('String'),
    'time': dimension(TIME),
    'unicode-range': astNode('UnicodeRange'),
    'url': url,

    // old IE stuff
    'progid': astNode('Raw'),
    'expression': expression
};

},{"../tokenizer/const":224,"../tokenizer/utils":227}],135:[function(require,module,exports){
var createCustomError = require('../../utils/createCustomError');

var SyntaxParseError = function(message, input, offset) {
    var error = createCustomError('SyntaxParseError', message);

    error.input = input;
    error.offset = offset;
    error.rawMessage = message;
    error.message = error.rawMessage + '\n' +
        '  ' + error.input + '\n' +
        '--' + new Array((error.offset || error.input.length) + 1).join('-') + '^';

    return error;
};

module.exports = {
    SyntaxParseError: SyntaxParseError
};

},{"../../utils/createCustomError":229}],136:[function(require,module,exports){
function noop(value) {
    return value;
}

function generateMultiplier(multiplier) {
    if (multiplier.min === 0 && multiplier.max === 0) {
        return '*';
    }

    if (multiplier.min === 0 && multiplier.max === 1) {
        return '?';
    }

    if (multiplier.min === 1 && multiplier.max === 0) {
        return multiplier.comma ? '#' : '+';
    }

    if (multiplier.min === 1 && multiplier.max === 1) {
        return '';
    }

    return (
        (multiplier.comma ? '#' : '') +
        (multiplier.min === multiplier.max
            ? '{' + multiplier.min + '}'
            : '{' + multiplier.min + ',' + (multiplier.max !== 0 ? multiplier.max : '') + '}'
        )
    );
}

function generateSequence(node, forceBraces, decorate) {
    var result = node.terms.map(function(term) {
        return generate(term, forceBraces, decorate);
    }).join(node.combinator === ' ' ? ' ' : ' ' + node.combinator + ' ');

    if (node.explicit || forceBraces) {
        result = (result[0] !== ',' ? '[ ' : '[') + result + ' ]';
    }

    return result;
}

function generate(node, forceBraces, decorate) {
    var result;

    switch (node.type) {
        case 'Group':
            result =
                generateSequence(node, forceBraces, decorate) +
                (node.disallowEmpty ? '!' : '');
            break;

        case 'Multiplier':
            // return since node is a composition
            return (
                generate(node.term, forceBraces, decorate) +
                decorate(generateMultiplier(node), node)
            );

        case 'Type':
            result = '<' + node.name + '>';
            break;

        case 'Property':
            result = '<\'' + node.name + '\'>';
            break;

        case 'Keyword':
            result = node.name;
            break;

        case 'AtKeyword':
            result = '@' + node.name;
            break;

        case 'Function':
            result = node.name + '(';
            break;

        case 'String':
        case 'Token':
            result = node.value;
            break;

        case 'Comma':
            result = ',';
            break;

        default:
            throw new Error('Unknown node type `' + node.type + '`');
    }

    return decorate(result, node);
}

module.exports = function(node, options) {
    var decorate = noop;
    var forceBraces = false;

    if (typeof options === 'function') {
        decorate = options;
    } else if (options) {
        forceBraces = Boolean(options.forceBraces);
        if (typeof options.decorate === 'function') {
            decorate = options.decorate;
        }
    }

    return generate(node, forceBraces, decorate);
};

},{}],137:[function(require,module,exports){
module.exports = {
    SyntaxParseError: require('./error').SyntaxParseError,
    parse: require('./parse'),
    generate: require('./generate'),
    walk: require('./walk')
};

},{"./error":135,"./generate":136,"./parse":138,"./walk":140}],138:[function(require,module,exports){
var Tokenizer = require('./tokenizer');
var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;
var EXCLAMATIONMARK = 33;    // !
var NUMBERSIGN = 35;         // #
var AMPERSAND = 38;          // &
var APOSTROPHE = 39;         // '
var LEFTPARENTHESIS = 40;    // (
var RIGHTPARENTHESIS = 41;   // )
var ASTERISK = 42;           // *
var PLUSSIGN = 43;           // +
var COMMA = 44;              // ,
var LESSTHANSIGN = 60;       // <
var GREATERTHANSIGN = 62;    // >
var QUESTIONMARK = 63;       // ?
var COMMERCIALAT = 64;       // @
var LEFTSQUAREBRACKET = 91;  // [
var RIGHTSQUAREBRACKET = 93; // ]
var LEFTCURLYBRACKET = 123;  // {
var VERTICALLINE = 124;      // |
var RIGHTCURLYBRACKET = 125; // }
var NAME_CHAR = createCharMap(function(ch) {
    return /[a-zA-Z0-9\-]/.test(ch);
});
var COMBINATOR_PRECEDENCE = {
    ' ': 1,
    '&&': 2,
    '||': 3,
    '|': 4
};

function createCharMap(fn) {
    var array = typeof Uint32Array === 'function' ? new Uint32Array(128) : new Array(128);
    for (var i = 0; i < 128; i++) {
        array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
    }
    return array;
}

function scanSpaces(tokenizer) {
    return tokenizer.substringToPos(
        tokenizer.findWsEnd(tokenizer.pos + 1)
    );
}

function scanWord(tokenizer) {
    var end = tokenizer.pos;

    for (; end < tokenizer.str.length; end++) {
        var code = tokenizer.str.charCodeAt(end);
        if (code >= 128 || NAME_CHAR[code] === 0) {
            break;
        }
    }

    if (tokenizer.pos === end) {
        tokenizer.error('Expect a keyword');
    }

    return tokenizer.substringToPos(end);
}

function scanNumber(tokenizer) {
    var end = tokenizer.pos;

    for (; end < tokenizer.str.length; end++) {
        var code = tokenizer.str.charCodeAt(end);
        if (code < 48 || code > 57) {
            break;
        }
    }

    if (tokenizer.pos === end) {
        tokenizer.error('Expect a number');
    }

    return tokenizer.substringToPos(end);
}

function scanString(tokenizer) {
    var end = tokenizer.str.indexOf('\'', tokenizer.pos + 1);

    if (end === -1) {
        tokenizer.pos = tokenizer.str.length;
        tokenizer.error('Expect an apostrophe');
    }

    return tokenizer.substringToPos(end + 1);
}

function readMultiplierRange(tokenizer) {
    var min = null;
    var max = null;

    tokenizer.eat(LEFTCURLYBRACKET);

    min = scanNumber(tokenizer);

    if (tokenizer.charCode() === COMMA) {
        tokenizer.pos++;
        if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
            max = scanNumber(tokenizer);
        }
    } else {
        max = min;
    }

    tokenizer.eat(RIGHTCURLYBRACKET);

    return {
        min: Number(min),
        max: max ? Number(max) : 0
    };
}

function readMultiplier(tokenizer) {
    var range = null;
    var comma = false;

    switch (tokenizer.charCode()) {
        case ASTERISK:
            tokenizer.pos++;

            range = {
                min: 0,
                max: 0
            };

            break;

        case PLUSSIGN:
            tokenizer.pos++;

            range = {
                min: 1,
                max: 0
            };

            break;

        case QUESTIONMARK:
            tokenizer.pos++;

            range = {
                min: 0,
                max: 1
            };

            break;

        case NUMBERSIGN:
            tokenizer.pos++;

            comma = true;

            if (tokenizer.charCode() === LEFTCURLYBRACKET) {
                range = readMultiplierRange(tokenizer);
            } else {
                range = {
                    min: 1,
                    max: 0
                };
            }

            break;

        case LEFTCURLYBRACKET:
            range = readMultiplierRange(tokenizer);
            break;

        default:
            return null;
    }

    return {
        type: 'Multiplier',
        comma: comma,
        min: range.min,
        max: range.max,
        term: null
    };
}

function maybeMultiplied(tokenizer, node) {
    var multiplier = readMultiplier(tokenizer);

    if (multiplier !== null) {
        multiplier.term = node;
        return multiplier;
    }

    return node;
}

function maybeToken(tokenizer) {
    var ch = tokenizer.peek();

    if (ch === '') {
        return null;
    }

    return {
        type: 'Token',
        value: ch
    };
}

function readProperty(tokenizer) {
    var name;

    tokenizer.eat(LESSTHANSIGN);
    tokenizer.eat(APOSTROPHE);

    name = scanWord(tokenizer);

    tokenizer.eat(APOSTROPHE);
    tokenizer.eat(GREATERTHANSIGN);

    return maybeMultiplied(tokenizer, {
        type: 'Property',
        name: name
    });
}

function readType(tokenizer) {
    var name;

    tokenizer.eat(LESSTHANSIGN);
    name = scanWord(tokenizer);

    if (tokenizer.charCode() === LEFTPARENTHESIS &&
        tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
        tokenizer.pos += 2;
        name += '()';
    }

    tokenizer.eat(GREATERTHANSIGN);

    return maybeMultiplied(tokenizer, {
        type: 'Type',
        name: name
    });
}

function readKeywordOrFunction(tokenizer) {
    var name;

    name = scanWord(tokenizer);

    if (tokenizer.charCode() === LEFTPARENTHESIS) {
        tokenizer.pos++;

        return {
            type: 'Function',
            name: name
        };
    }

    return maybeMultiplied(tokenizer, {
        type: 'Keyword',
        name: name
    });
}

function regroupTerms(terms, combinators) {
    function createGroup(terms, combinator) {
        return {
            type: 'Group',
            terms: terms,
            combinator: combinator,
            disallowEmpty: false,
            explicit: false
        };
    }

    combinators = Object.keys(combinators).sort(function(a, b) {
        return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
    });

    while (combinators.length > 0) {
        var combinator = combinators.shift();
        for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
            var term = terms[i];
            if (term.type === 'Combinator') {
                if (term.value === combinator) {
                    if (subgroupStart === -1) {
                        subgroupStart = i - 1;
                    }
                    terms.splice(i, 1);
                    i--;
                } else {
                    if (subgroupStart !== -1 && i - subgroupStart > 1) {
                        terms.splice(
                            subgroupStart,
                            i - subgroupStart,
                            createGroup(terms.slice(subgroupStart, i), combinator)
                        );
                        i = subgroupStart + 1;
                    }
                    subgroupStart = -1;
                }
            }
        }

        if (subgroupStart !== -1 && combinators.length) {
            terms.splice(
                subgroupStart,
                i - subgroupStart,
                createGroup(terms.slice(subgroupStart, i), combinator)
            );
        }
    }

    return combinator;
}

function readImplicitGroup(tokenizer) {
    var terms = [];
    var combinators = {};
    var token;
    var prevToken = null;
    var prevTokenPos = tokenizer.pos;

    while (token = peek(tokenizer)) {
        if (token.type !== 'Spaces') {
            if (token.type === 'Combinator') {
                // check for combinator in group beginning and double combinator sequence
                if (prevToken === null || prevToken.type === 'Combinator') {
                    tokenizer.pos = prevTokenPos;
                    tokenizer.error('Unexpected combinator');
                }

                combinators[token.value] = true;
            } else if (prevToken !== null && prevToken.type !== 'Combinator') {
                combinators[' '] = true;  // a b
                terms.push({
                    type: 'Combinator',
                    value: ' '
                });
            }

            terms.push(token);
            prevToken = token;
            prevTokenPos = tokenizer.pos;
        }
    }

    // check for combinator in group ending
    if (prevToken !== null && prevToken.type === 'Combinator') {
        tokenizer.pos -= prevTokenPos;
        tokenizer.error('Unexpected combinator');
    }

    return {
        type: 'Group',
        terms: terms,
        combinator: regroupTerms(terms, combinators) || ' ',
        disallowEmpty: false,
        explicit: false
    };
}

function readGroup(tokenizer) {
    var result;

    tokenizer.eat(LEFTSQUAREBRACKET);
    result = readImplicitGroup(tokenizer);
    tokenizer.eat(RIGHTSQUAREBRACKET);

    result.explicit = true;

    if (tokenizer.charCode() === EXCLAMATIONMARK) {
        tokenizer.pos++;
        result.disallowEmpty = true;
    }

    return result;
}

function peek(tokenizer) {
    var code = tokenizer.charCode();

    if (code < 128 && NAME_CHAR[code] === 1) {
        return readKeywordOrFunction(tokenizer);
    }

    switch (code) {
        case RIGHTSQUAREBRACKET:
            // don't eat, stop scan a group
            break;

        case LEFTSQUAREBRACKET:
            return maybeMultiplied(tokenizer, readGroup(tokenizer));

        case LESSTHANSIGN:
            return tokenizer.nextCharCode() === APOSTROPHE
                ? readProperty(tokenizer)
                : readType(tokenizer);

        case VERTICALLINE:
            return {
                type: 'Combinator',
                value: tokenizer.substringToPos(
                    tokenizer.nextCharCode() === VERTICALLINE
                        ? tokenizer.pos + 2
                        : tokenizer.pos + 1
                )
            };

        case AMPERSAND:
            tokenizer.pos++;
            tokenizer.eat(AMPERSAND);

            return {
                type: 'Combinator',
                value: '&&'
            };

        case COMMA:
            tokenizer.pos++;
            return {
                type: 'Comma'
            };

        case APOSTROPHE:
            return maybeMultiplied(tokenizer, {
                type: 'String',
                value: scanString(tokenizer)
            });

        case SPACE:
        case TAB:
        case N:
        case R:
        case F:
            return {
                type: 'Spaces',
                value: scanSpaces(tokenizer)
            };

        case COMMERCIALAT:
            code = tokenizer.nextCharCode();

            if (code < 128 && NAME_CHAR[code] === 1) {
                tokenizer.pos++;
                return {
                    type: 'AtKeyword',
                    name: scanWord(tokenizer)
                };
            }

            return maybeToken(tokenizer);

        case ASTERISK:
        case PLUSSIGN:
        case QUESTIONMARK:
        case NUMBERSIGN:
        case EXCLAMATIONMARK:
            // prohibited tokens (used as a multiplier start)
            break;

        case LEFTCURLYBRACKET:
            // LEFTCURLYBRACKET is allowed since mdn/data uses it w/o quoting
            // check next char isn't a number, because it's likely a disjoined multiplier
            code = tokenizer.nextCharCode();

            if (code < 48 || code > 57) {
                return maybeToken(tokenizer);
            }

            break;

        default:
            return maybeToken(tokenizer);
    }
}

function parse(str) {
    var tokenizer = new Tokenizer(str);
    var result = readImplicitGroup(tokenizer);

    if (tokenizer.pos !== str.length) {
        tokenizer.error('Unexpected input');
    }

    // reduce redundant groups with single group term
    if (result.terms.length === 1 && result.terms[0].type === 'Group') {
        result = result.terms[0];
    }

    return result;
}

// warm up parse to elimitate code branches that never execute
// fix soft deoptimizations (insufficient type feedback)
parse('[a&&<b>#|<\'c\'>*||e() f{2} /,(% g#{1,2} h{2,})]!');

module.exports = parse;

},{"./tokenizer":139}],139:[function(require,module,exports){
var SyntaxParseError = require('./error').SyntaxParseError;

var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;

var Tokenizer = function(str) {
    this.str = str;
    this.pos = 0;
};

Tokenizer.prototype = {
    charCodeAt: function(pos) {
        return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
    },
    charCode: function() {
        return this.charCodeAt(this.pos);
    },
    nextCharCode: function() {
        return this.charCodeAt(this.pos + 1);
    },
    nextNonWsCode: function(pos) {
        return this.charCodeAt(this.findWsEnd(pos));
    },
    findWsEnd: function(pos) {
        for (; pos < this.str.length; pos++) {
            var code = this.str.charCodeAt(pos);
            if (code !== R && code !== N && code !== F && code !== SPACE && code !== TAB) {
                break;
            }
        }

        return pos;
    },
    substringToPos: function(end) {
        return this.str.substring(this.pos, this.pos = end);
    },
    eat: function(code) {
        if (this.charCode() !== code) {
            this.error('Expect `' + String.fromCharCode(code) + '`');
        }

        this.pos++;
    },
    peek: function() {
        return this.pos < this.str.length ? this.str.charAt(this.pos++) : '';
    },
    error: function(message) {
        throw new SyntaxParseError(message, this.str, this.pos);
    }
};

module.exports = Tokenizer;

},{"./error":135}],140:[function(require,module,exports){
'use strict';

var noop = function() {};

function ensureFunction(value) {
    return typeof value === 'function' ? value : noop;
}

module.exports = function(node, options, context) {
    function walk(node) {
        enter.call(context, node);

        switch (node.type) {
            case 'Group':
                node.terms.forEach(walk);
                break;

            case 'Multiplier':
                walk(node.term);
                break;

            case 'Type':
            case 'Property':
            case 'Keyword':
            case 'AtKeyword':
            case 'Function':
            case 'String':
            case 'Token':
            case 'Comma':
                break;

            default:
                throw new Error('Unknown type: ' + node.type);
        }

        leave.call(context, node);
    }

    var enter = noop;
    var leave = noop;

    if (typeof options === 'function') {
        enter = options;
    } else if (options) {
        enter = ensureFunction(options.enter);
        leave = ensureFunction(options.leave);
    }

    if (enter === noop && leave === noop) {
        throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
    }

    walk(node, context);
};

},{}],141:[function(require,module,exports){
var parse = require('./grammar/parse');

var MATCH = { type: 'Match' };
var MISMATCH = { type: 'Mismatch' };
var DISALLOW_EMPTY = { type: 'DisallowEmpty' };
var LEFTPARENTHESIS = 40;  // (
var RIGHTPARENTHESIS = 41; // )

function createCondition(match, thenBranch, elseBranch) {
    // reduce node count
    if (thenBranch === MATCH && elseBranch === MISMATCH) {
        return match;
    }

    if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
        return match;
    }

    if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH) {
        thenBranch = match.then;
        match = match.match;
    }

    return {
        type: 'If',
        match: match,
        then: thenBranch,
        else: elseBranch
    };
}

function isFunctionType(name) {
    return (
        name.length > 2 &&
        name.charCodeAt(name.length - 2) === LEFTPARENTHESIS &&
        name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS
    );
}

function isEnumCapatible(term) {
    return (
        term.type === 'Keyword' ||
        term.type === 'AtKeyword' ||
        term.type === 'Function' ||
        term.type === 'Type' && isFunctionType(term.name)
    );
}

function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
    switch (combinator) {
        case ' ':
            // Juxtaposing components means that all of them must occur, in the given order.
            //
            // a b c
            // =
            // match a
            //   then match b
            //     then match c
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            //   else MISMATCH
            var result = MATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                result = createCondition(
                    term,
                    result,
                    MISMATCH
                );
            };

            return result;

        case '|':
            // A bar (|) separates two or more alternatives: exactly one of them must occur.
            //
            // a | b | c
            // =
            // match a
            //   then MATCH
            //   else match b
            //     then MATCH
            //     else match c
            //       then MATCH
            //       else MISMATCH

            var result = MISMATCH;
            var map = null;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];

                // reduce sequence of keywords into a Enum
                if (isEnumCapatible(term)) {
                    if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
                        map = Object.create(null);
                        result = createCondition(
                            {
                                type: 'Enum',
                                map: map
                            },
                            MATCH,
                            result
                        );
                    }

                    if (map !== null) {
                        var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
                        if (key in map === false) {
                            map[key] = term;
                            continue;
                        }
                    }
                }

                map = null;

                // create a new conditonal node
                result = createCondition(
                    term,
                    MATCH,
                    result
                );
            };

            return result;

        case '&&':
            // A double ampersand (&&) separates two or more components,
            // all of which must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since &&-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: true
                };
            }

            // Use a combination tree for groups with small number of terms
            //
            // a && b && c
            // =
            // match a
            //   then [b && c]
            //   else match b
            //     then [a && c]
            //     else match c
            //       then [a && b]
            //       else MISMATCH
            //
            // a && b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MISMATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MISMATCH
            //     else MISMATCH
            var result = MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        false
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;

        case '||':
            // A double bar (||) separates two or more options:
            // one or more of them must occur, in any order.

            // Use MatchOnce for groups with a large number of terms,
            // since ||-groups produces at least N!-node trees
            if (terms.length > 5) {
                return {
                    type: 'MatchOnce',
                    terms: terms,
                    all: false
                };;
            }

            // Use a combination tree for groups with small number of terms
            //
            // a || b || c
            // =
            // match a
            //   then [b || c]
            //   else match b
            //     then [a || c]
            //     else match c
            //       then [a || b]
            //       else MISMATCH
            //
            // a || b
            // =
            // match a
            //   then match b
            //     then MATCH
            //     else MATCH
            //   else match b
            //     then match a
            //       then MATCH
            //       else MATCH
            //     else MISMATCH
            var result = atLeastOneTermMatched ? MATCH : MISMATCH;

            for (var i = terms.length - 1; i >= 0; i--) {
                var term = terms[i];
                var thenClause;

                if (terms.length > 1) {
                    thenClause = buildGroupMatchGraph(
                        combinator,
                        terms.filter(function(newGroupTerm) {
                            return newGroupTerm !== term;
                        }),
                        true
                    );
                } else {
                    thenClause = MATCH;
                }

                result = createCondition(
                    term,
                    thenClause,
                    result
                );
            };

            return result;
    }
}

function buildMultiplierMatchGraph(node) {
    var result = MATCH;
    var matchTerm = buildMatchGraph(node.term);

    if (node.max === 0) {
        // disable repeating of empty match to prevent infinite loop
        matchTerm = createCondition(
            matchTerm,
            DISALLOW_EMPTY,
            MISMATCH
        );

        // an occurrence count is not limited, make a cycle;
        // to collect more terms on each following matching mismatch
        result = createCondition(
            matchTerm,
            null, // will be a loop
            MISMATCH
        );

        result.then = createCondition(
            MATCH,
            MATCH,
            result // make a loop
        );

        if (node.comma) {
            result.then.else = createCondition(
                { type: 'Comma', syntax: node },
                result,
                MISMATCH
            );
        }
    } else {
        // create a match node chain for [min .. max] interval with optional matches
        for (var i = node.min || 1; i <= node.max; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                createCondition(
                    MATCH,
                    MATCH,
                    result
                ),
                MISMATCH
            );
        }
    }

    if (node.min === 0) {
        // allow zero match
        result = createCondition(
            MATCH,
            MATCH,
            result
        );
    } else {
        // create a match node chain to collect [0 ... min - 1] required matches
        for (var i = 0; i < node.min - 1; i++) {
            if (node.comma && result !== MATCH) {
                result = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }

            result = createCondition(
                matchTerm,
                result,
                MISMATCH
            );
        }
    }

    return result;
}

function buildMatchGraph(node) {
    if (typeof node === 'function') {
        return {
            type: 'Generic',
            fn: node
        };
    }

    switch (node.type) {
        case 'Group':
            var result = buildGroupMatchGraph(
                node.combinator,
                node.terms.map(buildMatchGraph),
                false
            );

            if (node.disallowEmpty) {
                result = createCondition(
                    result,
                    DISALLOW_EMPTY,
                    MISMATCH
                );
            }

            return result;

        case 'Multiplier':
            return buildMultiplierMatchGraph(node);

        case 'Type':
        case 'Property':
            return {
                type: node.type,
                name: node.name,
                syntax: node
            };

        case 'Keyword':
            return {
                type: node.type,
                name: node.name.toLowerCase(),
                syntax: node
            };

        case 'AtKeyword':
            return {
                type: node.type,
                name: '@' + node.name.toLowerCase(),
                syntax: node
            };

        case 'Function':
            return {
                type: node.type,
                name: node.name.toLowerCase() + '(',
                syntax: node
            };

        case 'String':
            // convert a one char length String to a Token
            if (node.value.length === 3) {
                return {
                    type: 'Token',
                    value: node.value.charAt(1),
                    syntax: node
                };
            }

            // otherwise use it as is
            return {
                type: node.type,
                value: node.value,
                syntax: node
            };

        case 'Token':
            return {
                type: node.type,
                value: node.value,
                syntax: node
            };

        case 'Comma':
            return {
                type: node.type,
                syntax: node
            };

        default:
            throw new Error('Unknown node type:', node.type);
    }
}

module.exports = {
    MATCH: MATCH,
    MISMATCH: MISMATCH,
    DISALLOW_EMPTY: DISALLOW_EMPTY,
    buildMatchGraph: function(syntaxTree, ref) {
        if (typeof syntaxTree === 'string') {
            syntaxTree = parse(syntaxTree);
        }

        return {
            type: 'MatchGraph',
            match: buildMatchGraph(syntaxTree),
            syntax: ref || null,
            source: syntaxTree
        };
    }
};

},{"./grammar/parse":138}],142:[function(require,module,exports){
'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;
var matchGraph = require('./match-graph');
var MATCH = matchGraph.MATCH;
var MISMATCH = matchGraph.MISMATCH;
var DISALLOW_EMPTY = matchGraph.DISALLOW_EMPTY;

var TOKEN = 1;
var OPEN_SYNTAX = 2;
var CLOSE_SYNTAX = 3;

var EXIT_REASON_MATCH = 'Match';
var EXIT_REASON_MISMATCH = 'Mismatch';
var EXIT_REASON_ITERATION_LIMIT = 'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)';

var ITERATION_LIMIT = 10000;
var totalIterationCount = 0;

function mapList(list, fn) {
    var result = [];

    while (list) {
        result.unshift(fn(list));
        list = list.prev;
    }

    return result;
}

function isCommaContextStart(token) {
    if (token === null) {
        return true;
    }

    token = token.value.charAt(token.value.length - 1);

    return (
        token === ',' ||
        token === '(' ||
        token === '[' ||
        token === '/'
    );
}

function isCommaContextEnd(token) {
    if (token === null) {
        return true;
    }

    token = token.value.charAt(0);

    return (
        token === ')' ||
        token === ']' ||
        token === '/'
    );
}

function internalMatch(tokens, syntax, syntaxes) {
    function moveToNextToken() {
        do {
            tokenCursor++;
            token = tokenCursor < tokens.length ? tokens[tokenCursor] : null;
        } while (token !== null && !/\S/.test(token.value));
    }

    function getNextToken(offset) {
        var nextIndex = tokenCursor + offset;

        return nextIndex < tokens.length ? tokens[nextIndex] : null;
    }

    function pushThenStack(nextSyntax) {
        thenStack = {
            nextSyntax: nextSyntax,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            prev: thenStack
        };
    }

    function pushElseStack(nextSyntax) {
        elseStack = {
            nextSyntax: nextSyntax,
            matchStack: matchStack,
            syntaxStack: syntaxStack,
            thenStack: thenStack,
            tokenCursor: tokenCursor,
            token: token,
            prev: elseStack
        };
    }

    function addTokenToMatch() {
        matchStack = {
            type: TOKEN,
            syntax: syntax.syntax,
            token: token,
            prev: matchStack
        };

        moveToNextToken();

        if (tokenCursor > longestMatch) {
            longestMatch = tokenCursor;
        }

        return matchStack.token;
    }

    function openSyntax() {
        syntaxStack = {
            syntax: syntax,
            prev: syntaxStack
        };

        matchStack = {
            type: OPEN_SYNTAX,
            syntax: syntax.syntax,
            token: matchStack.token,
            prev: matchStack
        };
    }

    function closeSyntax() {
        if (matchStack.type === OPEN_SYNTAX) {
            matchStack = matchStack.prev;
        } else {
            matchStack = {
                type: CLOSE_SYNTAX,
                syntax: syntaxStack.syntax,
                token: matchStack.token,
                prev: matchStack
            };
        }

        syntaxStack = syntaxStack.prev;
    }

    var syntaxStack = null;
    var thenStack = null;
    var elseStack = null;

    var iterationCount = 0;
    var exitReason = EXIT_REASON_MATCH;

    var matchStack = { type: 'Stub', syntax: null, token: null, tokenCursor: -1, prev: null };
    var longestMatch = 0;
    var tokenCursor = -1;
    var token = null;

    moveToNextToken();

    while (true) {
        // console.log('--\n',
        //     '#' + iterationCount,
        //     require('util').inspect({
        //         match: mapList(matchStack, x => x.type === TOKEN ? x.token && x.token.value : x.syntax ? x.type + '!' + x.syntax.name : null),
        //         elseStack: mapList(elseStack, x => x.id),
        //         thenStack: mapList(thenStack, x => x.id),
        //         token: token && token.value,
        //         tokenCursor,
        //         syntax
        //     }, { depth: null })
        // );

        // prevent infinite loop
        if (++iterationCount === ITERATION_LIMIT) {
            console.warn('[csstree-match] BREAK after ' + ITERATION_LIMIT + ' iterations');
            exitReason = EXIT_REASON_ITERATION_LIMIT;
            break;
        }

        if (syntax === MATCH) {
            if (thenStack === null) {
                // turn to MISMATCH when some tokens left unmatched
                if (token !== null) {
                    // doesn't mismatch if just one token left and it's an IE hack
                    if (tokenCursor !== tokens.length - 1 || (token.value !== '\\0' && token.value !== '\\9')) {
                        syntax = MISMATCH;
                        continue;
                    }
                }

                // break the main loop, return a result - MATCH
                exitReason = EXIT_REASON_MATCH;
                break;
            }

            // go to next syntax (`then` branch)
            syntax = thenStack.nextSyntax;

            // check match is not empty
            if (syntax === DISALLOW_EMPTY) {
                if (thenStack.matchStack.token === matchStack.token) {
                    syntax = MISMATCH;
                    continue;
                } else {
                    syntax = MATCH;
                }
            }

            // close syntax if needed
            while (syntaxStack !== null && thenStack.syntaxStack !== syntaxStack) {
                closeSyntax();
            }

            // pop stack
            thenStack = thenStack.prev;
            continue;
        }

        if (syntax === MISMATCH) {
            if (elseStack === null) {
                // break the main loop, return a result - MISMATCH
                exitReason = EXIT_REASON_MISMATCH;
                break;
            }

            // go to next syntax (`else` branch)
            syntax = elseStack.nextSyntax;

            // restore all the rest stack states
            thenStack = elseStack.thenStack;
            syntaxStack = elseStack.syntaxStack;
            matchStack = elseStack.matchStack;
            tokenCursor = elseStack.tokenCursor;
            token = elseStack.token;

            // pop stack
            elseStack = elseStack.prev;
            continue;
        }

        switch (syntax.type) {
            case 'MatchGraph':
                syntax = syntax.match;
                break;

            case 'If':
                // IMPORTANT: else stack push must go first,
                // since it stores the state of thenStack before changes
                if (syntax.else !== MISMATCH) {
                    pushElseStack(syntax.else);
                }

                if (syntax.then !== MATCH) {
                    pushThenStack(syntax.then);
                }

                syntax = syntax.match;
                break;

            case 'MatchOnce':
                syntax = {
                    type: 'MatchOnceBuffer',
                    terms: syntax.terms,
                    all: syntax.all,
                    matchStack: matchStack,
                    index: 0,
                    mask: 0
                };
                break;

            case 'MatchOnceBuffer':
                if (syntax.index === syntax.terms.length) {
                    // if no matches during a cycle
                    if (syntax.matchStack === matchStack) {
                        // no matches at all or it's required all terms to be matched
                        if (syntax.mask === 0 || syntax.all) {
                            syntax = MISMATCH;
                            break;
                        }

                        // a partial match is ok
                        syntax = MATCH;
                        break;
                    } else {
                        // start trying to match from the start
                        syntax.index = 0;
                        syntax.matchStack = matchStack;
                    }
                }

                for (; syntax.index < syntax.terms.length; syntax.index++) {
                    if ((syntax.mask & (1 << syntax.index)) === 0) {
                        // IMPORTANT: else stack push must go first,
                        // since it stores the state of thenStack before changes
                        pushElseStack(syntax);
                        pushThenStack({
                            type: 'AddMatchOnce',
                            buffer: syntax
                        });

                        // match
                        syntax = syntax.terms[syntax.index++];
                        break;
                    }
                }
                break;

            case 'AddMatchOnce':
                syntax = syntax.buffer;

                var newMask = syntax.mask | (1 << (syntax.index - 1));

                // all terms are matched
                if (newMask === (1 << syntax.terms.length) - 1) {
                    syntax = MATCH;
                    continue;
                }

                syntax = {
                    type: 'MatchOnceBuffer',
                    terms: syntax.terms,
                    all: syntax.all,
                    matchStack: syntax.matchStack,
                    index: syntax.index,
                    mask: newMask
                };

                break;

            case 'Enum':
                var name = token !== null ? token.value.toLowerCase() : '';

                // drop \0 and \9 hack from keyword name
                if (name.indexOf('\\') !== -1) {
                    name = name.replace(/\\[09].*$/, '');
                }

                if (hasOwnProperty.call(syntax.map, name)) {
                    syntax = syntax.map[name];
                } else {
                    syntax = MISMATCH;
                }

                break;

            case 'Generic':
                syntax = syntax.fn(token, addTokenToMatch, getNextToken) ? MATCH : MISMATCH;
                break;

            case 'Type':
            case 'Property':
                openSyntax();

                var syntaxDict = syntax.type === 'Type' ? 'types' : 'properties';

                if (hasOwnProperty.call(syntaxes, syntaxDict) && syntaxes[syntaxDict][syntax.name]) {
                    syntax = syntaxes[syntaxDict][syntax.name].match;
                } else {
                    syntax = undefined;
                }

                if (!syntax) {
                    throw new Error(
                        'Bad syntax reference: ' +
                        (syntaxStack.syntax.type === 'Type'
                            ? '<' + syntaxStack.syntax.name + '>'
                            : '<\'' + syntaxStack.syntax.name + '\'>')
                    );
                }

                break;

            case 'Keyword':
                var name = syntax.name;

                if (token !== null) {
                    var keywordName = token.value;

                    // drop \0 and \9 hack from keyword name
                    if (keywordName.indexOf('\\') !== -1) {
                        keywordName = keywordName.replace(/\\[09].*$/, '');
                    }

                    if (keywordName.toLowerCase() === name) {
                        addTokenToMatch();

                        syntax = MATCH;
                        break;
                    }
                }

                syntax = MISMATCH;
                break;

            case 'AtKeyword':
            case 'Function':
                if (token !== null && token.value.toLowerCase() === syntax.name) {
                    addTokenToMatch();

                    syntax = MATCH;
                    break;
                }

                syntax = MISMATCH;
                break;

            case 'Token':
                if (token !== null && token.value === syntax.value) {
                    addTokenToMatch();

                    syntax = MATCH;
                    break;
                }

                syntax = MISMATCH;
                break;

            case 'Comma':
                if (token !== null && token.value === ',') {
                    if (isCommaContextStart(matchStack.token)) {
                        syntax = MISMATCH;
                    } else {
                        addTokenToMatch();
                        syntax = isCommaContextEnd(token) ? MISMATCH : MATCH;
                    }
                } else {
                    syntax = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH : MISMATCH;
                }

                break;

            // case 'String':
            // TODO: strings with length other than 1 char

            default:
                throw new Error('Unknown node type: ' + syntax.type);
        }
    }

    totalIterationCount += iterationCount;

    if (exitReason === EXIT_REASON_MATCH) {
        while (syntaxStack !== null) {
            closeSyntax();
        }
    } else {
        matchStack = null;
    }

    return {
        tokens: tokens,
        reason: exitReason,
        iterations: iterationCount,
        match: matchStack,
        longestMatch: longestMatch
    };
}

function matchAsList(tokens, matchGraph, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});

    if (matchResult.match !== null) {
        matchResult.match = mapList(matchResult.match, function(item) {
            if (item.type === OPEN_SYNTAX || item.type === CLOSE_SYNTAX) {
                return { type: item.type, syntax: item.syntax };
            }

            return {
                syntax: item.syntax,
                token: item.token && item.token.value,
                node: item.token && item.token.node
            };
        }).slice(1);
    }

    return matchResult;
}

function matchAsTree(tokens, matchGraph, syntaxes) {
    var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});

    if (matchResult.match === null) {
        return matchResult;
    }

    var cursor = matchResult.match;
    var host = matchResult.match = {
        syntax: matchGraph.syntax || null,
        match: []
    };
    var stack = [host];

    // revert a list
    var prev = null;
    var next = null;
    while (cursor !== null) {
        next = cursor.prev;
        cursor.prev = prev;
        prev = cursor;
        cursor = next;
    }

    // init the cursor to start with 2nd item since 1st is a stub item
    cursor = prev.prev;

    // build a tree
    while (cursor !== null && cursor.syntax !== null) {
        var entry = cursor;

        switch (entry.type) {
            case OPEN_SYNTAX:
                host.match.push(host = {
                    syntax: entry.syntax,
                    match: []
                });
                stack.push(host);
                break;

            case CLOSE_SYNTAX:
                stack.pop();
                host = stack[stack.length - 1];
                break;

            default:
                host.match.push({
                    syntax: entry.syntax || null,
                    token: entry.token.value,
                    node: entry.token.node
                });
        }

        cursor = cursor.prev;
    }

    return matchResult;
}

module.exports = {
    matchAsList: matchAsList,
    matchAsTree: matchAsTree,
    getTotalIterationCount: function() {
        return totalIterationCount;
    }
};

},{"./match-graph":141}],143:[function(require,module,exports){
var List = require('../utils/list');

function getFirstMatchNode(matchNode) {
    if ('node' in matchNode) {
        return matchNode.node;
    }

    return getFirstMatchNode(matchNode.match[0]);
}

function getLastMatchNode(matchNode) {
    if ('node' in matchNode) {
        return matchNode.node;
    }

    return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
}

function matchFragments(lexer, ast, match, type, name) {
    function findFragments(matchNode) {
        if (matchNode.syntax !== null &&
            matchNode.syntax.type === type &&
            matchNode.syntax.name === name) {
            var start = getFirstMatchNode(matchNode);
            var end = getLastMatchNode(matchNode);

            lexer.syntax.walk(ast, function(node, item, list) {
                if (node === start) {
                    var nodes = new List();

                    do {
                        nodes.appendData(item.data);

                        if (item.data === end) {
                            break;
                        }

                        item = item.next;
                    } while (item !== null);

                    fragments.push({
                        parent: list,
                        nodes: nodes
                    });
                }
            });
        }

        if (Array.isArray(matchNode.match)) {
            matchNode.match.forEach(findFragments);
        }
    }

    var fragments = [];

    if (match.matched !== null) {
        findFragments(match.matched);
    }

    return fragments;
}

module.exports = {
    matchFragments: matchFragments
};

},{"../utils/list":230}],144:[function(require,module,exports){
var List = require('../utils/list');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isValidNumber(value) {
    // Number.isInteger(value) && value >= 0
    return (
        typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value &&
        value >= 0
    );
}

function isValidLocation(loc) {
    return (
        Boolean(loc) &&
        isValidNumber(loc.offset) &&
        isValidNumber(loc.line) &&
        isValidNumber(loc.column)
    );
}

function createNodeStructureChecker(type, fields) {
    return function checkNode(node, warn) {
        if (!node || node.constructor !== Object) {
            return warn(node, 'Type of node should be an Object');
        }

        for (var key in node) {
            var valid = true;

            if (hasOwnProperty.call(node, key) === false) {
                continue;
            }

            if (key === 'type') {
                if (node.type !== type) {
                    warn(node, 'Wrong node type `' + node.type + '`, expected `' + type + '`');
                }
            } else if (key === 'loc') {
                if (node.loc === null) {
                    continue;
                } else if (node.loc && node.loc.constructor === Object) {
                    if (typeof node.loc.source !== 'string') {
                        key += '.source';
                    } else if (!isValidLocation(node.loc.start)) {
                        key += '.start';
                    } else if (!isValidLocation(node.loc.end)) {
                        key += '.end';
                    } else {
                        continue;
                    }
                }

                valid = false;
            } else if (fields.hasOwnProperty(key)) {
                for (var i = 0, valid = false; !valid && i < fields[key].length; i++) {
                    var fieldType = fields[key][i];

                    switch (fieldType) {
                        case String:
                            valid = typeof node[key] === 'string';
                            break;

                        case Boolean:
                            valid = typeof node[key] === 'boolean';
                            break;

                        case null:
                            valid = node[key] === null;
                            break;

                        default:
                            if (typeof fieldType === 'string') {
                                valid = node[key] && node[key].type === fieldType;
                            } else if (Array.isArray(fieldType)) {
                                valid = node[key] instanceof List;
                            }
                    }
                }
            } else {
                warn(node, 'Unknown field `' + key + '` for ' + type + ' node type');
            }

            if (!valid) {
                warn(node, 'Bad value for `' + type + '.' + key + '`');
            }
        }

        for (var key in fields) {
            if (hasOwnProperty.call(fields, key) &&
                hasOwnProperty.call(node, key) === false) {
                warn(node, 'Field `' + type + '.' + key + '` is missed');
            }
        }
    };
}

function processStructure(name, nodeType) {
    var structure = nodeType.structure;
    var fields = {
        type: String,
        loc: true
    };
    var docs = {
        type: '"' + name + '"'
    };

    for (var key in structure) {
        if (hasOwnProperty.call(structure, key) === false) {
            continue;
        }

        var docsTypes = [];
        var fieldTypes = fields[key] = Array.isArray(structure[key])
            ? structure[key].slice()
            : [structure[key]];

        for (var i = 0; i < fieldTypes.length; i++) {
            var fieldType = fieldTypes[i];
            if (fieldType === String || fieldType === Boolean) {
                docsTypes.push(fieldType.name);
            } else if (fieldType === null) {
                docsTypes.push('null');
            } else if (typeof fieldType === 'string') {
                docsTypes.push('<' + fieldType + '>');
            } else if (Array.isArray(fieldType)) {
                docsTypes.push('List'); // TODO: use type enum
            } else {
                throw new Error('Wrong value `' + fieldType + '` in `' + name + '.' + key + '` structure definition');
            }
        }

        docs[key] = docsTypes.join(' | ');
    }

    return {
        docs: docs,
        check: createNodeStructureChecker(name, fields)
    };
}

module.exports = {
    getStructureFromConfig: function(config) {
        var structure = {};

        if (config.node) {
            for (var name in config.node) {
                if (hasOwnProperty.call(config.node, name)) {
                    var nodeType = config.node[name];

                    if (nodeType.structure) {
                        structure[name] = processStructure(name, nodeType);
                    } else {
                        throw new Error('Missed `structure` field in `' + name + '` node type definition');
                    }
                }
            }
        }

        return structure;
    }
};

},{"../utils/list":230}],145:[function(require,module,exports){
function getTrace(node) {
    function shouldPutToTrace(syntax) {
        if (syntax === null) {
            return false;
        }

        return (
            syntax.type === 'Type' ||
            syntax.type === 'Property' ||
            syntax.type === 'Keyword'
        );
    }

    function hasMatch(matchNode) {
        if (Array.isArray(matchNode.match)) {
            // use for-loop for better perfomance
            for (var i = 0; i < matchNode.match.length; i++) {
                if (hasMatch(matchNode.match[i])) {
                    if (shouldPutToTrace(matchNode.syntax)) {
                        result.unshift(matchNode.syntax);
                    }

                    return true;
                }
            }
        } else if (matchNode.node === node) {
            result = shouldPutToTrace(matchNode.syntax)
                ? [matchNode.syntax]
                : [];

            return true;
        }

        return false;
    }

    var result = null;

    if (this.matched !== null) {
        hasMatch(this.matched);
    }

    return result;
}

function testNode(match, node, fn) {
    var trace = getTrace.call(match, node);

    if (trace === null) {
        return false;
    }

    return trace.some(fn);
}

function isType(node, type) {
    return testNode(this, node, function(matchNode) {
        return matchNode.type === 'Type' && matchNode.name === type;
    });
}

function isProperty(node, property) {
    return testNode(this, node, function(matchNode) {
        return matchNode.type === 'Property' && matchNode.name === property;
    });
}

function isKeyword(node) {
    return testNode(this, node, function(matchNode) {
        return matchNode.type === 'Keyword';
    });
}

module.exports = {
    getTrace: getTrace,
    isType: isType,
    isProperty: isProperty,
    isKeyword: isKeyword
};

},{}],146:[function(require,module,exports){
'use strict';

var Tokenizer = require('../tokenizer');
var List = require('../utils/list');
var sequence = require('./sequence');
var noop = function() {};

function createParseContext(name) {
    return function() {
        return this[name]();
    };
}

function processConfig(config) {
    var parserConfig = {
        context: {},
        scope: {},
        atrule: {},
        pseudo: {}
    };

    if (config.parseContext) {
        for (var name in config.parseContext) {
            switch (typeof config.parseContext[name]) {
                case 'function':
                    parserConfig.context[name] = config.parseContext[name];
                    break;

                case 'string':
                    parserConfig.context[name] = createParseContext(config.parseContext[name]);
                    break;
            }
        }
    }

    if (config.scope) {
        for (var name in config.scope) {
            parserConfig.scope[name] = config.scope[name];
        }
    }

    if (config.atrule) {
        for (var name in config.atrule) {
            var atrule = config.atrule[name];

            if (atrule.parse) {
                parserConfig.atrule[name] = atrule.parse;
            }
        }
    }

    if (config.pseudo) {
        for (var name in config.pseudo) {
            var pseudo = config.pseudo[name];

            if (pseudo.parse) {
                parserConfig.pseudo[name] = pseudo.parse;
            }
        }
    }

    if (config.node) {
        for (var name in config.node) {
            parserConfig[name] = config.node[name].parse;
        }
    }

    return parserConfig;
}

module.exports = function createParser(config) {
    var parser = {
        scanner: new Tokenizer(),
        filename: '<unknown>',
        needPositions: false,
        onParseError: noop,
        onParseErrorThrow: false,
        parseAtrulePrelude: true,
        parseRulePrelude: true,
        parseValue: true,
        parseCustomProperty: false,

        readSequence: sequence,

        createList: function() {
            return new List();
        },
        createSingleNodeList: function(node) {
            return new List().appendData(node);
        },
        getFirstListNode: function(list) {
            return list && list.first();
        },
        getLastListNode: function(list) {
            return list.last();
        },

        parseWithFallback: function(consumer, fallback) {
            var startToken = this.scanner.currentToken;

            try {
                return consumer.call(this);
            } catch (e) {
                if (this.onParseErrorThrow) {
                    throw e;
                }

                var fallbackNode = fallback.call(this, startToken);

                this.onParseErrorThrow = true;
                this.onParseError(e, fallbackNode);
                this.onParseErrorThrow = false;

                return fallbackNode;
            }
        },

        getLocation: function(start, end) {
            if (this.needPositions) {
                return this.scanner.getLocationRange(
                    start,
                    end,
                    this.filename
                );
            }

            return null;
        },
        getLocationFromList: function(list) {
            if (this.needPositions) {
                var head = this.getFirstListNode(list);
                var tail = this.getLastListNode(list);
                return this.scanner.getLocationRange(
                    head !== null ? head.loc.start.offset - this.scanner.startOffset : this.scanner.tokenStart,
                    tail !== null ? tail.loc.end.offset - this.scanner.startOffset : this.scanner.tokenStart,
                    this.filename
                );
            }

            return null;
        }
    };

    config = processConfig(config || {});
    for (var key in config) {
        parser[key] = config[key];
    }

    return function(source, options) {
        options = options || {};

        var context = options.context || 'default';
        var ast;

        parser.scanner.setSource(source, options.offset, options.line, options.column);
        parser.filename = options.filename || '<unknown>';
        parser.needPositions = Boolean(options.positions);
        parser.onParseError = typeof options.onParseError === 'function' ? options.onParseError : noop;
        parser.onParseErrorThrow = false;
        parser.parseAtrulePrelude = 'parseAtrulePrelude' in options ? Boolean(options.parseAtrulePrelude) : true;
        parser.parseRulePrelude = 'parseRulePrelude' in options ? Boolean(options.parseRulePrelude) : true;
        parser.parseValue = 'parseValue' in options ? Boolean(options.parseValue) : true;
        parser.parseCustomProperty = 'parseCustomProperty' in options ? Boolean(options.parseCustomProperty) : false;

        if (!parser.context.hasOwnProperty(context)) {
            throw new Error('Unknown context `' + context + '`');
        }

        ast = parser.context[context].call(parser, options);

        if (!parser.scanner.eof) {
            parser.scanner.error();
        }

        return ast;
    };
};

},{"../tokenizer":226,"../utils/list":230,"./sequence":147}],147:[function(require,module,exports){
var TYPE = require('../tokenizer').TYPE;
var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;

module.exports = function readSequence(recognizer) {
    var children = this.createList();
    var child = null;
    var context = {
        recognizer: recognizer,
        space: null,
        ignoreWS: false,
        ignoreWSAfter: false
    };

    this.scanner.skipSC();

    while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
            case COMMENT:
                this.scanner.next();
                continue;

            case WHITESPACE:
                if (context.ignoreWS) {
                    this.scanner.next();
                } else {
                    context.space = this.WhiteSpace();
                }
                continue;
        }

        child = recognizer.getNode.call(this, context);

        if (child === undefined) {
            break;
        }

        if (context.space !== null) {
            children.push(context.space);
            context.space = null;
        }

        children.push(child);

        if (context.ignoreWSAfter) {
            context.ignoreWSAfter = false;
            context.ignoreWS = true;
        } else {
            context.ignoreWS = false;
        }
    }

    return children;
};

},{"../tokenizer":226}],148:[function(require,module,exports){
module.exports = {
    parse: {
        prelude: null,
        block: function() {
            return this.Block(true);
        }
    }
};

},{}],149:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var STRING = TYPE.String;
var IDENTIFIER = TYPE.Identifier;
var URL = TYPE.Url;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;

module.exports = {
    parse: {
        prelude: function() {
            var children = this.createList();

            this.scanner.skipSC();

            switch (this.scanner.tokenType) {
                case STRING:
                    children.push(this.String());
                    break;

                case URL:
                    children.push(this.Url());
                    break;

                default:
                    this.scanner.error('String or url() is expected');
            }

            if (this.scanner.lookupNonWSType(0) === IDENTIFIER ||
                this.scanner.lookupNonWSType(0) === LEFTPARENTHESIS) {
                children.push(this.WhiteSpace());
                children.push(this.MediaQueryList());
            }

            return children;
        },
        block: null
    }
};

},{"../../tokenizer":226}],150:[function(require,module,exports){
module.exports = {
    'font-face': require('./font-face'),
    'import': require('./import'),
    'media': require('./media'),
    'page': require('./page'),
    'supports': require('./supports')
};

},{"./font-face":148,"./import":149,"./media":151,"./page":152,"./supports":153}],151:[function(require,module,exports){
module.exports = {
    parse: {
        prelude: function() {
            return this.createSingleNodeList(
                this.MediaQueryList()
            );
        },
        block: function() {
            return this.Block(false);
        }
    }
};

},{}],152:[function(require,module,exports){
module.exports = {
    parse: {
        prelude: function() {
            return this.createSingleNodeList(
                this.SelectorList()
            );
        },
        block: function() {
            return this.Block(true);
        }
    }
};

},{}],153:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var IDENTIFIER = TYPE.Identifier;
var FUNCTION = TYPE.Function;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var HYPHENMINUS = TYPE.HyphenMinus;
var COLON = TYPE.Colon;

function consumeRaw() {
    return this.createSingleNodeList(
        this.Raw(this.scanner.currentToken, 0, 0, false, false)
    );
}

function parentheses() {
    var index = 0;

    this.scanner.skipSC();

    // TODO: make it simplier
    if (this.scanner.tokenType === IDENTIFIER) {
        index = 1;
    } else if (this.scanner.tokenType === HYPHENMINUS &&
               this.scanner.lookupType(1) === IDENTIFIER) {
        index = 2;
    }

    if (index !== 0 && this.scanner.lookupNonWSType(index) === COLON) {
        return this.createSingleNodeList(
            this.Declaration()
        );
    }

    return readSequence.call(this);
}

function readSequence() {
    var children = this.createList();
    var space = null;
    var child;

    this.scanner.skipSC();

    scan:
    while (!this.scanner.eof) {
        switch (this.scanner.tokenType) {
            case WHITESPACE:
                space = this.WhiteSpace();
                continue;

            case COMMENT:
                this.scanner.next();
                continue;

            case FUNCTION:
                child = this.Function(consumeRaw, this.scope.AtrulePrelude);
                break;

            case IDENTIFIER:
                child = this.Identifier();
                break;

            case LEFTPARENTHESIS:
                child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
                break;

            default:
                break scan;
        }

        if (space !== null) {
            children.push(space);
            space = null;
        }

        children.push(child);
    }

    return children;
}

module.exports = {
    parse: {
        prelude: function() {
            var children = readSequence.call(this);

            if (this.getFirstListNode(children) === null) {
                this.scanner.error('Condition is expected');
            }

            return children;
        },
        block: function() {
            return this.Block(false);
        }
    }
};

},{"../../tokenizer":226}],154:[function(require,module,exports){
var data = require('../../../data');

module.exports = {
    generic: true,
    types: data.types,
    properties: data.properties,
    node: require('../node')
};

},{"../../../data":126,"../node":203}],155:[function(require,module,exports){
var hasOwnProperty = Object.prototype.hasOwnProperty;
var shape = {
    generic: true,
    types: {},
    properties: {},
    parseContext: {},
    scope: {},
    atrule: ['parse'],
    pseudo: ['parse'],
    node: ['name', 'structure', 'parse', 'generate', 'walkContext']
};

function isObject(value) {
    return value && value.constructor === Object;
}

function copy(value) {
    if (isObject(value)) {
        var res = {};
        for (var key in value) {
            if (hasOwnProperty.call(value, key)) {
                res[key] = value[key];
            }
        }
        return res;
    } else {
        return value;
    }
}

function extend(dest, src) {
    for (var key in src) {
        if (hasOwnProperty.call(src, key)) {
            if (isObject(dest[key])) {
                extend(dest[key], copy(src[key]));
            } else {
                dest[key] = copy(src[key]);
            }
        }
    }
}

function mix(dest, src, shape) {
    for (var key in shape) {
        if (hasOwnProperty.call(shape, key) === false) {
            continue;
        }

        if (shape[key] === true) {
            if (key in src) {
                if (hasOwnProperty.call(src, key)) {
                    dest[key] = copy(src[key]);
                }
            }
        } else if (shape[key]) {
            if (isObject(shape[key])) {
                var res = {};
                extend(res, dest[key]);
                extend(res, src[key]);
                dest[key] = res;
            } else if (Array.isArray(shape[key])) {
                var res = {};
                var innerShape = shape[key].reduce(function(s, k) {
                    s[k] = true;
                    return s;
                }, {});
                for (var name in dest[key]) {
                    if (hasOwnProperty.call(dest[key], name)) {
                        res[name] = {};
                        if (dest[key] && dest[key][name]) {
                            mix(res[name], dest[key][name], innerShape);
                        }
                    }
                }
                for (var name in src[key]) {
                    if (hasOwnProperty.call(src[key], name)) {
                        if (!res[name]) {
                            res[name] = {};
                        }
                        if (src[key] && src[key][name]) {
                            mix(res[name], src[key][name], innerShape);
                        }
                    }
                }
                dest[key] = res;
            }
        }
    }
    return dest;
}

module.exports = function(dest, src) {
    return mix(dest, src, shape);
};

},{}],156:[function(require,module,exports){
module.exports = {
    parseContext: {
        default: 'StyleSheet',
        stylesheet: 'StyleSheet',
        atrule: 'Atrule',
        atrulePrelude: function(options) {
            return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
        },
        mediaQueryList: 'MediaQueryList',
        mediaQuery: 'MediaQuery',
        rule: 'Rule',
        selectorList: 'SelectorList',
        selector: 'Selector',
        block: function() {
            return this.Block(true);
        },
        declarationList: 'DeclarationList',
        declaration: 'Declaration',
        value: 'Value'
    },
    scope: require('../scope'),
    atrule: require('../atrule'),
    pseudo: require('../pseudo'),
    node: require('../node')
};

},{"../atrule":150,"../node":203,"../pseudo":209,"../scope":220}],157:[function(require,module,exports){
module.exports = {
    node: require('../node')
};

},{"../node":203}],158:[function(require,module,exports){
var List = require('../utils/list');
var Tokenizer = require('../tokenizer');
var Lexer = require('../lexer/Lexer');
var grammar = require('../lexer/grammar');
var createParser = require('../parser/create');
var createGenerator = require('../generator/create');
var createConvertor = require('../convertor/create');
var createWalker = require('../walker/create');
var clone = require('../utils/clone');
var names = require('../utils/names');
var mix = require('./config/mix');

function assign(dest, src) {
    for (var key in src) {
        dest[key] = src[key];
    }

    return dest;
}

function createSyntax(config) {
    var parse = createParser(config);
    var walk = createWalker(config);
    var generate = createGenerator(config);
    var convert = createConvertor(walk);

    var syntax = {
        List: List,
        Tokenizer: Tokenizer,
        Lexer: Lexer,

        vendorPrefix: names.vendorPrefix,
        keyword: names.keyword,
        property: names.property,
        isCustomProperty: names.isCustomProperty,

        grammar: grammar,
        lexer: null,
        createLexer: function(config) {
            return new Lexer(config, syntax, syntax.lexer.structure);
        },

        parse: parse,
        walk: walk,
        generate: generate,

        clone: clone,
        fromPlainObject: convert.fromPlainObject,
        toPlainObject: convert.toPlainObject,

        createSyntax: function(config) {
            return createSyntax(mix({}, config));
        },
        fork: function(extension) {
            var base = mix({}, config); // copy of config
            return createSyntax(
                typeof extension === 'function'
                    ? extension(base, assign)
                    : mix(base, extension)
            );
        }
    };

    syntax.lexer = new Lexer({
        generic: true,
        types: config.types,
        properties: config.properties,
        node: config.node
    }, syntax);

    return syntax;
};

exports.create = function(config) {
    return createSyntax(mix({}, config));
};

},{"../convertor/create":127,"../generator/create":128,"../lexer/Lexer":131,"../lexer/grammar":137,"../parser/create":146,"../tokenizer":226,"../utils/clone":228,"../utils/list":230,"../utils/names":231,"../walker/create":232,"./config/mix":155}],159:[function(require,module,exports){
// https://drafts.csswg.org/css-images-4/#element-notation
// https://developer.mozilla.org/en-US/docs/Web/CSS/element
module.exports = function() {
    this.scanner.skipSC();

    var children = this.createSingleNodeList(
        this.IdSelector()
    );

    this.scanner.skipSC();

    return children;
};

},{}],160:[function(require,module,exports){
// legacy IE function
// expression '(' raw ')'
module.exports = function() {
    return this.createSingleNodeList(
        this.Raw(this.scanner.currentToken, 0, 0, false, false)
    );
};

},{}],161:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var COMMA = TYPE.Comma;
var SEMICOLON = TYPE.Semicolon;
var HYPHENMINUS = TYPE.HyphenMinus;
var EXCLAMATIONMARK = TYPE.ExclamationMark;

// var '(' ident (',' <value>? )? ')'
module.exports = function() {
    var children = this.createList();

    this.scanner.skipSC();

    var identStart = this.scanner.tokenStart;

    this.scanner.eat(HYPHENMINUS);
    if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== HYPHENMINUS) {
        this.scanner.error('HyphenMinus is expected');
    }
    this.scanner.eat(IDENTIFIER);

    children.push({
        type: 'Identifier',
        loc: this.getLocation(identStart, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(identStart)
    });

    this.scanner.skipSC();

    if (this.scanner.tokenType === COMMA) {
        children.push(this.Operator());
        children.push(this.parseCustomProperty
            ? this.Value(null)
            : this.Raw(this.scanner.currentToken, EXCLAMATIONMARK, SEMICOLON, false, false)
        );
    }

    return children;
};

},{"../../tokenizer":226}],162:[function(require,module,exports){
function merge() {
    var dest = {};

    for (var i = 0; i < arguments.length; i++) {
        var src = arguments[i];
        for (var key in src) {
            dest[key] = src[key];
        }
    }

    return dest;
}

module.exports = require('./create').create(
    merge(
        require('./config/lexer'),
        require('./config/parser'),
        require('./config/walker')
    )
);

},{"./config/lexer":154,"./config/parser":156,"./config/walker":157,"./create":158}],163:[function(require,module,exports){
var cmpChar = require('../../tokenizer').cmpChar;
var isNumber = require('../../tokenizer').isNumber;
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var NUMBER = TYPE.Number;
var PLUSSIGN = TYPE.PlusSign;
var HYPHENMINUS = TYPE.HyphenMinus;
var N = 110; // 'n'.charCodeAt(0)
var DISALLOW_SIGN = true;
var ALLOW_SIGN = false;

function checkTokenIsInteger(scanner, disallowSign) {
    var pos = scanner.tokenStart;

    if (scanner.source.charCodeAt(pos) === PLUSSIGN ||
        scanner.source.charCodeAt(pos) === HYPHENMINUS) {
        if (disallowSign) {
            scanner.error();
        }
        pos++;
    }

    for (; pos < scanner.tokenEnd; pos++) {
        if (!isNumber(scanner.source.charCodeAt(pos))) {
            scanner.error('Unexpected input', pos);
        }
    }
}

// An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb
module.exports = {
    name: 'AnPlusB',
    structure: {
        a: [String, null],
        b: [String, null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var end = start;
        var prefix = '';
        var a = null;
        var b = null;

        if (this.scanner.tokenType === NUMBER ||
            this.scanner.tokenType === PLUSSIGN) {
            checkTokenIsInteger(this.scanner, ALLOW_SIGN);
            prefix = this.scanner.getTokenValue();
            this.scanner.next();
            end = this.scanner.tokenStart;
        }

        if (this.scanner.tokenType === IDENTIFIER) {
            var bStart = this.scanner.tokenStart;

            if (cmpChar(this.scanner.source, bStart, HYPHENMINUS)) {
                if (prefix === '') {
                    prefix = '-';
                    bStart++;
                } else {
                    this.scanner.error('Unexpected hyphen minus');
                }
            }

            if (!cmpChar(this.scanner.source, bStart, N)) {
                this.scanner.error();
            }

            a = prefix === ''  ? '1'  :
                prefix === '+' ? '+1' :
                prefix === '-' ? '-1' :
                prefix;

            var len = this.scanner.tokenEnd - bStart;
            if (len > 1) {
                // ..n-..
                if (this.scanner.source.charCodeAt(bStart + 1) !== HYPHENMINUS) {
                    this.scanner.error('Unexpected input', bStart + 1);
                }

                if (len > 2) {
                    // ..n-{number}..
                    this.scanner.tokenStart = bStart + 2;
                } else {
                    // ..n- {number}
                    this.scanner.next();
                    this.scanner.skipSC();
                }

                checkTokenIsInteger(this.scanner, DISALLOW_SIGN);
                b = '-' + this.scanner.getTokenValue();
                this.scanner.next();
                end = this.scanner.tokenStart;
            } else {
                prefix = '';
                this.scanner.next();
                end = this.scanner.tokenStart;
                this.scanner.skipSC();

                if (this.scanner.tokenType === HYPHENMINUS ||
                    this.scanner.tokenType === PLUSSIGN) {
                    prefix = this.scanner.getTokenValue();
                    this.scanner.next();
                    this.scanner.skipSC();
                }

                if (this.scanner.tokenType === NUMBER) {
                    checkTokenIsInteger(this.scanner, prefix !== '');

                    if (!isNumber(this.scanner.source.charCodeAt(this.scanner.tokenStart))) {
                        prefix = this.scanner.source.charAt(this.scanner.tokenStart);
                        this.scanner.tokenStart++;
                    }

                    if (prefix === '') {
                        // should be an operator before number
                        this.scanner.error();
                    } else if (prefix === '+') {
                        // plus is using by default
                        prefix = '';
                    }

                    b = prefix + this.scanner.getTokenValue();

                    this.scanner.next();
                    end = this.scanner.tokenStart;
                } else {
                    if (prefix) {
                        this.scanner.eat(NUMBER);
                    }
                }
            }
        } else {
            if (prefix === '' || prefix === '+') { // no number
                this.scanner.error(
                    'Number or identifier is expected',
                    this.scanner.tokenStart + (
                        this.scanner.tokenType === PLUSSIGN ||
                        this.scanner.tokenType === HYPHENMINUS
                    )
                );
            }

            b = prefix;
        }

        return {
            type: 'AnPlusB',
            loc: this.getLocation(start, end),
            a: a,
            b: b
        };
    },
    generate: function(node) {
        var a = node.a !== null && node.a !== undefined;
        var b = node.b !== null && node.b !== undefined;

        if (a) {
            this.chunk(
                node.a === '+1' ? '+n' :
                node.a ===  '1' ?  'n' :
                node.a === '-1' ? '-n' :
                node.a + 'n'
            );

            if (b) {
                b = String(node.b);
                if (b.charAt(0) === '-' || b.charAt(0) === '+') {
                    this.chunk(b.charAt(0));
                    this.chunk(b.substr(1));
                } else {
                    this.chunk('+');
                    this.chunk(b);
                }
            }
        } else {
            this.chunk(String(node.b));
        }
    }
};

},{"../../tokenizer":226}],164:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var ATKEYWORD = TYPE.AtKeyword;
var SEMICOLON = TYPE.Semicolon;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;

function consumeRaw(startToken) {
    return this.Raw(startToken, SEMICOLON, LEFTCURLYBRACKET, false, true);
}

function isDeclarationBlockAtrule() {
    for (var offset = 1, type; type = this.scanner.lookupType(offset); offset++) {
        if (type === RIGHTCURLYBRACKET) {
            return true;
        }

        if (type === LEFTCURLYBRACKET ||
            type === ATKEYWORD) {
            return false;
        }
    }

    return false;
}

module.exports = {
    name: 'Atrule',
    structure: {
        name: String,
        prelude: ['AtrulePrelude', 'Raw', null],
        block: ['Block', null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var nameLowerCase;
        var prelude = null;
        var block = null;

        this.scanner.eat(ATKEYWORD);

        name = this.scanner.substrToCursor(start + 1);
        nameLowerCase = name.toLowerCase();
        this.scanner.skipSC();

        // parse prelude
        if (this.scanner.eof === false &&
            this.scanner.tokenType !== LEFTCURLYBRACKET &&
            this.scanner.tokenType !== SEMICOLON) {
            if (this.parseAtrulePrelude) {
                prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw);

                // turn empty AtrulePrelude into null
                if (prelude.type === 'AtrulePrelude' && prelude.children.head === null) {
                    prelude = null;
                }
            } else {
                prelude = consumeRaw.call(this, this.scanner.currentToken);
            }

            this.scanner.skipSC();
        }

        switch (this.scanner.tokenType) {
            case SEMICOLON:
                this.scanner.next();
                break;

            case LEFTCURLYBRACKET:
                if (this.atrule.hasOwnProperty(nameLowerCase) &&
                    typeof this.atrule[nameLowerCase].block === 'function') {
                    block = this.atrule[nameLowerCase].block.call(this);
                } else {
                    // TODO: should consume block content as Raw?
                    block = this.Block(isDeclarationBlockAtrule.call(this));
                }

                break;
        }

        return {
            type: 'Atrule',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            prelude: prelude,
            block: block
        };
    },
    generate: function(node) {
        this.chunk('@');
        this.chunk(node.name);

        if (node.prelude !== null) {
            this.chunk(' ');
            this.node(node.prelude);
        }

        if (node.block) {
            this.node(node.block);
        } else {
            this.chunk(';');
        }
    },
    walkContext: 'atrule'
};

},{"../../tokenizer":226}],165:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var SEMICOLON = TYPE.Semicolon;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;

module.exports = {
    name: 'AtrulePrelude',
    structure: {
        children: [[]]
    },
    parse: function(name) {
        var children = null;

        if (name !== null) {
            name = name.toLowerCase();
        }

        this.scanner.skipSC();

        if (this.atrule.hasOwnProperty(name) &&
            typeof this.atrule[name].prelude === 'function') {
            // custom consumer
            children = this.atrule[name].prelude.call(this);
        } else {
            // default consumer
            children = this.readSequence(this.scope.AtrulePrelude);
        }

        this.scanner.skipSC();

        if (this.scanner.eof !== true &&
            this.scanner.tokenType !== LEFTCURLYBRACKET &&
            this.scanner.tokenType !== SEMICOLON) {
            this.scanner.error('Semicolon or block is expected');
        }

        if (children === null) {
            children = this.createList();
        }

        return {
            type: 'AtrulePrelude',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    },
    walkContext: 'atrulePrelude'
};

},{"../../tokenizer":226}],166:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var STRING = TYPE.String;
var DOLLARSIGN = TYPE.DollarSign;
var ASTERISK = TYPE.Asterisk;
var COLON = TYPE.Colon;
var EQUALSSIGN = TYPE.EqualsSign;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;
var CIRCUMFLEXACCENT = TYPE.CircumflexAccent;
var VERTICALLINE = TYPE.VerticalLine;
var TILDE = TYPE.Tilde;

function getAttributeName() {
    if (this.scanner.eof) {
        this.scanner.error('Unexpected end of input');
    }

    var start = this.scanner.tokenStart;
    var expectIdentifier = false;
    var checkColon = true;

    if (this.scanner.tokenType === ASTERISK) {
        expectIdentifier = true;
        checkColon = false;
        this.scanner.next();
    } else if (this.scanner.tokenType !== VERTICALLINE) {
        this.scanner.eat(IDENTIFIER);
    }

    if (this.scanner.tokenType === VERTICALLINE) {
        if (this.scanner.lookupType(1) !== EQUALSSIGN) {
            this.scanner.next();
            this.scanner.eat(IDENTIFIER);
        } else if (expectIdentifier) {
            this.scanner.error('Identifier is expected', this.scanner.tokenEnd);
        }
    } else if (expectIdentifier) {
        this.scanner.error('Vertical line is expected');
    }

    if (checkColon && this.scanner.tokenType === COLON) {
        this.scanner.next();
        this.scanner.eat(IDENTIFIER);
    }

    return {
        type: 'Identifier',
        loc: this.getLocation(start, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(start)
    };
}

function getOperator() {
    var start = this.scanner.tokenStart;
    var tokenType = this.scanner.tokenType;

    if (tokenType !== EQUALSSIGN &&        // =
        tokenType !== TILDE &&             // ~=
        tokenType !== CIRCUMFLEXACCENT &&  // ^=
        tokenType !== DOLLARSIGN &&        // $=
        tokenType !== ASTERISK &&          // *=
        tokenType !== VERTICALLINE         // |=
    ) {
        this.scanner.error('Attribute selector (=, ~=, ^=, $=, *=, |=) is expected');
    }

    if (tokenType === EQUALSSIGN) {
        this.scanner.next();
    } else {
        this.scanner.next();
        this.scanner.eat(EQUALSSIGN);
    }

    return this.scanner.substrToCursor(start);
}

// '[' S* attrib_name ']'
// '[' S* attrib_name S* attrib_matcher S* [ IDENT | STRING ] S* attrib_flags? S* ']'
module.exports = {
    name: 'AttributeSelector',
    structure: {
        name: 'Identifier',
        matcher: [String, null],
        value: ['String', 'Identifier', null],
        flags: [String, null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var matcher = null;
        var value = null;
        var flags = null;

        this.scanner.eat(LEFTSQUAREBRACKET);
        this.scanner.skipSC();

        name = getAttributeName.call(this);
        this.scanner.skipSC();

        if (this.scanner.tokenType !== RIGHTSQUAREBRACKET) {
            // avoid case `[name i]`
            if (this.scanner.tokenType !== IDENTIFIER) {
                matcher = getOperator.call(this);

                this.scanner.skipSC();

                value = this.scanner.tokenType === STRING
                    ? this.String()
                    : this.Identifier();

                this.scanner.skipSC();
            }

            // attribute flags
            if (this.scanner.tokenType === IDENTIFIER) {
                flags = this.scanner.getTokenValue();
                this.scanner.next();

                this.scanner.skipSC();
            }
        }

        this.scanner.eat(RIGHTSQUAREBRACKET);

        return {
            type: 'AttributeSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            matcher: matcher,
            value: value,
            flags: flags
        };
    },
    generate: function(node) {
        var flagsPrefix = ' ';

        this.chunk('[');
        this.node(node.name);

        if (node.matcher !== null) {
            this.chunk(node.matcher);

            if (node.value !== null) {
                this.node(node.value);

                // space between string and flags is not required
                if (node.value.type === 'String') {
                    flagsPrefix = '';
                }
            }
        }

        if (node.flags !== null) {
            this.chunk(flagsPrefix);
            this.chunk(node.flags);
        }

        this.chunk(']');
    }
};

},{"../../tokenizer":226}],167:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var SEMICOLON = TYPE.Semicolon;
var ATKEYWORD = TYPE.AtKeyword;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;

function consumeRaw(startToken) {
    return this.Raw(startToken, 0, 0, false, true);
}
function consumeRule() {
    return this.parseWithFallback(this.Rule, consumeRaw);
}
function consumeRawDeclaration(startToken) {
    return this.Raw(startToken, 0, SEMICOLON, true, true);
}
function consumeDeclaration() {
    if (this.scanner.tokenType === SEMICOLON) {
        return consumeRawDeclaration.call(this, this.scanner.currentToken);
    }

    var node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);

    if (this.scanner.tokenType === SEMICOLON) {
        this.scanner.next();
    }

    return node;
}

module.exports = {
    name: 'Block',
    structure: {
        children: [[
            'Atrule',
            'Rule',
            'Declaration'
        ]]
    },
    parse: function(isDeclaration) {
        var consumer = isDeclaration ? consumeDeclaration : consumeRule;

        var start = this.scanner.tokenStart;
        var children = this.createList();

        this.scanner.eat(LEFTCURLYBRACKET);

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case RIGHTCURLYBRACKET:
                    break scan;

                case WHITESPACE:
                case COMMENT:
                    this.scanner.next();
                    break;

                case ATKEYWORD:
                    children.push(this.parseWithFallback(this.Atrule, consumeRaw));
                    break;

                default:
                    children.push(consumer.call(this));
            }
        }

        if (!this.scanner.eof) {
            this.scanner.eat(RIGHTCURLYBRACKET);
        }

        return {
            type: 'Block',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.chunk('{');
        this.children(node, function(prev) {
            if (prev.type === 'Declaration') {
                this.chunk(';');
            }
        });
        this.chunk('}');
    },
    walkContext: 'block'
};

},{"../../tokenizer":226}],168:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;

module.exports = {
    name: 'Brackets',
    structure: {
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;

        this.scanner.eat(LEFTSQUAREBRACKET);

        children = readSequence.call(this, recognizer);

        if (!this.scanner.eof) {
            this.scanner.eat(RIGHTSQUAREBRACKET);
        }

        return {
            type: 'Brackets',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.chunk('[');
        this.children(node);
        this.chunk(']');
    }
};

},{"../../tokenizer":226}],169:[function(require,module,exports){
var CDC = require('../../tokenizer').TYPE.CDC;

module.exports = {
    name: 'CDC',
    structure: [],
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.eat(CDC); // -->

        return {
            type: 'CDC',
            loc: this.getLocation(start, this.scanner.tokenStart)
        };
    },
    generate: function() {
        this.chunk('-->');
    }
};

},{"../../tokenizer":226}],170:[function(require,module,exports){
var CDO = require('../../tokenizer').TYPE.CDO;

module.exports = {
    name: 'CDO',
    structure: [],
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.eat(CDO); // <!--

        return {
            type: 'CDO',
            loc: this.getLocation(start, this.scanner.tokenStart)
        };
    },
    generate: function() {
        this.chunk('<!--');
    }
};

},{"../../tokenizer":226}],171:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;
var IDENTIFIER = TYPE.Identifier;
var FULLSTOP = TYPE.FullStop;

// '.' ident
module.exports = {
    name: 'ClassSelector',
    structure: {
        name: String
    },
    parse: function() {
        this.scanner.eat(FULLSTOP);

        return {
            type: 'ClassSelector',
            loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
            name: this.scanner.consume(IDENTIFIER)
        };
    },
    generate: function(node) {
        this.chunk('.');
        this.chunk(node.name);
    }
};

},{"../../tokenizer":226}],172:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var PLUSSIGN = TYPE.PlusSign;
var SOLIDUS = TYPE.Solidus;
var GREATERTHANSIGN = TYPE.GreaterThanSign;
var TILDE = TYPE.Tilde;

// + | > | ~ | /deep/
module.exports = {
    name: 'Combinator',
    structure: {
        name: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        switch (this.scanner.tokenType) {
            case GREATERTHANSIGN:
            case PLUSSIGN:
            case TILDE:
                this.scanner.next();
                break;

            case SOLIDUS:
                this.scanner.next();
                this.scanner.expectIdentifier('deep');
                this.scanner.eat(SOLIDUS);
                break;

            default:
                this.scanner.error('Combinator is expected');
        }

        return {
            type: 'Combinator',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};

},{"../../tokenizer":226}],173:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var ASTERISK = TYPE.Asterisk;
var SOLIDUS = TYPE.Solidus;

// '/*' .* '*/'
module.exports = {
    name: 'Comment',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var end = this.scanner.tokenEnd;

        if ((end - start + 2) >= 2 &&
            this.scanner.source.charCodeAt(end - 2) === ASTERISK &&
            this.scanner.source.charCodeAt(end - 1) === SOLIDUS) {
            end -= 2;
        }

        this.scanner.next();

        return {
            type: 'Comment',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.source.substring(start + 2, end)
        };
    },
    generate: function(node) {
        this.chunk('/*');
        this.chunk(node.value);
        this.chunk('*/');
    }
};

},{"../../tokenizer":226}],174:[function(require,module,exports){
var isCustomProperty = require('../../utils/names').isCustomProperty;
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var COLON = TYPE.Colon;
var EXCLAMATIONMARK = TYPE.ExclamationMark;
var SOLIDUS = TYPE.Solidus;
var ASTERISK = TYPE.Asterisk;
var DOLLARSIGN = TYPE.DollarSign;
var HYPHENMINUS = TYPE.HyphenMinus;
var SEMICOLON = TYPE.Semicolon;
var PLUSSIGN = TYPE.PlusSign;
var NUMBERSIGN = TYPE.NumberSign;

function consumeValueRaw(startToken) {
    return this.Raw(startToken, EXCLAMATIONMARK, SEMICOLON, false, true);
}

function consumeCustomPropertyRaw(startToken) {
    return this.Raw(startToken, EXCLAMATIONMARK, SEMICOLON, false, false);
}

function consumeValue() {
    var startValueToken = this.scanner.currentToken;
    var value = this.Value();

    if (value.type !== 'Raw' &&
        this.scanner.eof === false &&
        this.scanner.tokenType !== SEMICOLON &&
        this.scanner.tokenType !== EXCLAMATIONMARK &&
        this.scanner.isBalanceEdge(startValueToken) === false) {
        this.scanner.error();
    }

    return value;
}

module.exports = {
    name: 'Declaration',
    structure: {
        important: [Boolean, String],
        property: String,
        value: ['Value', 'Raw']
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var startToken = this.scanner.currentToken;
        var property = readProperty.call(this);
        var customProperty = isCustomProperty(property);
        var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
        var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
        var important = false;
        var value;

        this.scanner.skipSC();
        this.scanner.eat(COLON);

        if (!customProperty) {
            this.scanner.skipSC();
        }

        if (parseValue) {
            value = this.parseWithFallback(consumeValue, consumeRaw);
        } else {
            value = consumeRaw.call(this, this.scanner.currentToken);
        }

        if (this.scanner.tokenType === EXCLAMATIONMARK) {
            important = getImportant(this.scanner);
            this.scanner.skipSC();
        }

        // Do not include semicolon to range per spec
        // https://drafts.csswg.org/css-syntax/#declaration-diagram

        if (this.scanner.eof === false &&
            this.scanner.tokenType !== SEMICOLON &&
            this.scanner.isBalanceEdge(startToken) === false) {
            this.scanner.error();
        }

        return {
            type: 'Declaration',
            loc: this.getLocation(start, this.scanner.tokenStart),
            important: important,
            property: property,
            value: value
        };
    },
    generate: function(node) {
        this.chunk(node.property);
        this.chunk(':');
        this.node(node.value);

        if (node.important) {
            this.chunk(node.important === true ? '!important' : '!' + node.important);
        }
    },
    walkContext: 'declaration'
};

function readProperty() {
    var start = this.scanner.tokenStart;
    var prefix = 0;

    // hacks
    switch (this.scanner.tokenType) {
        case ASTERISK:
        case DOLLARSIGN:
        case PLUSSIGN:
        case NUMBERSIGN:
            prefix = 1;
            break;

        // TODO: not sure we should support this hack
        case SOLIDUS:
            prefix = this.scanner.lookupType(1) === SOLIDUS ? 2 : 1;
            break;
    }

    if (this.scanner.lookupType(prefix) === HYPHENMINUS) {
        prefix++;
    }

    if (prefix) {
        this.scanner.skip(prefix);
    }

    this.scanner.eat(IDENTIFIER);

    return this.scanner.substrToCursor(start);
}

// ! ws* important
function getImportant(scanner) {
    scanner.eat(EXCLAMATIONMARK);
    scanner.skipSC();

    var important = scanner.consume(IDENTIFIER);

    // store original value in case it differ from `important`
    // for better original source restoring and hacks like `!ie` support
    return important === 'important' ? true : important;
}

},{"../../tokenizer":226,"../../utils/names":231}],175:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var SEMICOLON = TYPE.Semicolon;

function consumeRaw(startToken) {
    return this.Raw(startToken, 0, SEMICOLON, true, true);
}

module.exports = {
    name: 'DeclarationList',
    structure: {
        children: [[
            'Declaration'
        ]]
    },
    parse: function() {
        var children = this.createList();

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case WHITESPACE:
                case COMMENT:
                case SEMICOLON:
                    this.scanner.next();
                    break;

                default:
                    children.push(this.parseWithFallback(this.Declaration, consumeRaw));
            }
        }

        return {
            type: 'DeclarationList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node, function(prev) {
            if (prev.type === 'Declaration') {
                this.chunk(';');
            }
        });
    }
};

},{"../../tokenizer":226}],176:[function(require,module,exports){
var NUMBER = require('../../tokenizer').TYPE.Number;

// special reader for units to avoid adjoined IE hacks (i.e. '1px\9')
function readUnit(scanner) {
    var unit = scanner.getTokenValue();
    var backSlashPos = unit.indexOf('\\');

    if (backSlashPos > 0) {
        // patch token offset
        scanner.tokenStart += backSlashPos;

        // return part before backslash
        return unit.substring(0, backSlashPos);
    }

    // no backslash in unit name
    scanner.next();

    return unit;
}

// number ident
module.exports = {
    name: 'Dimension',
    structure: {
        value: String,
        unit: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var value = this.scanner.consume(NUMBER);
        var unit = readUnit(this.scanner);

        return {
            type: 'Dimension',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: value,
            unit: unit
        };
    },
    generate: function(node) {
        this.chunk(node.value);
        this.chunk(node.unit);
    }
};

},{"../../tokenizer":226}],177:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// <function-token> <sequence> ')'
module.exports = {
    name: 'Function',
    structure: {
        name: String,
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var name = this.scanner.consumeFunctionName();
        var nameLowerCase = name.toLowerCase();
        var children;

        children = recognizer.hasOwnProperty(nameLowerCase)
            ? recognizer[nameLowerCase].call(this, recognizer)
            : readSequence.call(this, recognizer);

        if (!this.scanner.eof) {
            this.scanner.eat(RIGHTPARENTHESIS);
        }

        return {
            type: 'Function',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
        };
    },
    generate: function(node) {
        this.chunk(node.name);
        this.chunk('(');
        this.children(node);
        this.chunk(')');
    },
    walkContext: 'function'
};

},{"../../tokenizer":226}],178:[function(require,module,exports){
var isHex = require('../../tokenizer').isHex;
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var NUMBER = TYPE.Number;
var NUMBERSIGN = TYPE.NumberSign;

function consumeHexSequence(scanner, required) {
    if (!isHex(scanner.source.charCodeAt(scanner.tokenStart))) {
        if (required) {
            scanner.error('Unexpected input', scanner.tokenStart);
        } else {
            return;
        }
    }

    for (var pos = scanner.tokenStart + 1; pos < scanner.tokenEnd; pos++) {
        var code = scanner.source.charCodeAt(pos);

        // break on non-hex char
        if (!isHex(code)) {
            // break token, exclude symbol
            scanner.tokenStart = pos;
            return;
        }
    }

    // token is full hex sequence, go to next token
    scanner.next();
}

// # ident
module.exports = {
    name: 'HexColor',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.eat(NUMBERSIGN);

        scan:
        switch (this.scanner.tokenType) {
            case NUMBER:
                consumeHexSequence(this.scanner, true);

                // if token is identifier then number consists of hex only,
                // try to add identifier to result
                if (this.scanner.tokenType === IDENTIFIER) {
                    consumeHexSequence(this.scanner, false);
                }

                break;

            case IDENTIFIER:
                consumeHexSequence(this.scanner, true);
                break;

            default:
                this.scanner.error('Number or identifier is expected');
        }

        return {
            type: 'HexColor',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start + 1) // skip #
        };
    },
    generate: function(node) {
        this.chunk('#');
        this.chunk(node.value);
    }
};

},{"../../tokenizer":226}],179:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;
var IDENTIFIER = TYPE.Identifier;
var NUMBERSIGN = TYPE.NumberSign;

// '#' ident
module.exports = {
    name: 'IdSelector',
    structure: {
        name: String
    },
    parse: function() {
        this.scanner.eat(NUMBERSIGN);

        return {
            type: 'IdSelector',
            loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
            name: this.scanner.consume(IDENTIFIER)
        };
    },
    generate: function(node) {
        this.chunk('#');
        this.chunk(node.name);
    }
};

},{"../../tokenizer":226}],180:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;
var IDENTIFIER = TYPE.Identifier;

module.exports = {
    name: 'Identifier',
    structure: {
        name: String
    },
    parse: function() {
        return {
            type: 'Identifier',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            name: this.scanner.consume(IDENTIFIER)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};

},{"../../tokenizer":226}],181:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var NUMBER = TYPE.Number;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;
var COLON = TYPE.Colon;
var SOLIDUS = TYPE.Solidus;

module.exports = {
    name: 'MediaFeature',
    structure: {
        name: String,
        value: ['Identifier', 'Number', 'Dimension', 'Ratio', null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var name;
        var value = null;

        this.scanner.eat(LEFTPARENTHESIS);
        this.scanner.skipSC();

        name = this.scanner.consume(IDENTIFIER);
        this.scanner.skipSC();

        if (this.scanner.tokenType !== RIGHTPARENTHESIS) {
            this.scanner.eat(COLON);
            this.scanner.skipSC();

            switch (this.scanner.tokenType) {
                case NUMBER:
                    if (this.scanner.lookupType(1) === IDENTIFIER) {
                        value = this.Dimension();
                    } else if (this.scanner.lookupNonWSType(1) === SOLIDUS) {
                        value = this.Ratio();
                    } else {
                        value = this.Number();
                    }

                    break;

                case IDENTIFIER:
                    value = this.Identifier();

                    break;

                default:
                    this.scanner.error('Number, dimension, ratio or identifier is expected');
            }

            this.scanner.skipSC();
        }

        this.scanner.eat(RIGHTPARENTHESIS);

        return {
            type: 'MediaFeature',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            value: value
        };
    },
    generate: function(node) {
        this.chunk('(');
        this.chunk(node.name);
        if (node.value !== null) {
            this.chunk(':');
            this.node(node.value);
        }
        this.chunk(')');
    }
};

},{"../../tokenizer":226}],182:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var IDENTIFIER = TYPE.Identifier;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;

module.exports = {
    name: 'MediaQuery',
    structure: {
        children: [[
            'Identifier',
            'MediaFeature',
            'WhiteSpace'
        ]]
    },
    parse: function() {
        this.scanner.skipSC();

        var children = this.createList();
        var child = null;
        var space = null;

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case COMMENT:
                    this.scanner.next();
                    continue;

                case WHITESPACE:
                    space = this.WhiteSpace();
                    continue;

                case IDENTIFIER:
                    child = this.Identifier();
                    break;

                case LEFTPARENTHESIS:
                    child = this.MediaFeature();
                    break;

                default:
                    break scan;
            }

            if (space !== null) {
                children.push(space);
                space = null;
            }

            children.push(child);
        }

        if (child === null) {
            this.scanner.error('Identifier or parenthesis is expected');
        }

        return {
            type: 'MediaQuery',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    }
};

},{"../../tokenizer":226}],183:[function(require,module,exports){
var COMMA = require('../../tokenizer').TYPE.Comma;

module.exports = {
    name: 'MediaQueryList',
    structure: {
        children: [[
            'MediaQuery'
        ]]
    },
    parse: function(relative) {
        var children = this.createList();

        this.scanner.skipSC();

        while (!this.scanner.eof) {
            children.push(this.MediaQuery(relative));

            if (this.scanner.tokenType !== COMMA) {
                break;
            }

            this.scanner.next();
        }

        return {
            type: 'MediaQueryList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node, function() {
            this.chunk(',');
        });
    }
};

},{"../../tokenizer":226}],184:[function(require,module,exports){
// https://drafts.csswg.org/css-syntax-3/#the-anb-type
module.exports = {
    name: 'Nth',
    structure: {
        nth: ['AnPlusB', 'Identifier'],
        selector: ['SelectorList', null]
    },
    parse: function(allowOfClause) {
        this.scanner.skipSC();

        var start = this.scanner.tokenStart;
        var end = start;
        var selector = null;
        var query;

        if (this.scanner.lookupValue(0, 'odd') || this.scanner.lookupValue(0, 'even')) {
            query = this.Identifier();
        } else {
            query = this.AnPlusB();
        }

        this.scanner.skipSC();

        if (allowOfClause && this.scanner.lookupValue(0, 'of')) {
            this.scanner.next();

            selector = this.SelectorList();

            if (this.needPositions) {
                end = this.getLastListNode(selector.children).loc.end.offset;
            }
        } else {
            if (this.needPositions) {
                end = query.loc.end.offset;
            }
        }

        return {
            type: 'Nth',
            loc: this.getLocation(start, end),
            nth: query,
            selector: selector
        };
    },
    generate: function(node) {
        this.node(node.nth);
        if (node.selector !== null) {
            this.chunk(' of ');
            this.node(node.selector);
        }
    }
};

},{}],185:[function(require,module,exports){
var NUMBER = require('../../tokenizer').TYPE.Number;

module.exports = {
    name: 'Number',
    structure: {
        value: String
    },
    parse: function() {
        return {
            type: 'Number',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.scanner.consume(NUMBER)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

},{"../../tokenizer":226}],186:[function(require,module,exports){
// '/' | '*' | ',' | ':' | '+' | '-'
module.exports = {
    name: 'Operator',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.next();

        return {
            type: 'Operator',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

},{}],187:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

module.exports = {
    name: 'Parentheses',
    structure: {
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;

        this.scanner.eat(LEFTPARENTHESIS);

        children = readSequence.call(this, recognizer);

        if (!this.scanner.eof) {
            this.scanner.eat(RIGHTPARENTHESIS);
        }

        return {
            type: 'Parentheses',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.chunk('(');
        this.children(node);
        this.chunk(')');
    }
};

},{"../../tokenizer":226}],188:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var NUMBER = TYPE.Number;
var PERCENTSIGN = TYPE.PercentSign;

module.exports = {
    name: 'Percentage',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var number = this.scanner.consume(NUMBER);

        this.scanner.eat(PERCENTSIGN);

        return {
            type: 'Percentage',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: number
        };
    },
    generate: function(node) {
        this.chunk(node.value);
        this.chunk('%');
    }
};

},{"../../tokenizer":226}],189:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var FUNCTION = TYPE.Function;
var COLON = TYPE.Colon;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// : ident [ '(' .. ')' ]?
module.exports = {
    name: 'PseudoClassSelector',
    structure: {
        name: String,
        children: [['Raw'], null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = null;
        var name;
        var nameLowerCase;

        this.scanner.eat(COLON);

        if (this.scanner.tokenType === FUNCTION) {
            name = this.scanner.consumeFunctionName();
            nameLowerCase = name.toLowerCase();

            if (this.pseudo.hasOwnProperty(nameLowerCase)) {
                this.scanner.skipSC();
                children = this.pseudo[nameLowerCase].call(this);
                this.scanner.skipSC();
            } else {
                children = this.createList();
                children.push(
                    this.Raw(this.scanner.currentToken, 0, 0, false, false)
                );
            }

            this.scanner.eat(RIGHTPARENTHESIS);
        } else {
            name = this.scanner.consume(IDENTIFIER);
        }

        return {
            type: 'PseudoClassSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
        };
    },
    generate: function(node) {
        this.chunk(':');
        this.chunk(node.name);

        if (node.children !== null) {
            this.chunk('(');
            this.children(node);
            this.chunk(')');
        }
    },
    walkContext: 'function'
};

},{"../../tokenizer":226}],190:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var FUNCTION = TYPE.Function;
var COLON = TYPE.Colon;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// :: ident [ '(' .. ')' ]?
module.exports = {
    name: 'PseudoElementSelector',
    structure: {
        name: String,
        children: [['Raw'], null]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = null;
        var name;
        var nameLowerCase;

        this.scanner.eat(COLON);
        this.scanner.eat(COLON);

        if (this.scanner.tokenType === FUNCTION) {
            name = this.scanner.consumeFunctionName();
            nameLowerCase = name.toLowerCase();

            if (this.pseudo.hasOwnProperty(nameLowerCase)) {
                this.scanner.skipSC();
                children = this.pseudo[nameLowerCase].call(this);
                this.scanner.skipSC();
            } else {
                children = this.createList();
                children.push(
                    this.Raw(this.scanner.currentToken, 0, 0, false, false)
                );
            }

            this.scanner.eat(RIGHTPARENTHESIS);
        } else {
            name = this.scanner.consume(IDENTIFIER);
        }

        return {
            type: 'PseudoElementSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: name,
            children: children
        };
    },
    generate: function(node) {
        this.chunk('::');
        this.chunk(node.name);

        if (node.children !== null) {
            this.chunk('(');
            this.children(node);
            this.chunk(')');
        }
    },
    walkContext: 'function'
};

},{"../../tokenizer":226}],191:[function(require,module,exports){
var isNumber = require('../../tokenizer').isNumber;
var TYPE = require('../../tokenizer').TYPE;
var NUMBER = TYPE.Number;
var SOLIDUS = TYPE.Solidus;
var FULLSTOP = TYPE.FullStop;

// Terms of <ratio> should to be a positive number (not zero or negative)
// (see https://drafts.csswg.org/mediaqueries-3/#values)
// However, -o-min-device-pixel-ratio takes fractional values as a ratio's term
// and this is using by various sites. Therefore we relax checking on parse
// to test a term is unsigned number without exponent part.
// Additional checks may to be applied on lexer validation.
function consumeNumber(scanner) {
    var value = scanner.consumeNonWS(NUMBER);

    for (var i = 0; i < value.length; i++) {
        var code = value.charCodeAt(i);
        if (!isNumber(code) && code !== FULLSTOP) {
            scanner.error('Unsigned number is expected', scanner.tokenStart - value.length + i);
        }
    }

    if (Number(value) === 0) {
        scanner.error('Zero number is not allowed', scanner.tokenStart - value.length);
    }

    return value;
}

// <positive-integer> S* '/' S* <positive-integer>
module.exports = {
    name: 'Ratio',
    structure: {
        left: String,
        right: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var left = consumeNumber(this.scanner);
        var right;

        this.scanner.eatNonWS(SOLIDUS);
        right = consumeNumber(this.scanner);

        return {
            type: 'Ratio',
            loc: this.getLocation(start, this.scanner.tokenStart),
            left: left,
            right: right
        };
    },
    generate: function(node) {
        this.chunk(node.left);
        this.chunk('/');
        this.chunk(node.right);
    }
};

},{"../../tokenizer":226}],192:[function(require,module,exports){
module.exports = {
    name: 'Raw',
    structure: {
        value: String
    },
    parse: function(startToken, endTokenType1, endTokenType2, includeTokenType2, excludeWhiteSpace) {
        var startOffset = this.scanner.getTokenStart(startToken);
        var endOffset;

        this.scanner.skip(
            this.scanner.getRawLength(
                startToken,
                endTokenType1,
                endTokenType2,
                includeTokenType2
            )
        );

        if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
            endOffset = this.scanner.getOffsetExcludeWS();
        } else {
            endOffset = this.scanner.tokenStart;
        }

        return {
            type: 'Raw',
            loc: this.getLocation(startOffset, endOffset),
            value: this.scanner.source.substring(startOffset, endOffset)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

},{}],193:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;

function consumeRaw(startToken) {
    return this.Raw(startToken, LEFTCURLYBRACKET, 0, false, true);
}

function consumePrelude() {
    var prelude = this.SelectorList();

    if (prelude.type !== 'Raw' &&
        this.scanner.eof === false &&
        this.scanner.tokenType !== LEFTCURLYBRACKET) {
        this.scanner.error();
    }

    return prelude;
}

module.exports = {
    name: 'Rule',
    structure: {
        prelude: ['SelectorList', 'Raw'],
        block: ['Block']
    },
    parse: function() {
        var startToken = this.scanner.currentToken;
        var startOffset = this.scanner.tokenStart;
        var prelude;
        var block;

        if (this.parseRulePrelude) {
            prelude = this.parseWithFallback(consumePrelude, consumeRaw);
        } else {
            prelude = consumeRaw.call(this, startToken);
        }

        block = this.Block(true);

        return {
            type: 'Rule',
            loc: this.getLocation(startOffset, this.scanner.tokenStart),
            prelude: prelude,
            block: block
        };
    },
    generate: function(node) {
        this.node(node.prelude);
        this.node(node.block);
    },
    walkContext: 'rule'
};

},{"../../tokenizer":226}],194:[function(require,module,exports){
module.exports = {
    name: 'Selector',
    structure: {
        children: [[
            'TypeSelector',
            'IdSelector',
            'ClassSelector',
            'AttributeSelector',
            'PseudoClassSelector',
            'PseudoElementSelector',
            'Combinator',
            'WhiteSpace'
        ]]
    },
    parse: function() {
        var children = this.readSequence(this.scope.Selector);

        // nothing were consumed
        if (this.getFirstListNode(children) === null) {
            this.scanner.error('Selector is expected');
        }

        return {
            type: 'Selector',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    }
};

},{}],195:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var COMMA = TYPE.Comma;

module.exports = {
    name: 'SelectorList',
    structure: {
        children: [[
            'Selector',
            'Raw'
        ]]
    },
    parse: function() {
        var children = this.createList();

        while (!this.scanner.eof) {
            children.push(this.Selector());

            if (this.scanner.tokenType === COMMA) {
                this.scanner.next();
                continue;
            }

            break;
        }

        return {
            type: 'SelectorList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        this.children(node, function() {
            this.chunk(',');
        });
    },
    walkContext: 'selector'
};

},{"../../tokenizer":226}],196:[function(require,module,exports){
var STRING = require('../../tokenizer').TYPE.String;

module.exports = {
    name: 'String',
    structure: {
        value: String
    },
    parse: function() {
        return {
            type: 'String',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.scanner.consume(STRING)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

},{"../../tokenizer":226}],197:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var WHITESPACE = TYPE.WhiteSpace;
var COMMENT = TYPE.Comment;
var EXCLAMATIONMARK = TYPE.ExclamationMark;
var ATKEYWORD = TYPE.AtKeyword;
var CDO = TYPE.CDO;
var CDC = TYPE.CDC;

function consumeRaw(startToken) {
    return this.Raw(startToken, 0, 0, false, false);
}

module.exports = {
    name: 'StyleSheet',
    structure: {
        children: [[
            'Comment',
            'CDO',
            'CDC',
            'Atrule',
            'Rule',
            'Raw'
        ]]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = this.createList();
        var child;

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case WHITESPACE:
                    this.scanner.next();
                    continue;

                case COMMENT:
                    // ignore comments except exclamation comments (i.e. /*! .. */) on top level
                    if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK) {
                        this.scanner.next();
                        continue;
                    }

                    child = this.Comment();
                    break;

                case CDO: // <!--
                    child = this.CDO();
                    break;

                case CDC: // -->
                    child = this.CDC();
                    break;

                // CSS Syntax Module Level 3
                // §2.2 Error handling
                // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
                case ATKEYWORD:
                    child = this.parseWithFallback(this.Atrule, consumeRaw);
                    break;

                // Anything else starts a qualified rule ...
                default:
                    child = this.parseWithFallback(this.Rule, consumeRaw);
            }

            children.push(child);
        }

        return {
            type: 'StyleSheet',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    },
    walkContext: 'stylesheet'
};

},{"../../tokenizer":226}],198:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var ASTERISK = TYPE.Asterisk;
var VERTICALLINE = TYPE.VerticalLine;

function eatIdentifierOrAsterisk() {
    if (this.scanner.tokenType !== IDENTIFIER &&
        this.scanner.tokenType !== ASTERISK) {
        this.scanner.error('Identifier or asterisk is expected');
    }

    this.scanner.next();
}

// ident
// ident|ident
// ident|*
// *
// *|ident
// *|*
// |ident
// |*
module.exports = {
    name: 'TypeSelector',
    structure: {
        name: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        if (this.scanner.tokenType === VERTICALLINE) {
            this.scanner.next();
            eatIdentifierOrAsterisk.call(this);
        } else {
            eatIdentifierOrAsterisk.call(this);

            if (this.scanner.tokenType === VERTICALLINE) {
                this.scanner.next();
                eatIdentifierOrAsterisk.call(this);
            }
        }

        return {
            type: 'TypeSelector',
            loc: this.getLocation(start, this.scanner.tokenStart),
            name: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.name);
    }
};

},{"../../tokenizer":226}],199:[function(require,module,exports){
var isHex = require('../../tokenizer').isHex;
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var NUMBER = TYPE.Number;
var PLUSSIGN = TYPE.PlusSign;
var HYPHENMINUS = TYPE.HyphenMinus;
var FULLSTOP = TYPE.FullStop;
var QUESTIONMARK = TYPE.QuestionMark;

function scanUnicodeNumber(scanner) {
    for (var pos = scanner.tokenStart + 1; pos < scanner.tokenEnd; pos++) {
        var code = scanner.source.charCodeAt(pos);

        // break on fullstop or hyperminus/plussign after exponent
        if (code === FULLSTOP || code === PLUSSIGN) {
            // break token, exclude symbol
            scanner.tokenStart = pos;
            return false;
        }
    }

    return true;
}

// https://drafts.csswg.org/css-syntax-3/#urange
function scanUnicodeRange(scanner) {
    var hexStart = scanner.tokenStart + 1; // skip +
    var hexLength = 0;

    scan: {
        if (scanner.tokenType === NUMBER) {
            if (scanner.source.charCodeAt(scanner.tokenStart) !== FULLSTOP && scanUnicodeNumber(scanner)) {
                scanner.next();
            } else if (scanner.source.charCodeAt(scanner.tokenStart) !== HYPHENMINUS) {
                break scan;
            }
        } else {
            scanner.next(); // PLUSSIGN
        }

        if (scanner.tokenType === HYPHENMINUS) {
            scanner.next();
        }

        if (scanner.tokenType === NUMBER) {
            scanner.next();
        }

        if (scanner.tokenType === IDENTIFIER) {
            scanner.next();
        }

        if (scanner.tokenStart === hexStart) {
            scanner.error('Unexpected input', hexStart);
        }
    }

    // validate for U+x{1,6} or U+x{1,6}-x{1,6}
    // where x is [0-9a-fA-F]
    for (var i = hexStart, wasHyphenMinus = false; i < scanner.tokenStart; i++) {
        var code = scanner.source.charCodeAt(i);

        if (isHex(code) === false && (code !== HYPHENMINUS || wasHyphenMinus)) {
            scanner.error('Unexpected input', i);
        }

        if (code === HYPHENMINUS) {
            // hex sequence shouldn't be an empty
            if (hexLength === 0) {
                scanner.error('Unexpected input', i);
            }

            wasHyphenMinus = true;
            hexLength = 0;
        } else {
            hexLength++;

            // too long hex sequence
            if (hexLength > 6) {
                scanner.error('Too long hex sequence', i);
            }
        }

    }

    // check we have a non-zero sequence
    if (hexLength === 0) {
        scanner.error('Unexpected input', i - 1);
    }

    // U+abc???
    if (!wasHyphenMinus) {
        // consume as many U+003F QUESTION MARK (?) code points as possible
        for (; hexLength < 6 && !scanner.eof; scanner.next()) {
            if (scanner.tokenType !== QUESTIONMARK) {
                break;
            }

            hexLength++;
        }
    }
}

module.exports = {
    name: 'UnicodeRange',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.next(); // U or u
        scanUnicodeRange(this.scanner);

        return {
            type: 'UnicodeRange',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: this.scanner.substrToCursor(start)
        };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

},{"../../tokenizer":226}],200:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var STRING = TYPE.String;
var URL = TYPE.Url;
var RAW = TYPE.Raw;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

// url '(' S* (string | raw) S* ')'
module.exports = {
    name: 'Url',
    structure: {
        value: ['String', 'Raw']
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var value;

        this.scanner.eat(URL);
        this.scanner.skipSC();

        switch (this.scanner.tokenType) {
            case STRING:
                value = this.String();
                break;

            case RAW:
                value = this.Raw(this.scanner.currentToken, 0, RAW, true, false);
                break;

            default:
                this.scanner.error('String or Raw is expected');
        }

        this.scanner.skipSC();
        this.scanner.eat(RIGHTPARENTHESIS);

        return {
            type: 'Url',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: value
        };
    },
    generate: function(node) {
        this.chunk('url');
        this.chunk('(');
        this.node(node.value);
        this.chunk(')');
    }
};

},{"../../tokenizer":226}],201:[function(require,module,exports){
module.exports = {
    name: 'Value',
    structure: {
        children: [[]]
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var children = this.readSequence(this.scope.Value);

        return {
            type: 'Value',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        this.children(node);
    }
};

},{}],202:[function(require,module,exports){
var WHITESPACE = require('../../tokenizer').TYPE.WhiteSpace;
var SPACE = Object.freeze({
    type: 'WhiteSpace',
    loc: null,
    value: ' '
});

module.exports = {
    name: 'WhiteSpace',
    structure: {
        value: String
    },
    parse: function() {
        this.scanner.eat(WHITESPACE);
        return SPACE;

        // return {
        //     type: 'WhiteSpace',
        //     loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
        //     value: this.scanner.consume(WHITESPACE)
        // };
    },
    generate: function(node) {
        this.chunk(node.value);
    }
};

},{"../../tokenizer":226}],203:[function(require,module,exports){
module.exports = {
    AnPlusB: require('./AnPlusB'),
    Atrule: require('./Atrule'),
    AtrulePrelude: require('./AtrulePrelude'),
    AttributeSelector: require('./AttributeSelector'),
    Block: require('./Block'),
    Brackets: require('./Brackets'),
    CDC: require('./CDC'),
    CDO: require('./CDO'),
    ClassSelector: require('./ClassSelector'),
    Combinator: require('./Combinator'),
    Comment: require('./Comment'),
    Declaration: require('./Declaration'),
    DeclarationList: require('./DeclarationList'),
    Dimension: require('./Dimension'),
    Function: require('./Function'),
    HexColor: require('./HexColor'),
    Identifier: require('./Identifier'),
    IdSelector: require('./IdSelector'),
    MediaFeature: require('./MediaFeature'),
    MediaQuery: require('./MediaQuery'),
    MediaQueryList: require('./MediaQueryList'),
    Nth: require('./Nth'),
    Number: require('./Number'),
    Operator: require('./Operator'),
    Parentheses: require('./Parentheses'),
    Percentage: require('./Percentage'),
    PseudoClassSelector: require('./PseudoClassSelector'),
    PseudoElementSelector: require('./PseudoElementSelector'),
    Ratio: require('./Ratio'),
    Raw: require('./Raw'),
    Rule: require('./Rule'),
    Selector: require('./Selector'),
    SelectorList: require('./SelectorList'),
    String: require('./String'),
    StyleSheet: require('./StyleSheet'),
    TypeSelector: require('./TypeSelector'),
    UnicodeRange: require('./UnicodeRange'),
    Url: require('./Url'),
    Value: require('./Value'),
    WhiteSpace: require('./WhiteSpace')
};

},{"./AnPlusB":163,"./Atrule":164,"./AtrulePrelude":165,"./AttributeSelector":166,"./Block":167,"./Brackets":168,"./CDC":169,"./CDO":170,"./ClassSelector":171,"./Combinator":172,"./Comment":173,"./Declaration":174,"./DeclarationList":175,"./Dimension":176,"./Function":177,"./HexColor":178,"./IdSelector":179,"./Identifier":180,"./MediaFeature":181,"./MediaQuery":182,"./MediaQueryList":183,"./Nth":184,"./Number":185,"./Operator":186,"./Parentheses":187,"./Percentage":188,"./PseudoClassSelector":189,"./PseudoElementSelector":190,"./Ratio":191,"./Raw":192,"./Rule":193,"./Selector":194,"./SelectorList":195,"./String":196,"./StyleSheet":197,"./TypeSelector":198,"./UnicodeRange":199,"./Url":200,"./Value":201,"./WhiteSpace":202}],204:[function(require,module,exports){
var DISALLOW_OF_CLAUSE = false;

module.exports = {
    parse: function nth() {
        return this.createSingleNodeList(
            this.Nth(DISALLOW_OF_CLAUSE)
        );
    }
};

},{}],205:[function(require,module,exports){
var ALLOW_OF_CLAUSE = true;

module.exports = {
    parse: function nthWithOfClause() {
        return this.createSingleNodeList(
            this.Nth(ALLOW_OF_CLAUSE)
        );
    }
};

},{}],206:[function(require,module,exports){
module.exports = {
    parse: function selectorList() {
        return this.createSingleNodeList(
            this.SelectorList()
        );
    }
};

},{}],207:[function(require,module,exports){
module.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.Identifier()
        );
    }
};

},{}],208:[function(require,module,exports){
module.exports = {
    parse: function() {
        return this.createSingleNodeList(
            this.SelectorList()
        );
    }
};

},{}],209:[function(require,module,exports){
module.exports = {
    'dir': require('./dir'),
    'has': require('./has'),
    'lang': require('./lang'),
    'matches': require('./matches'),
    'not': require('./not'),
    'nth-child': require('./nth-child'),
    'nth-last-child': require('./nth-last-child'),
    'nth-last-of-type': require('./nth-last-of-type'),
    'nth-of-type': require('./nth-of-type'),
    'slotted': require('./slotted')
};

},{"./dir":207,"./has":208,"./lang":210,"./matches":211,"./not":212,"./nth-child":213,"./nth-last-child":214,"./nth-last-of-type":215,"./nth-of-type":216,"./slotted":217}],210:[function(require,module,exports){
arguments[4][207][0].apply(exports,arguments)
},{"dup":207}],211:[function(require,module,exports){
module.exports = require('./common/selectorList');

},{"./common/selectorList":206}],212:[function(require,module,exports){
arguments[4][211][0].apply(exports,arguments)
},{"./common/selectorList":206,"dup":211}],213:[function(require,module,exports){
module.exports = require('./common/nthWithOfClause');

},{"./common/nthWithOfClause":205}],214:[function(require,module,exports){
arguments[4][213][0].apply(exports,arguments)
},{"./common/nthWithOfClause":205,"dup":213}],215:[function(require,module,exports){
module.exports = require('./common/nth');

},{"./common/nth":204}],216:[function(require,module,exports){
arguments[4][215][0].apply(exports,arguments)
},{"./common/nth":204,"dup":215}],217:[function(require,module,exports){
module.exports = {
    parse: function compoundSelector() {
        return this.createSingleNodeList(
            this.Selector()
        );
    }
};

},{}],218:[function(require,module,exports){
module.exports = {
    getNode: require('./default')
};

},{"./default":219}],219:[function(require,module,exports){
var cmpChar = require('../../tokenizer').cmpChar;
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var STRING = TYPE.String;
var NUMBER = TYPE.Number;
var FUNCTION = TYPE.Function;
var URL = TYPE.Url;
var NUMBERSIGN = TYPE.NumberSign;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var PLUSSIGN = TYPE.PlusSign;
var HYPHENMINUS = TYPE.HyphenMinus;
var COMMA = TYPE.Comma;
var SOLIDUS = TYPE.Solidus;
var ASTERISK = TYPE.Asterisk;
var PERCENTSIGN = TYPE.PercentSign;
var BACKSLASH = TYPE.Backslash;
var U = 117; // 'u'.charCodeAt(0)

module.exports = function defaultRecognizer(context) {
    switch (this.scanner.tokenType) {
        case NUMBERSIGN:
            return this.HexColor();

        case COMMA:
            context.space = null;
            context.ignoreWSAfter = true;
            return this.Operator();

        case SOLIDUS:
        case ASTERISK:
        case PLUSSIGN:
        case HYPHENMINUS:
            return this.Operator();

        case LEFTPARENTHESIS:
            return this.Parentheses(this.readSequence, context.recognizer);

        case LEFTSQUAREBRACKET:
            return this.Brackets(this.readSequence, context.recognizer);

        case STRING:
            return this.String();

        case NUMBER:
            switch (this.scanner.lookupType(1)) {
                case PERCENTSIGN:
                    return this.Percentage();

                case IDENTIFIER:
                    // edge case: number with folowing \0 and \9 hack shouldn't to be a Dimension
                    if (cmpChar(this.scanner.source, this.scanner.tokenEnd, BACKSLASH)) {
                        return this.Number();
                    } else {
                        return this.Dimension();
                    }

                default:
                    return this.Number();
            }

        case FUNCTION:
            return this.Function(this.readSequence, context.recognizer);

        case URL:
            return this.Url();

        case IDENTIFIER:
            // check for unicode range, it should start with u+ or U+
            if (cmpChar(this.scanner.source, this.scanner.tokenStart, U) &&
                cmpChar(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN)) {
                return this.UnicodeRange();
            } else {
                return this.Identifier();
            }
    }
};

},{"../../tokenizer":226}],220:[function(require,module,exports){
module.exports = {
    AtrulePrelude: require('./atrulePrelude'),
    Selector: require('./selector'),
    Value: require('./value')
};

},{"./atrulePrelude":218,"./selector":221,"./value":222}],221:[function(require,module,exports){
var TYPE = require('../../tokenizer').TYPE;

var IDENTIFIER = TYPE.Identifier;
var NUMBER = TYPE.Number;
var NUMBERSIGN = TYPE.NumberSign;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var PLUSSIGN = TYPE.PlusSign;
var SOLIDUS = TYPE.Solidus;
var ASTERISK = TYPE.Asterisk;
var FULLSTOP = TYPE.FullStop;
var COLON = TYPE.Colon;
var GREATERTHANSIGN = TYPE.GreaterThanSign;
var VERTICALLINE = TYPE.VerticalLine;
var TILDE = TYPE.Tilde;

function getNode(context) {
    switch (this.scanner.tokenType) {
        case PLUSSIGN:
        case GREATERTHANSIGN:
        case TILDE:
            context.space = null;
            context.ignoreWSAfter = true;
            return this.Combinator();

        case SOLIDUS:  // /deep/
            return this.Combinator();

        case FULLSTOP:
            return this.ClassSelector();

        case LEFTSQUAREBRACKET:
            return this.AttributeSelector();

        case NUMBERSIGN:
            return this.IdSelector();

        case COLON:
            if (this.scanner.lookupType(1) === COLON) {
                return this.PseudoElementSelector();
            } else {
                return this.PseudoClassSelector();
            }

        case IDENTIFIER:
        case ASTERISK:
        case VERTICALLINE:
            return this.TypeSelector();

        case NUMBER:
            return this.Percentage();
    }
};

module.exports = {
    getNode: getNode
};

},{"../../tokenizer":226}],222:[function(require,module,exports){
module.exports = {
    getNode: require('./default'),
    '-moz-element': require('../function/element'),
    'element': require('../function/element'),
    'expression': require('../function/expression'),
    'var': require('../function/var')
};

},{"../function/element":159,"../function/expression":160,"../function/var":161,"./default":219}],223:[function(require,module,exports){
'use strict';

var CssSyntaxError = require('./error');

var constants = require('./const');
var TYPE = constants.TYPE;
var NAME = constants.NAME;
var SYMBOL_TYPE = constants.SYMBOL_TYPE;

var utils = require('./utils');
var firstCharOffset = utils.firstCharOffset;
var cmpStr = utils.cmpStr;
var isNumber = utils.isNumber;
var findWhiteSpaceStart = utils.findWhiteSpaceStart;
var findWhiteSpaceEnd = utils.findWhiteSpaceEnd;
var findCommentEnd = utils.findCommentEnd;
var findStringEnd = utils.findStringEnd;
var findNumberEnd = utils.findNumberEnd;
var findIdentifierEnd = utils.findIdentifierEnd;
var findUrlRawEnd = utils.findUrlRawEnd;

var NULL = 0;
var WHITESPACE = TYPE.WhiteSpace;
var IDENTIFIER = TYPE.Identifier;
var NUMBER = TYPE.Number;
var STRING = TYPE.String;
var COMMENT = TYPE.Comment;
var PUNCTUATOR = TYPE.Punctuator;
var CDO = TYPE.CDO;
var CDC = TYPE.CDC;
var ATKEYWORD = TYPE.AtKeyword;
var FUNCTION = TYPE.Function;
var URL = TYPE.Url;
var RAW = TYPE.Raw;

var N = 10;
var F = 12;
var R = 13;
var STAR = TYPE.Asterisk;
var SLASH = TYPE.Solidus;
var FULLSTOP = TYPE.FullStop;
var PLUSSIGN = TYPE.PlusSign;
var HYPHENMINUS = TYPE.HyphenMinus;
var GREATERTHANSIGN = TYPE.GreaterThanSign;
var LESSTHANSIGN = TYPE.LessThanSign;
var EXCLAMATIONMARK = TYPE.ExclamationMark;
var COMMERCIALAT = TYPE.CommercialAt;
var QUOTATIONMARK = TYPE.QuotationMark;
var APOSTROPHE = TYPE.Apostrophe;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;
var LEFTSQUAREBRACKET = TYPE.LeftSquareBracket;
var RIGHTSQUAREBRACKET = TYPE.RightSquareBracket;

var MIN_BUFFER_SIZE = 16 * 1024;
var OFFSET_MASK = 0x00FFFFFF;
var TYPE_SHIFT = 24;
var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray is not supported

function computeLinesAndColumns(tokenizer, source) {
    var sourceLength = source.length;
    var start = firstCharOffset(source);
    var lines = tokenizer.lines;
    var line = tokenizer.startLine;
    var columns = tokenizer.columns;
    var column = tokenizer.startColumn;

    if (lines === null || lines.length < sourceLength + 1) {
        lines = new SafeUint32Array(Math.max(sourceLength + 1024, MIN_BUFFER_SIZE));
        columns = new SafeUint32Array(lines.length);
    }

    for (var i = start; i < sourceLength; i++) {
        var code = source.charCodeAt(i);

        lines[i] = line;
        columns[i] = column++;

        if (code === N || code === R || code === F) {
            if (code === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
                i++;
                lines[i] = line;
                columns[i] = column;
            }

            line++;
            column = 1;
        }
    }

    lines[i] = line;
    columns[i] = column;

    tokenizer.linesAnsColumnsComputed = true;
    tokenizer.lines = lines;
    tokenizer.columns = columns;
}

function tokenLayout(tokenizer, source, startPos) {
    var sourceLength = source.length;
    var offsetAndType = tokenizer.offsetAndType;
    var balance = tokenizer.balance;
    var tokenCount = 0;
    var prevType = 0;
    var offset = startPos;
    var anchor = 0;
    var balanceCloseCode = 0;
    var balanceStart = 0;
    var balancePrev = 0;

    if (offsetAndType === null || offsetAndType.length < sourceLength + 1) {
        offsetAndType = new SafeUint32Array(sourceLength + 1024);
        balance = new SafeUint32Array(sourceLength + 1024);
    }

    while (offset < sourceLength) {
        var code = source.charCodeAt(offset);
        var type = code < 0x80 ? SYMBOL_TYPE[code] : IDENTIFIER;

        balance[tokenCount] = sourceLength;

        switch (type) {
            case WHITESPACE:
                offset = findWhiteSpaceEnd(source, offset + 1);
                break;

            case PUNCTUATOR:
                switch (code) {
                    case balanceCloseCode:
                        balancePrev = balanceStart & OFFSET_MASK;
                        balanceStart = balance[balancePrev];
                        balanceCloseCode = balanceStart >> TYPE_SHIFT;
                        balance[tokenCount] = balancePrev;
                        balance[balancePrev++] = tokenCount;
                        for (; balancePrev < tokenCount; balancePrev++) {
                            if (balance[balancePrev] === sourceLength) {
                                balance[balancePrev] = tokenCount;
                            }
                        }
                        break;

                    case LEFTSQUAREBRACKET:
                        balance[tokenCount] = balanceStart;
                        balanceCloseCode = RIGHTSQUAREBRACKET;
                        balanceStart = (balanceCloseCode << TYPE_SHIFT) | tokenCount;
                        break;

                    case LEFTCURLYBRACKET:
                        balance[tokenCount] = balanceStart;
                        balanceCloseCode = RIGHTCURLYBRACKET;
                        balanceStart = (balanceCloseCode << TYPE_SHIFT) | tokenCount;
                        break;

                    case LEFTPARENTHESIS:
                        balance[tokenCount] = balanceStart;
                        balanceCloseCode = RIGHTPARENTHESIS;
                        balanceStart = (balanceCloseCode << TYPE_SHIFT) | tokenCount;
                        break;
                }

                // /*
                if (code === STAR && prevType === SLASH) {
                    type = COMMENT;
                    offset = findCommentEnd(source, offset + 1);
                    tokenCount--; // rewrite prev token
                    break;
                }

                // edge case for -.123 and +.123
                if (code === FULLSTOP && (prevType === PLUSSIGN || prevType === HYPHENMINUS)) {
                    if (offset + 1 < sourceLength && isNumber(source.charCodeAt(offset + 1))) {
                        type = NUMBER;
                        offset = findNumberEnd(source, offset + 2, false);
                        tokenCount--; // rewrite prev token
                        break;
                    }
                }

                // <!--
                if (code === EXCLAMATIONMARK && prevType === LESSTHANSIGN) {
                    if (offset + 2 < sourceLength &&
                        source.charCodeAt(offset + 1) === HYPHENMINUS &&
                        source.charCodeAt(offset + 2) === HYPHENMINUS) {
                        type = CDO;
                        offset = offset + 3;
                        tokenCount--; // rewrite prev token
                        break;
                    }
                }

                // -->
                if (code === HYPHENMINUS && prevType === HYPHENMINUS) {
                    if (offset + 1 < sourceLength && source.charCodeAt(offset + 1) === GREATERTHANSIGN) {
                        type = CDC;
                        offset = offset + 2;
                        tokenCount--; // rewrite prev token
                        break;
                    }
                }

                // ident(
                if (code === LEFTPARENTHESIS && prevType === IDENTIFIER) {
                    offset = offset + 1;
                    tokenCount--; // rewrite prev token
                    balance[tokenCount] = balance[tokenCount + 1];
                    balanceStart--;

                    // 4 char length identifier and equal to `url(` (case insensitive)
                    if (offset - anchor === 4 && cmpStr(source, anchor, offset, 'url(')) {
                        // special case for url() because it can contain any symbols sequence with few exceptions
                        anchor = findWhiteSpaceEnd(source, offset);
                        code = source.charCodeAt(anchor);
                        if (code !== LEFTPARENTHESIS &&
                            code !== RIGHTPARENTHESIS &&
                            code !== QUOTATIONMARK &&
                            code !== APOSTROPHE) {
                            // url(
                            offsetAndType[tokenCount++] = (URL << TYPE_SHIFT) | offset;
                            balance[tokenCount] = sourceLength;

                            // ws*
                            if (anchor !== offset) {
                                offsetAndType[tokenCount++] = (WHITESPACE << TYPE_SHIFT) | anchor;
                                balance[tokenCount] = sourceLength;
                            }

                            // raw
                            type = RAW;
                            offset = findUrlRawEnd(source, anchor);
                        } else {
                            type = URL;
                        }
                    } else {
                        type = FUNCTION;
                    }
                    break;
                }

                type = code;
                offset = offset + 1;
                break;

            case NUMBER:
                offset = findNumberEnd(source, offset + 1, prevType !== FULLSTOP);

                // merge number with a preceding dot, dash or plus
                if (prevType === FULLSTOP ||
                    prevType === HYPHENMINUS ||
                    prevType === PLUSSIGN) {
                    tokenCount--; // rewrite prev token
                }

                break;

            case STRING:
                offset = findStringEnd(source, offset + 1, code);
                break;

            default:
                anchor = offset;
                offset = findIdentifierEnd(source, offset);

                // merge identifier with a preceding dash
                if (prevType === HYPHENMINUS) {
                    // rewrite prev token
                    tokenCount--;
                    // restore prev prev token type
                    // for case @-prefix-ident
                    prevType = tokenCount === 0 ? 0 : offsetAndType[tokenCount - 1] >> TYPE_SHIFT;
                }

                if (prevType === COMMERCIALAT) {
                    // rewrite prev token and change type to <at-keyword-token>
                    tokenCount--;
                    type = ATKEYWORD;
                }
        }

        offsetAndType[tokenCount++] = (type << TYPE_SHIFT) | offset;
        prevType = type;
    }

    // finalize arrays
    offsetAndType[tokenCount] = offset;
    balance[tokenCount] = sourceLength;
    balance[sourceLength] = sourceLength; // prevents false positive balance match with any token
    while (balanceStart !== 0) {
        balancePrev = balanceStart & OFFSET_MASK;
        balanceStart = balance[balancePrev];
        balance[balancePrev] = sourceLength;
    }

    tokenizer.offsetAndType = offsetAndType;
    tokenizer.tokenCount = tokenCount;
    tokenizer.balance = balance;
}

//
// tokenizer
//

var Tokenizer = function(source, startOffset, startLine, startColumn) {
    this.offsetAndType = null;
    this.balance = null;
    this.lines = null;
    this.columns = null;

    this.setSource(source, startOffset, startLine, startColumn);
};

Tokenizer.prototype = {
    setSource: function(source, startOffset, startLine, startColumn) {
        var safeSource = String(source || '');
        var start = firstCharOffset(safeSource);

        this.source = safeSource;
        this.firstCharOffset = start;
        this.startOffset = typeof startOffset === 'undefined' ? 0 : startOffset;
        this.startLine = typeof startLine === 'undefined' ? 1 : startLine;
        this.startColumn = typeof startColumn === 'undefined' ? 1 : startColumn;
        this.linesAnsColumnsComputed = false;

        this.eof = false;
        this.currentToken = -1;
        this.tokenType = 0;
        this.tokenStart = start;
        this.tokenEnd = start;

        tokenLayout(this, safeSource, start);
        this.next();
    },

    lookupType: function(offset) {
        offset += this.currentToken;

        if (offset < this.tokenCount) {
            return this.offsetAndType[offset] >> TYPE_SHIFT;
        }

        return NULL;
    },
    lookupNonWSType: function(offset) {
        offset += this.currentToken;

        for (var type; offset < this.tokenCount; offset++) {
            type = this.offsetAndType[offset] >> TYPE_SHIFT;

            if (type !== WHITESPACE) {
                return type;
            }
        }

        return NULL;
    },
    lookupValue: function(offset, referenceStr) {
        offset += this.currentToken;

        if (offset < this.tokenCount) {
            return cmpStr(
                this.source,
                this.offsetAndType[offset - 1] & OFFSET_MASK,
                this.offsetAndType[offset] & OFFSET_MASK,
                referenceStr
            );
        }

        return false;
    },
    getTokenStart: function(tokenNum) {
        if (tokenNum === this.currentToken) {
            return this.tokenStart;
        }

        if (tokenNum > 0) {
            return tokenNum < this.tokenCount
                ? this.offsetAndType[tokenNum - 1] & OFFSET_MASK
                : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
        }

        return this.firstCharOffset;
    },
    getOffsetExcludeWS: function() {
        if (this.currentToken > 0) {
            if ((this.offsetAndType[this.currentToken - 1] >> TYPE_SHIFT) === WHITESPACE) {
                return this.currentToken > 1
                    ? this.offsetAndType[this.currentToken - 2] & OFFSET_MASK
                    : this.firstCharOffset;
            }
        }
        return this.tokenStart;
    },
    getRawLength: function(startToken, endTokenType1, endTokenType2, includeTokenType2) {
        var cursor = startToken;
        var balanceEnd;

        loop:
        for (; cursor < this.tokenCount; cursor++) {
            balanceEnd = this.balance[cursor];

            // belance end points to offset before start
            if (balanceEnd < startToken) {
                break loop;
            }

            // check token is stop type
            switch (this.offsetAndType[cursor] >> TYPE_SHIFT) {
                case endTokenType1:
                    break loop;

                case endTokenType2:
                    if (includeTokenType2) {
                        cursor++;
                    }
                    break loop;

                default:
                    // fast forward to the end of balanced block
                    if (this.balance[balanceEnd] === cursor) {
                        cursor = balanceEnd;
                    }
            }

        }

        return cursor - this.currentToken;
    },
    isBalanceEdge: function(pos) {
        var balanceStart = this.balance[this.currentToken];
        return balanceStart < pos;
    },

    getTokenValue: function() {
        return this.source.substring(this.tokenStart, this.tokenEnd);
    },
    substrToCursor: function(start) {
        return this.source.substring(start, this.tokenStart);
    },

    skipWS: function() {
        for (var i = this.currentToken, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
            if ((this.offsetAndType[i] >> TYPE_SHIFT) !== WHITESPACE) {
                break;
            }
        }

        if (skipTokenCount > 0) {
            this.skip(skipTokenCount);
        }
    },
    skipSC: function() {
        while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
            this.next();
        }
    },
    skip: function(tokenCount) {
        var next = this.currentToken + tokenCount;

        if (next < this.tokenCount) {
            this.currentToken = next;
            this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
            next = this.offsetAndType[next];
            this.tokenType = next >> TYPE_SHIFT;
            this.tokenEnd = next & OFFSET_MASK;
        } else {
            this.currentToken = this.tokenCount;
            this.next();
        }
    },
    next: function() {
        var next = this.currentToken + 1;

        if (next < this.tokenCount) {
            this.currentToken = next;
            this.tokenStart = this.tokenEnd;
            next = this.offsetAndType[next];
            this.tokenType = next >> TYPE_SHIFT;
            this.tokenEnd = next & OFFSET_MASK;
        } else {
            this.currentToken = this.tokenCount;
            this.eof = true;
            this.tokenType = NULL;
            this.tokenStart = this.tokenEnd = this.source.length;
        }
    },

    eat: function(tokenType) {
        if (this.tokenType !== tokenType) {
            var offset = this.tokenStart;
            var message = NAME[tokenType] + ' is expected';

            // tweak message and offset
            if (tokenType === IDENTIFIER) {
                // when identifier is expected but there is a function or url
                if (this.tokenType === FUNCTION || this.tokenType === URL) {
                    offset = this.tokenEnd - 1;
                    message += ' but function found';
                }
            } else {
                // when test type is part of another token show error for current position + 1
                // e.g. eat(HYPHENMINUS) will fail on "-foo", but pointing on "-" is odd
                if (this.source.charCodeAt(this.tokenStart) === tokenType) {
                    offset = offset + 1;
                }
            }

            this.error(message, offset);
        }

        this.next();
    },
    eatNonWS: function(tokenType) {
        this.skipWS();
        this.eat(tokenType);
    },

    consume: function(tokenType) {
        var value = this.getTokenValue();

        this.eat(tokenType);

        return value;
    },
    consumeFunctionName: function() {
        var name = this.source.substring(this.tokenStart, this.tokenEnd - 1);

        this.eat(FUNCTION);

        return name;
    },
    consumeNonWS: function(tokenType) {
        this.skipWS();

        return this.consume(tokenType);
    },

    expectIdentifier: function(name) {
        if (this.tokenType !== IDENTIFIER || cmpStr(this.source, this.tokenStart, this.tokenEnd, name) === false) {
            this.error('Identifier `' + name + '` is expected');
        }

        this.next();
    },

    getLocation: function(offset, filename) {
        if (!this.linesAnsColumnsComputed) {
            computeLinesAndColumns(this, this.source);
        }

        return {
            source: filename,
            offset: this.startOffset + offset,
            line: this.lines[offset],
            column: this.columns[offset]
        };
    },

    getLocationRange: function(start, end, filename) {
        if (!this.linesAnsColumnsComputed) {
            computeLinesAndColumns(this, this.source);
        }

        return {
            source: filename,
            start: {
                offset: this.startOffset + start,
                line: this.lines[start],
                column: this.columns[start]
            },
            end: {
                offset: this.startOffset + end,
                line: this.lines[end],
                column: this.columns[end]
            }
        };
    },

    error: function(message, offset) {
        var location = typeof offset !== 'undefined' && offset < this.source.length
            ? this.getLocation(offset)
            : this.eof
                ? this.getLocation(findWhiteSpaceStart(this.source, this.source.length - 1))
                : this.getLocation(this.tokenStart);

        throw new CssSyntaxError(
            message || 'Unexpected input',
            this.source,
            location.offset,
            location.line,
            location.column
        );
    },

    dump: function() {
        var offset = 0;

        return Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map(function(item, idx) {
            var start = offset;
            var end = item & OFFSET_MASK;

            offset = end;

            return {
                idx: idx,
                type: NAME[item >> TYPE_SHIFT],
                chunk: this.source.substring(start, end),
                balance: this.balance[idx]
            };
        }, this);
    }
};

// extend with error class
Tokenizer.CssSyntaxError = CssSyntaxError;

// extend tokenizer with constants
Object.keys(constants).forEach(function(key) {
    Tokenizer[key] = constants[key];
});

// extend tokenizer with static methods from utils
Object.keys(utils).forEach(function(key) {
    Tokenizer[key] = utils[key];
});

// warm up tokenizer to elimitate code branches that never execute
// fix soft deoptimizations (insufficient type feedback)
new Tokenizer('\n\r\r\n\f<!---->//""\'\'/*\r\n\f*/1a;.\\31\t\+2{url(a);func();+1.2e3 -.4e-5 .6e+7}').getLocation();

module.exports = Tokenizer;

},{"./const":224,"./error":225,"./utils":227}],224:[function(require,module,exports){
'use strict';

// token types (note: value shouldn't intersect with used char codes)
var WHITESPACE = 1;
var IDENTIFIER = 2;
var NUMBER = 3;
var STRING = 4;
var COMMENT = 5;
var PUNCTUATOR = 6;
var CDO = 7;
var CDC = 8;
var ATKEYWORD = 14;
var FUNCTION = 15;
var URL = 16;
var RAW = 17;

var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;

var TYPE = {
    WhiteSpace:   WHITESPACE,
    Identifier:   IDENTIFIER,
    Number:           NUMBER,
    String:           STRING,
    Comment:         COMMENT,
    Punctuator:   PUNCTUATOR,
    CDO:                 CDO,
    CDC:                 CDC,
    AtKeyword:     ATKEYWORD,
    Function:       FUNCTION,
    Url:                 URL,
    Raw:                 RAW,

    ExclamationMark:      33,  // !
    QuotationMark:        34,  // "
    NumberSign:           35,  // #
    DollarSign:           36,  // $
    PercentSign:          37,  // %
    Ampersand:            38,  // &
    Apostrophe:           39,  // '
    LeftParenthesis:      40,  // (
    RightParenthesis:     41,  // )
    Asterisk:             42,  // *
    PlusSign:             43,  // +
    Comma:                44,  // ,
    HyphenMinus:          45,  // -
    FullStop:             46,  // .
    Solidus:              47,  // /
    Colon:                58,  // :
    Semicolon:            59,  // ;
    LessThanSign:         60,  // <
    EqualsSign:           61,  // =
    GreaterThanSign:      62,  // >
    QuestionMark:         63,  // ?
    CommercialAt:         64,  // @
    LeftSquareBracket:    91,  // [
    Backslash:            92,  // \
    RightSquareBracket:   93,  // ]
    CircumflexAccent:     94,  // ^
    LowLine:              95,  // _
    GraveAccent:          96,  // `
    LeftCurlyBracket:    123,  // {
    VerticalLine:        124,  // |
    RightCurlyBracket:   125,  // }
    Tilde:               126   // ~
};

var NAME = Object.keys(TYPE).reduce(function(result, key) {
    result[TYPE[key]] = key;
    return result;
}, {});

// https://drafts.csswg.org/css-syntax/#tokenizer-definitions
// > non-ASCII code point
// >   A code point with a value equal to or greater than U+0080 <control>
// > name-start code point
// >   A letter, a non-ASCII code point, or U+005F LOW LINE (_).
// > name code point
// >   A name-start code point, a digit, or U+002D HYPHEN-MINUS (-)
// That means only ASCII code points has a special meaning and we a maps for 0..127 codes only
var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray is not supported
var SYMBOL_TYPE = new SafeUint32Array(0x80);
var PUNCTUATION = new SafeUint32Array(0x80);
var STOP_URL_RAW = new SafeUint32Array(0x80);

for (var i = 0; i < SYMBOL_TYPE.length; i++) {
    SYMBOL_TYPE[i] = IDENTIFIER;
}

// fill categories
[
    TYPE.ExclamationMark,    // !
    TYPE.QuotationMark,      // "
    TYPE.NumberSign,         // #
    TYPE.DollarSign,         // $
    TYPE.PercentSign,        // %
    TYPE.Ampersand,          // &
    TYPE.Apostrophe,         // '
    TYPE.LeftParenthesis,    // (
    TYPE.RightParenthesis,   // )
    TYPE.Asterisk,           // *
    TYPE.PlusSign,           // +
    TYPE.Comma,              // ,
    TYPE.HyphenMinus,        // -
    TYPE.FullStop,           // .
    TYPE.Solidus,            // /
    TYPE.Colon,              // :
    TYPE.Semicolon,          // ;
    TYPE.LessThanSign,       // <
    TYPE.EqualsSign,         // =
    TYPE.GreaterThanSign,    // >
    TYPE.QuestionMark,       // ?
    TYPE.CommercialAt,       // @
    TYPE.LeftSquareBracket,  // [
    // TYPE.Backslash,          // \
    TYPE.RightSquareBracket, // ]
    TYPE.CircumflexAccent,   // ^
    // TYPE.LowLine,            // _
    TYPE.GraveAccent,        // `
    TYPE.LeftCurlyBracket,   // {
    TYPE.VerticalLine,       // |
    TYPE.RightCurlyBracket,  // }
    TYPE.Tilde               // ~
].forEach(function(key) {
    SYMBOL_TYPE[Number(key)] = PUNCTUATOR;
    PUNCTUATION[Number(key)] = PUNCTUATOR;
});

for (var i = 48; i <= 57; i++) {
    SYMBOL_TYPE[i] = NUMBER;
}

SYMBOL_TYPE[SPACE] = WHITESPACE;
SYMBOL_TYPE[TAB] = WHITESPACE;
SYMBOL_TYPE[N] = WHITESPACE;
SYMBOL_TYPE[R] = WHITESPACE;
SYMBOL_TYPE[F] = WHITESPACE;

SYMBOL_TYPE[TYPE.Apostrophe] = STRING;
SYMBOL_TYPE[TYPE.QuotationMark] = STRING;

STOP_URL_RAW[SPACE] = 1;
STOP_URL_RAW[TAB] = 1;
STOP_URL_RAW[N] = 1;
STOP_URL_RAW[R] = 1;
STOP_URL_RAW[F] = 1;
STOP_URL_RAW[TYPE.Apostrophe] = 1;
STOP_URL_RAW[TYPE.QuotationMark] = 1;
STOP_URL_RAW[TYPE.LeftParenthesis] = 1;
STOP_URL_RAW[TYPE.RightParenthesis] = 1;

// whitespace is punctuation ...
PUNCTUATION[SPACE] = PUNCTUATOR;
PUNCTUATION[TAB] = PUNCTUATOR;
PUNCTUATION[N] = PUNCTUATOR;
PUNCTUATION[R] = PUNCTUATOR;
PUNCTUATION[F] = PUNCTUATOR;
// ... hyper minus is not
PUNCTUATION[TYPE.HyphenMinus] = 0;

module.exports = {
    TYPE: TYPE,
    NAME: NAME,

    SYMBOL_TYPE: SYMBOL_TYPE,
    PUNCTUATION: PUNCTUATION,
    STOP_URL_RAW: STOP_URL_RAW
};

},{}],225:[function(require,module,exports){
'use strict';

var createCustomError = require('../utils/createCustomError');
var MAX_LINE_LENGTH = 100;
var OFFSET_CORRECTION = 60;
var TAB_REPLACEMENT = '    ';

function sourceFragment(error, extraLines) {
    function processLines(start, end) {
        return lines.slice(start, end).map(function(line, idx) {
            var num = String(start + idx + 1);

            while (num.length < maxNumLength) {
                num = ' ' + num;
            }

            return num + ' |' + line;
        }).join('\n');
    }

    var lines = error.source.split(/\r\n?|\n|\f/);
    var line = error.line;
    var column = error.column;
    var startLine = Math.max(1, line - extraLines) - 1;
    var endLine = Math.min(line + extraLines, lines.length + 1);
    var maxNumLength = Math.max(4, String(endLine).length) + 1;
    var cutLeft = 0;

    // column correction according to replaced tab before column
    column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;

    if (column > MAX_LINE_LENGTH) {
        cutLeft = column - OFFSET_CORRECTION + 3;
        column = OFFSET_CORRECTION - 2;
    }

    for (var i = startLine; i <= endLine; i++) {
        if (i >= 0 && i < lines.length) {
            lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
            lines[i] =
                (cutLeft > 0 && lines[i].length > cutLeft ? '\u2026' : '') +
                lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) +
                (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? '\u2026' : '');
        }
    }

    return [
        processLines(startLine, line),
        new Array(column + maxNumLength + 2).join('-') + '^',
        processLines(line, endLine)
    ].filter(Boolean).join('\n');
}

var CssSyntaxError = function(message, source, offset, line, column) {
    var error = createCustomError('CssSyntaxError', message);

    error.source = source;
    error.offset = offset;
    error.line = line;
    error.column = column;

    error.sourceFragment = function(extraLines) {
        return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
    };
    Object.defineProperty(error, 'formattedMessage', {
        get: function() {
            return (
                'Parse error: ' + error.message + '\n' +
                sourceFragment(error, 2)
            );
        }
    });

    // for backward capability
    error.parseError = {
        offset: offset,
        line: line,
        column: column
    };

    return error;
};

module.exports = CssSyntaxError;

},{"../utils/createCustomError":229}],226:[function(require,module,exports){
module.exports = require('./Tokenizer');

},{"./Tokenizer":223}],227:[function(require,module,exports){
'use strict';

var constants = require('./const');
var PUNCTUATION = constants.PUNCTUATION;
var STOP_URL_RAW = constants.STOP_URL_RAW;
var TYPE = constants.TYPE;
var FULLSTOP = TYPE.FullStop;
var PLUSSIGN = TYPE.PlusSign;
var HYPHENMINUS = TYPE.HyphenMinus;
var PUNCTUATOR = TYPE.Punctuator;
var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;
var BACK_SLASH = 92;
var E = 101; // 'e'.charCodeAt(0)

function firstCharOffset(source) {
    // detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)
    if (source.charCodeAt(0) === 0xFEFF ||  // UTF-16BE
        source.charCodeAt(0) === 0xFFFE) {  // UTF-16LE
        return 1;
    }

    return 0;
}

function isHex(code) {
    return (code >= 48 && code <= 57) || // 0 .. 9
           (code >= 65 && code <= 70) || // A .. F
           (code >= 97 && code <= 102);  // a .. f
}

function isNumber(code) {
    return code >= 48 && code <= 57;
}

function isWhiteSpace(code) {
    return code === SPACE || code === TAB || isNewline(code);
}

function isNewline(code) {
    return code === R || code === N || code === F;
}

function getNewlineLength(source, offset, code) {
    if (isNewline(code)) {
        if (code === R && offset + 1 < source.length && source.charCodeAt(offset + 1) === N) {
            return 2;
        }

        return 1;
    }

    return 0;
}

function cmpChar(testStr, offset, referenceCode) {
    var code = testStr.charCodeAt(offset);

    // code.toLowerCase() for A..Z
    if (code >= 65 && code <= 90) {
        code = code | 32;
    }

    return code === referenceCode;
}

function cmpStr(testStr, start, end, referenceStr) {
    if (end - start !== referenceStr.length) {
        return false;
    }

    if (start < 0 || end > testStr.length) {
        return false;
    }

    for (var i = start; i < end; i++) {
        var testCode = testStr.charCodeAt(i);
        var refCode = referenceStr.charCodeAt(i - start);

        // testCode.toLowerCase() for A..Z
        if (testCode >= 65 && testCode <= 90) {
            testCode = testCode | 32;
        }

        if (testCode !== refCode) {
            return false;
        }
    }

    return true;
}

function findWhiteSpaceStart(source, offset) {
    while (offset >= 0 && isWhiteSpace(source.charCodeAt(offset))) {
        offset--;
    }

    return offset + 1;
}

function findWhiteSpaceEnd(source, offset) {
    while (offset < source.length && isWhiteSpace(source.charCodeAt(offset))) {
        offset++;
    }

    return offset;
}

function findCommentEnd(source, offset) {
    var commentEnd = source.indexOf('*/', offset);

    if (commentEnd === -1) {
        return source.length;
    }

    return commentEnd + 2;
}

function findStringEnd(source, offset, quote) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        // TODO: bad string
        if (code === BACK_SLASH) {
            offset++;
        } else if (code === quote) {
            offset++;
            break;
        }
    }

    return offset;
}

function findDecimalNumberEnd(source, offset) {
    while (offset < source.length && isNumber(source.charCodeAt(offset))) {
        offset++;
    }

    return offset;
}

function findNumberEnd(source, offset, allowFraction) {
    var code;

    offset = findDecimalNumberEnd(source, offset);

    // fraction: .\d+
    if (allowFraction && offset + 1 < source.length && source.charCodeAt(offset) === FULLSTOP) {
        code = source.charCodeAt(offset + 1);

        if (isNumber(code)) {
            offset = findDecimalNumberEnd(source, offset + 1);
        }
    }

    // exponent: e[+-]\d+
    if (offset + 1 < source.length) {
        if ((source.charCodeAt(offset) | 32) === E) { // case insensitive check for `e`
            code = source.charCodeAt(offset + 1);

            if (code === PLUSSIGN || code === HYPHENMINUS) {
                if (offset + 2 < source.length) {
                    code = source.charCodeAt(offset + 2);
                }
            }

            if (isNumber(code)) {
                offset = findDecimalNumberEnd(source, offset + 2);
            }
        }
    }

    return offset;
}

// skip escaped unicode sequence that can ends with space
// [0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?
function findEscapeEnd(source, offset) {
    for (var i = 0; i < 7 && offset + i < source.length; i++) {
        var code = source.charCodeAt(offset + i);

        if (i !== 6 && isHex(code)) {
            continue;
        }

        if (i > 0) {
            offset += i - 1 + getNewlineLength(source, offset + i, code);
            if (code === SPACE || code === TAB) {
                offset++;
            }
        }

        break;
    }

    return offset;
}

function findIdentifierEnd(source, offset) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        if (code === BACK_SLASH) {
            offset = findEscapeEnd(source, offset + 1);
        } else if (code < 0x80 && PUNCTUATION[code] === PUNCTUATOR) {
            break;
        }
    }

    return offset;
}

function findUrlRawEnd(source, offset) {
    for (; offset < source.length; offset++) {
        var code = source.charCodeAt(offset);

        if (code === BACK_SLASH) {
            offset = findEscapeEnd(source, offset + 1);
        } else if (code < 0x80 && STOP_URL_RAW[code] === 1) {
            break;
        }
    }

    return offset;
}

module.exports = {
    firstCharOffset: firstCharOffset,

    isHex: isHex,
    isNumber: isNumber,
    isWhiteSpace: isWhiteSpace,
    isNewline: isNewline,
    getNewlineLength: getNewlineLength,

    cmpChar: cmpChar,
    cmpStr: cmpStr,

    findWhiteSpaceStart: findWhiteSpaceStart,
    findWhiteSpaceEnd: findWhiteSpaceEnd,
    findCommentEnd: findCommentEnd,
    findStringEnd: findStringEnd,
    findDecimalNumberEnd: findDecimalNumberEnd,
    findNumberEnd: findNumberEnd,
    findEscapeEnd: findEscapeEnd,
    findIdentifierEnd: findIdentifierEnd,
    findUrlRawEnd: findUrlRawEnd
};

},{"./const":224}],228:[function(require,module,exports){
'use strict';

var List = require('./list');

module.exports = function clone(node) {
    var result = {};

    for (var key in node) {
        var value = node[key];

        if (value) {
            if (Array.isArray(value) || value instanceof List) {
                value = value.map(clone);
            } else if (value.constructor === Object) {
                value = clone(value);
            }
        }

        result[key] = value;
    }

    return result;
};

},{"./list":230}],229:[function(require,module,exports){
module.exports = function createCustomError(name, message) {
    // use Object.create(), because some VMs prevent setting line/column otherwise
    // (iOS Safari 10 even throws an exception)
    var error = Object.create(SyntaxError.prototype);
    var errorStack = new Error();

    error.name = name;
    error.message = message;

    Object.defineProperty(error, 'stack', {
        get: function() {
            return (errorStack.stack || '').replace(/^(.+\n){1,3}/, name + ': ' + message + '\n');
        }
    });

    return error;
};

},{}],230:[function(require,module,exports){
'use strict';

//
//            item        item        item        item
//          /------\    /------\    /------\    /------\
//          | data |    | data |    | data |    | data |
//  null <--+-prev |<---+-prev |<---+-prev |<---+-prev |
//          | next-+--->| next-+--->| next-+--->| next-+--> null
//          \------/    \------/    \------/    \------/
//             ^                                    ^
//             |                list                |
//             |              /------\              |
//             \--------------+-head |              |
//                            | tail-+--------------/
//                            \------/
//

function createItem(data) {
    return {
        prev: null,
        next: null,
        data: data
    };
}

function allocateCursor(node, prev, next) {
    var cursor;

    if (cursors !== null) {
        cursor = cursors;
        cursors = cursors.cursor;
        cursor.prev = prev;
        cursor.next = next;
        cursor.cursor = node.cursor;
    } else {
        cursor = {
            prev: prev,
            next: next,
            cursor: node.cursor
        };
    }

    node.cursor = cursor;

    return cursor;
}

function releaseCursor(node) {
    var cursor = node.cursor;

    node.cursor = cursor.cursor;
    cursor.prev = null;
    cursor.next = null;
    cursor.cursor = cursors;
    cursors = cursor;
}

var cursors = null;
var List = function() {
    this.cursor = null;
    this.head = null;
    this.tail = null;
};

List.createItem = createItem;
List.prototype.createItem = createItem;

List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
    var cursor = this.cursor;

    while (cursor !== null) {
        if (cursor.prev === prevOld) {
            cursor.prev = prevNew;
        }

        if (cursor.next === nextOld) {
            cursor.next = nextNew;
        }

        cursor = cursor.cursor;
    }
};

List.prototype.getSize = function() {
    var size = 0;
    var cursor = this.head;

    while (cursor) {
        size++;
        cursor = cursor.next;
    }

    return size;
};

List.prototype.fromArray = function(array) {
    var cursor = null;

    this.head = null;

    for (var i = 0; i < array.length; i++) {
        var item = createItem(array[i]);

        if (cursor !== null) {
            cursor.next = item;
        } else {
            this.head = item;
        }

        item.prev = cursor;
        cursor = item;
    }

    this.tail = cursor;

    return this;
};

List.prototype.toArray = function() {
    var cursor = this.head;
    var result = [];

    while (cursor) {
        result.push(cursor.data);
        cursor = cursor.next;
    }

    return result;
};

List.prototype.toJSON = List.prototype.toArray;

List.prototype.isEmpty = function() {
    return this.head === null;
};

List.prototype.first = function() {
    return this.head && this.head.data;
};

List.prototype.last = function() {
    return this.tail && this.tail.data;
};

List.prototype.each = function(fn, context) {
    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, null, this.head);

    while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;

        fn.call(context, item.data, item, this);
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.forEach = List.prototype.each;

List.prototype.eachRight = function(fn, context) {
    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, this.tail, null);

    while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;

        fn.call(context, item.data, item, this);
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.forEachRight = List.prototype.eachRight;

List.prototype.nextUntil = function(start, fn, context) {
    if (start === null) {
        return;
    }

    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, null, start);

    while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;

        if (fn.call(context, item.data, item, this)) {
            break;
        }
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.prevUntil = function(start, fn, context) {
    if (start === null) {
        return;
    }

    var item;

    if (context === undefined) {
        context = this;
    }

    // push cursor
    var cursor = allocateCursor(this, start, null);

    while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;

        if (fn.call(context, item.data, item, this)) {
            break;
        }
    }

    // pop cursor
    releaseCursor(this);
};

List.prototype.some = function(fn, context) {
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
            return true;
        }

        cursor = cursor.next;
    }

    return false;
};

List.prototype.map = function(fn, context) {
    var result = new List();
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        result.appendData(fn.call(context, cursor.data, cursor, this));
        cursor = cursor.next;
    }

    return result;
};

List.prototype.filter = function(fn, context) {
    var result = new List();
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
            result.appendData(cursor.data);
        }
        cursor = cursor.next;
    }

    return result;
};

List.prototype.clear = function() {
    this.head = null;
    this.tail = null;
};

List.prototype.copy = function() {
    var result = new List();
    var cursor = this.head;

    while (cursor !== null) {
        result.insert(createItem(cursor.data));
        cursor = cursor.next;
    }

    return result;
};

List.prototype.prepend = function(item) {
    //      head
    //    ^
    // item
    this.updateCursors(null, item, this.head, item);

    // insert to the beginning of the list
    if (this.head !== null) {
        // new item <- first item
        this.head.prev = item;

        // new item -> first item
        item.next = this.head;
    } else {
        // if list has no head, then it also has no tail
        // in this case tail points to the new item
        this.tail = item;
    }

    // head always points to new item
    this.head = item;

    return this;
};

List.prototype.prependData = function(data) {
    return this.prepend(createItem(data));
};

List.prototype.append = function(item) {
    return this.insert(item);
};

List.prototype.appendData = function(data) {
    return this.insert(createItem(data));
};

List.prototype.insert = function(item, before) {
    if (before !== undefined && before !== null) {
        // prev   before
        //      ^
        //     item
        this.updateCursors(before.prev, item, before, item);

        if (before.prev === null) {
            // insert to the beginning of list
            if (this.head !== before) {
                throw new Error('before doesn\'t belong to list');
            }

            // since head points to before therefore list doesn't empty
            // no need to check tail
            this.head = item;
            before.prev = item;
            item.next = before;

            this.updateCursors(null, item);
        } else {

            // insert between two items
            before.prev.next = item;
            item.prev = before.prev;

            before.prev = item;
            item.next = before;
        }
    } else {
        // tail
        //      ^
        //      item
        this.updateCursors(this.tail, item, null, item);

        // insert to the ending of the list
        if (this.tail !== null) {
            // last item -> new item
            this.tail.next = item;

            // last item <- new item
            item.prev = this.tail;
        } else {
            // if list has no tail, then it also has no head
            // in this case head points to new item
            this.head = item;
        }

        // tail always points to new item
        this.tail = item;
    }

    return this;
};

List.prototype.insertData = function(data, before) {
    return this.insert(createItem(data), before);
};

List.prototype.remove = function(item) {
    //      item
    //       ^
    // prev     next
    this.updateCursors(item, item.prev, item, item.next);

    if (item.prev !== null) {
        item.prev.next = item.next;
    } else {
        if (this.head !== item) {
            throw new Error('item doesn\'t belong to list');
        }

        this.head = item.next;
    }

    if (item.next !== null) {
        item.next.prev = item.prev;
    } else {
        if (this.tail !== item) {
            throw new Error('item doesn\'t belong to list');
        }

        this.tail = item.prev;
    }

    item.prev = null;
    item.next = null;

    return item;
};

List.prototype.push = function(data) {
    this.insert(createItem(data));
};

List.prototype.pop = function() {
    if (this.tail !== null) {
        return this.remove(this.tail);
    }
};

List.prototype.unshift = function(data) {
    this.prepend(createItem(data));
};

List.prototype.shift = function() {
    if (this.head !== null) {
        return this.remove(this.head);
    }
};

List.prototype.prependList = function(list) {
    return this.insertList(list, this.head);
};

List.prototype.appendList = function(list) {
    return this.insertList(list);
};

List.prototype.insertList = function(list, before) {
    // ignore empty lists
    if (list.head === null) {
        return this;
    }

    if (before !== undefined && before !== null) {
        this.updateCursors(before.prev, list.tail, before, list.head);

        // insert in the middle of dist list
        if (before.prev !== null) {
            // before.prev <-> list.head
            before.prev.next = list.head;
            list.head.prev = before.prev;
        } else {
            this.head = list.head;
        }

        before.prev = list.tail;
        list.tail.next = before;
    } else {
        this.updateCursors(this.tail, list.tail, null, list.head);

        // insert to end of the list
        if (this.tail !== null) {
            // if destination list has a tail, then it also has a head,
            // but head doesn't change

            // dest tail -> source head
            this.tail.next = list.head;

            // dest tail <- source head
            list.head.prev = this.tail;
        } else {
            // if list has no a tail, then it also has no a head
            // in this case points head to new item
            this.head = list.head;
        }

        // tail always start point to new item
        this.tail = list.tail;
    }

    list.head = null;
    list.tail = null;

    return this;
};

List.prototype.replace = function(oldItem, newItemOrList) {
    if ('head' in newItemOrList) {
        this.insertList(newItemOrList, oldItem);
    } else {
        this.insert(newItemOrList, oldItem);
    }

    this.remove(oldItem);
};

module.exports = List;

},{}],231:[function(require,module,exports){
'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;
var keywords = Object.create(null);
var properties = Object.create(null);
var HYPHENMINUS = 45; // '-'.charCodeAt()

function isCustomProperty(str, offset) {
    offset = offset || 0;

    return str.length - offset >= 2 &&
           str.charCodeAt(offset) === HYPHENMINUS &&
           str.charCodeAt(offset + 1) === HYPHENMINUS;
}

function getVendorPrefix(str, offset) {
    offset = offset || 0;

    // verdor prefix should be at least 3 chars length
    if (str.length - offset >= 3) {
        // vendor prefix starts with hyper minus following non-hyper minus
        if (str.charCodeAt(offset) === HYPHENMINUS &&
            str.charCodeAt(offset + 1) !== HYPHENMINUS) {
            // vendor prefix should contain a hyper minus at the ending
            var secondDashIndex = str.indexOf('-', offset + 2);

            if (secondDashIndex !== -1) {
                return str.substring(offset, secondDashIndex + 1);
            }
        }
    }

    return '';
}

function getKeywordDescriptor(keyword) {
    if (hasOwnProperty.call(keywords, keyword)) {
        return keywords[keyword];
    }

    var name = keyword.toLowerCase();

    if (hasOwnProperty.call(keywords, name)) {
        return keywords[keyword] = keywords[name];
    }

    var custom = isCustomProperty(name, 0);
    var vendor = !custom ? getVendorPrefix(name, 0) : '';

    return keywords[keyword] = Object.freeze({
        basename: name.substr(vendor.length),
        name: name,
        vendor: vendor,
        prefix: vendor,
        custom: custom
    });
}

function getPropertyDescriptor(property) {
    if (hasOwnProperty.call(properties, property)) {
        return properties[property];
    }

    var name = property;
    var hack = property[0];

    if (hack === '/') {
        hack = property[1] === '/' ? '//' : '/';
    } else if (hack !== '_' &&
               hack !== '*' &&
               hack !== '$' &&
               hack !== '#' &&
               hack !== '+') {
        hack = '';
    }

    var custom = isCustomProperty(name, hack.length);

    // re-use result when possible (the same as for lower case)
    if (!custom) {
        name = name.toLowerCase();
        if (hasOwnProperty.call(properties, name)) {
            return properties[property] = properties[name];
        }
    }

    var vendor = !custom ? getVendorPrefix(name, hack.length) : '';
    var prefix = name.substr(0, hack.length + vendor.length);

    return properties[property] = Object.freeze({
        basename: name.substr(prefix.length),
        name: name.substr(hack.length),
        hack: hack,
        vendor: vendor,
        prefix: prefix,
        custom: custom
    });
}

module.exports = {
    keyword: getKeywordDescriptor,
    property: getPropertyDescriptor,
    isCustomProperty: isCustomProperty,
    vendorPrefix: getVendorPrefix
};

},{}],232:[function(require,module,exports){
'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;
var noop = function() {};

function ensureFunction(value) {
    return typeof value === 'function' ? value : noop;
}

function invokeForType(fn, type) {
    return function(node, item, list) {
        if (node.type === type) {
            fn.call(this, node, item, list);
        }
    };
}

function getWalkersFromStructure(name, nodeType) {
    var structure = nodeType.structure;
    var walkers = [];

    for (var key in structure) {
        if (hasOwnProperty.call(structure, key) === false) {
            continue;
        }

        var fieldTypes = structure[key];
        var walker = {
            name: key,
            type: false,
            nullable: false
        };

        if (!Array.isArray(structure[key])) {
            fieldTypes = [structure[key]];
        }

        for (var i = 0; i < fieldTypes.length; i++) {
            var fieldType = fieldTypes[i];
            if (fieldType === null) {
                walker.nullable = true;
            } else if (typeof fieldType === 'string') {
                walker.type = 'node';
            } else if (Array.isArray(fieldType)) {
                walker.type = 'list';
            }
        }

        if (walker.type) {
            walkers.push(walker);
        }
    }

    if (walkers.length) {
        return {
            context: nodeType.walkContext,
            fields: walkers
        };
    }

    return null;
}

function getTypesFromConfig(config) {
    var types = {};

    for (var name in config.node) {
        if (hasOwnProperty.call(config.node, name)) {
            var nodeType = config.node[name];

            if (!nodeType.structure) {
                throw new Error('Missed `structure` field in `' + name + '` node type definition');
            }

            types[name] = getWalkersFromStructure(name, nodeType);
        }
    }

    return types;
}

function createTypeIterator(config, reverse) {
    var fields = reverse ? config.fields.slice().reverse() : config.fields;
    var body = fields.map(function(field) {
        var ref = 'node.' + field.name;
        var line;

        if (field.type === 'list') {
            line = reverse
                ? ref + '.forEachRight(walk);'
                : ref + '.forEach(walk);';
        } else {
            line = 'walk(' + ref + ');';
        }

        if (field.nullable) {
            line = 'if (' + ref + ') {\n    ' + line + '}';
        }

        return line;
    });

    if (config.context) {
        body = [].concat(
            'var old = context.' + config.context + ';',
            'context.' + config.context + ' = node;',
            body,
            'context.' + config.context + ' = old;'
        );
    }

    return new Function('node', 'context', 'walk', body.join('\n'));
}

function createFastTraveralMap(iterators) {
    return {
        Atrule: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
        },
        Rule: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
        },
        Declaration: {
            StyleSheet: iterators.StyleSheet,
            Atrule: iterators.Atrule,
            Rule: iterators.Rule,
            Block: iterators.Block
        }
    };
}

module.exports = function createWalker(config) {
    var types = getTypesFromConfig(config);
    var iteratorsNatural = {};
    var iteratorsReverse = {};

    for (var name in types) {
        if (hasOwnProperty.call(types, name) && types[name] !== null) {
            iteratorsNatural[name] = createTypeIterator(types[name], false);
            iteratorsReverse[name] = createTypeIterator(types[name], true);
        }
    }

    var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
    var fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);

    return function walk(root, options) {
        function walkNode(node, item, list) {
            enter.call(context, node, item, list);

            if (iterators.hasOwnProperty(node.type)) {
                iterators[node.type](node, context, walkNode);
            }

            leave.call(context, node, item, list);
        }

        var enter = noop;
        var leave = noop;
        var iterators = iteratorsNatural;
        var context = {
            root: root,
            stylesheet: null,
            atrule: null,
            atrulePrelude: null,
            rule: null,
            selector: null,
            block: null,
            declaration: null,
            function: null
        };

        if (typeof options === 'function') {
            enter = options;
        } else if (options) {
            enter = ensureFunction(options.enter);
            leave = ensureFunction(options.leave);

            if (options.reverse) {
                iterators = iteratorsReverse;
            }

            if (options.visit) {
                if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
                    iterators = options.reverse
                        ? fastTraversalIteratorsReverse[options.visit]
                        : fastTraversalIteratorsNatural[options.visit];
                } else if (!types.hasOwnProperty(options.visit)) {
                    throw new Error('Bad value `' + options.visit + '` for `visit` option (should be: ' + Object.keys(types).join(', ') + ')');
                }

                enter = invokeForType(enter, options.visit);
                leave = invokeForType(leave, options.visit);
            }
        }

        if (enter === noop && leave === noop) {
            throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
        }

        // swap handlers in reverse mode to invert visit order
        if (options.reverse) {
            var tmp = enter;
            enter = leave;
            leave = tmp;
        }

        walkNode(root);
    };
};

},{}],233:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":250,"es5-ext/object/is-callable":253,"es5-ext/object/normalize-options":259,"es5-ext/string/#/contains":263}],234:[function(require,module,exports){
"use strict";

var numberIsNaN       = require("../../number/is-nan")
  , toPosInt          = require("../../number/to-pos-integer")
  , value             = require("../../object/valid-value")
  , indexOf           = Array.prototype.indexOf
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , abs               = Math.abs
  , floor             = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, length, fromIndex, val;
	if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

	length = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < length; ++i) {
		if (objHasOwnProperty.call(this, i)) {
			val = this[i];
			if (numberIsNaN(val)) return i; // Jslint: ignore
		}
	}
	return -1;
};

},{"../../number/is-nan":245,"../../number/to-pos-integer":249,"../../object/valid-value":262}],235:[function(require,module,exports){
"use strict";

var indexOf = require("./e-index-of")
  , forEach = Array.prototype.forEach
  , splice  = Array.prototype.splice;

// eslint-disable-next-line no-unused-vars
module.exports = function (itemToRemove /*, …item*/) {
	forEach.call(
		arguments,
		function (item) {
			var index = indexOf.call(this, item);
			if (index !== -1) splice.call(this, index, 1);
		},
		this
	);
};

},{"./e-index-of":234}],236:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Array.from
	: require("./shim");

},{"./is-implemented":237,"./shim":238}],237:[function(require,module,exports){
"use strict";

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === "dwa"));
};

},{}],238:[function(require,module,exports){
"use strict";

var iteratorSymbol = require("es6-symbol").iterator
  , isArguments    = require("../../function/is-arguments")
  , isFunction     = require("../../function/is-function")
  , toPosInt       = require("../../number/to-pos-integer")
  , callable       = require("../../object/valid-callable")
  , validValue     = require("../../object/valid-value")
  , isValue        = require("../../object/is-value")
  , isString       = require("../../string/is-string")
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity
module.exports = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(length = arrayLike.length);
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};

},{"../../function/is-arguments":239,"../../function/is-function":240,"../../number/to-pos-integer":249,"../../object/is-value":255,"../../object/valid-callable":260,"../../object/valid-value":262,"../../string/is-string":266,"es6-symbol":267}],239:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString
  , id = objToString.call(
	(function () {
		return arguments;
	})()
);

module.exports = function (value) {
	return objToString.call(value) === id;
};

},{}],240:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call(require("./noop"));

module.exports = function (value) {
	return typeof value === "function" && objToString.call(value) === id;
};

},{"./noop":241}],241:[function(require,module,exports){
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],242:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Math.sign
	: require("./shim");

},{"./is-implemented":243,"./shim":244}],243:[function(require,module,exports){
"use strict";

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return (sign(10) === 1) && (sign(-20) === -1);
};

},{}],244:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return value > 0 ? 1 : -1;
};

},{}],245:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Number.isNaN
	: require("./shim");

},{"./is-implemented":246,"./shim":247}],246:[function(require,module,exports){
"use strict";

module.exports = function () {
	var numberIsNaN = Number.isNaN;
	if (typeof numberIsNaN !== "function") return false;
	return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};

},{}],247:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	// eslint-disable-next-line no-self-compare
	return value !== value;
};

},{}],248:[function(require,module,exports){
"use strict";

var sign = require("../math/sign")

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":242}],249:[function(require,module,exports){
"use strict";

var toInteger = require("./to-integer")

  , max = Math.max;

module.exports = function (value) {
 return max(0, toInteger(value));
};

},{"./to-integer":248}],250:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.assign
	: require("./shim");

},{"./is-implemented":251,"./shim":252}],251:[function(require,module,exports){
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

},{}],252:[function(require,module,exports){
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":256,"../valid-value":262}],253:[function(require,module,exports){
// Deprecated

"use strict";

module.exports = function (obj) {
 return typeof obj === "function";
};

},{}],254:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var map = { function: true, object: true };

module.exports = function (value) {
	return (isValue(value) && map[typeof value]) || false;
};

},{"./is-value":255}],255:[function(require,module,exports){
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};

},{"../function/noop":241}],256:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")() ? Object.keys : require("./shim");

},{"./is-implemented":257,"./shim":258}],257:[function(require,module,exports){
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
		return false;
	}
};

},{}],258:[function(require,module,exports){
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) { return keys(isValue(object) ? Object(object) : object); };

},{"../is-value":255}],259:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":255}],260:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],261:[function(require,module,exports){
"use strict";

var isObject = require("./is-object");

module.exports = function (value) {
	if (!isObject(value)) throw new TypeError(value + " is not an Object");
	return value;
};

},{"./is-object":254}],262:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":255}],263:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.contains
	: require("./shim");

},{"./is-implemented":264,"./shim":265}],264:[function(require,module,exports){
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

},{}],265:[function(require,module,exports){
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],266:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};

},{}],267:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":268,"./polyfill":270}],268:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],269:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],270:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not (or partially) support it

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":271,"d":233}],271:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":269}],272:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":233,"es5-ext/object/valid-callable":260}],273:[function(require,module,exports){
'use strict';

var aFrom          = require('es5-ext/array/from')
  , remove         = require('es5-ext/array/#/remove')
  , value          = require('es5-ext/object/valid-object')
  , d              = require('d')
  , emit           = require('./').methods.emit

  , defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

module.exports = function (e1, e2/*, name*/) {
	var pipes, pipe, desc, name;

	(value(e1) && value(e2));
	name = arguments[2];
	if (name === undefined) name = 'emit';

	pipe = {
		close: function () { remove.call(pipes, e2); }
	};
	if (hasOwnProperty.call(e1, '__eePipes__')) {
		(pipes = e1.__eePipes__).push(e2);
		return pipe;
	}
	defineProperty(e1, '__eePipes__', d('c', pipes = [e2]));
	desc = getOwnPropertyDescriptor(e1, name);
	if (!desc) {
		desc = d('c', undefined);
	} else {
		delete desc.get;
		delete desc.set;
	}
	desc.value = function () {
		var i, emitter, data = aFrom(pipes);
		emit.apply(this, arguments);
		for (i = 0; (emitter = data[i]); ++i) emit.apply(emitter, arguments);
	};
	defineProperty(e1, name, desc);
	return pipe;
};

},{"./":272,"d":233,"es5-ext/array/#/remove":235,"es5-ext/array/from":236,"es5-ext/object/valid-object":261}],274:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _asyncGenerator2 = require("babel-runtime/helpers/asyncGenerator");

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _page = require("./page");

var _page2 = _interopRequireDefault(_page);

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _hook = require("../utils/hook");

var _hook2 = _interopRequireDefault(_hook);

var _dom = require("../utils/dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_PAGES = false;

var TEMPLATE = "<div class=\"pagedjs_page\">\n\t<div class=\"pagedjs_margin-top-left-corner-holder\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-top-left-corner\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-top\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-top-left\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-top-center\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-top-right\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-top-right-corner-holder\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-top-right-corner\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-right\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-right-top\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-right-middle\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-right-bottom\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-left\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-left-top\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-left-middle\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-left-bottom\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-bottom-left-corner-holder\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-bottom-left-corner\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-bottom\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-bottom-left\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-bottom-center\"><div class=\"pagedjs_margin-content\"></div></div>\n\t\t<div class=\"pagedjs_margin pagedjs_margin-bottom-right\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_margin-bottom-right-corner-holder\">\n\t\t<div class=\"pagedjs_margin pagedjs_margin-bottom-right-corner\"><div class=\"pagedjs_margin-content\"></div></div>\n\t</div>\n\t<div class=\"pagedjs_area\">\n\t\t<div class=\"pagedjs_page_content\">\n\n\t\t</div>\n\t</div>\n</div>";

var _requestIdleCallback = 'requestIdleCallback' in window ? requestIdleCallback : requestAnimationFrame;

/**
 * Chop up text into flows
 * @class
 */

var Chunker = function () {
	function Chunker(content, renderTo) {
		(0, _classCallCheck3.default)(this, Chunker);

		// this.preview = preview;

		this.hooks = {};
		this.hooks.beforeParsed = new _hook2.default(this);
		this.hooks.afterParsed = new _hook2.default(this);
		this.hooks.beforePageLayout = new _hook2.default(this);
		this.hooks.layout = new _hook2.default(this);
		this.hooks.renderNode = new _hook2.default(this);
		this.hooks.layoutNode = new _hook2.default(this);
		this.hooks.overflow = new _hook2.default(this);
		this.hooks.afterPageLayout = new _hook2.default(this);
		this.hooks.afterRendered = new _hook2.default(this);

		this.pages = [];
		this._total = 0;

		this.content = content;

		if (content) {
			this.flow(content, renderTo);
		}
	}

	(0, _createClass3.default)(Chunker, [{
		key: "setup",
		value: function setup(renderTo) {
			this.pagesArea = document.createElement("div");
			this.pagesArea.classList.add("pagedjs_pages");

			if (renderTo) {
				renderTo.appendChild(this.pagesArea);
			} else {
				document.querySelector("body").appendChild(this.pagesArea);
			}

			this.pageTemplate = document.createElement("template");
			this.pageTemplate.innerHTML = TEMPLATE;
		}
	}, {
		key: "flow",
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(content, renderTo) {
				var parsed;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								parsed = void 0;
								_context.next = 3;
								return this.hooks.beforeParsed.trigger(content, this);

							case 3:

								parsed = new _parser2.default(content);

								this.source = parsed;

								this.setup(renderTo);

								this.emit("rendering", content);

								_context.next = 9;
								return this.hooks.afterParsed.trigger(parsed, this);

							case 9:
								_context.next = 11;
								return this.render(parsed, renderTo);

							case 11:
								_context.next = 13;
								return this.hooks.afterRendered.trigger(this.pages, this);

							case 13:

								this.emit("rendered", this.pages);

								return _context.abrupt("return", this);

							case 15:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function flow(_x, _x2) {
				return _ref.apply(this, arguments);
			}

			return flow;
		}()
	}, {
		key: "render",
		value: function () {
			var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(parsed, renderTo) {
				var renderer, done, result;
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								renderer = this.layout(parsed);
								done = false;
								result = void 0;

							case 3:
								if (done) {
									_context2.next = 10;
									break;
								}

								_context2.next = 6;
								return this.renderOnIdle(renderer);

							case 6:
								result = _context2.sent;

								done = result.done;
								_context2.next = 3;
								break;

							case 10:
								return _context2.abrupt("return", this);

							case 11:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function render(_x3, _x4) {
				return _ref2.apply(this, arguments);
			}

			return render;
		}()
	}, {
		key: "renderOnIdle",
		value: function renderOnIdle(renderer) {
			return new _promise2.default(function (resolve) {
				_requestIdleCallback(function () {
					var result = renderer.next();
					resolve(result);
				});
			});
		}
	}, {
		key: "handleBreaks",
		value: function () {
			var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(node) {
				var currentPage, currentPosition, currentSide, previousBreakAfter, breakBefore, page;
				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								currentPage = this.total + 1;
								currentPosition = currentPage % 2 === 0 ? "left" : "right";
								// TODO: Recto and Verso should reverse for rtl languages

								currentSide = currentPage % 2 === 0 ? "verso" : "recto";
								previousBreakAfter = void 0;
								breakBefore = void 0;
								page = void 0;

								if (!(currentPage === 1)) {
									_context3.next = 8;
									break;
								}

								return _context3.abrupt("return");

							case 8:

								if (node && typeof node.dataset !== "undefined" && typeof node.dataset.previousBreakAfter !== "undefined") {
									previousBreakAfter = node.dataset.previousBreakAfter;
								}

								if (node && typeof node.dataset !== "undefined" && typeof node.dataset.breakBefore !== "undefined") {
									breakBefore = node.dataset.breakBefore;
								}

								if (previousBreakAfter && (previousBreakAfter === "left" || previousBreakAfter === "right") && previousBreakAfter !== currentPosition) {
									page = this.addPage(true);
								} else if (previousBreakAfter && (previousBreakAfter === "verso" || previousBreakAfter === "recto") && previousBreakAfter !== currentSide) {
									page = this.addPage(true);
								} else if (breakBefore && (breakBefore === "left" || breakBefore === "right") && breakBefore !== currentPosition) {
									page = this.addPage(true);
								} else if (breakBefore && (breakBefore === "verso" || breakBefore === "recto") && breakBefore !== currentSide) {
									page = this.addPage(true);
								}

								if (!page) {
									_context3.next = 18;
									break;
								}

								_context3.next = 14;
								return this.hooks.beforePageLayout.trigger(page, undefined, undefined, this);

							case 14:
								this.emit("page", page);
								// await this.hooks.layout.trigger(page.element, page, undefined, this);
								_context3.next = 17;
								return this.hooks.afterPageLayout.trigger(page.element, page, undefined, this);

							case 17:
								this.emit("renderedPage", page);

							case 18:
							case "end":
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function handleBreaks(_x5) {
				return _ref3.apply(this, arguments);
			}

			return handleBreaks;
		}()
	}, {
		key: "layout",
		value: function () {
			var _ref4 = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee4(content) {
				var breakToken, page;
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								breakToken = false;

							case 1:
								if (!(breakToken !== undefined && (MAX_PAGES ? this.total < MAX_PAGES : true))) {
									_context4.next = 21;
									break;
								}

								if (!(breakToken && breakToken.node)) {
									_context4.next = 7;
									break;
								}

								_context4.next = 5;
								return _asyncGenerator3.default.await(this.handleBreaks(breakToken.node));

							case 5:
								_context4.next = 9;
								break;

							case 7:
								_context4.next = 9;
								return _asyncGenerator3.default.await(this.handleBreaks(content.firstChild));

							case 9:
								page = this.addPage();
								_context4.next = 12;
								return _asyncGenerator3.default.await(this.hooks.beforePageLayout.trigger(page, content, breakToken, this));

							case 12:
								this.emit("page", page);

								// Layout content in the page, starting from the breakToken
								breakToken = page.layout(content, breakToken);

								// await this.hooks.layout.trigger(page.element, page, breakToken, this);

								_context4.next = 16;
								return _asyncGenerator3.default.await(this.hooks.afterPageLayout.trigger(page.element, page, breakToken, this));

							case 16:
								this.emit("renderedPage", page);

								_context4.next = 19;
								return breakToken;

							case 19:
								_context4.next = 1;
								break;

							case 21:

								this.rendered = true;

							case 22:
							case "end":
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function layout(_x6) {
				return _ref4.apply(this, arguments);
			}

			return layout;
		}()
	}, {
		key: "addPage",
		value: function addPage(blank) {
			var _this = this;

			var lastPage = this.pages[this.pages.length - 1];
			// Create a new page from the template
			var page = new _page2.default(this.pagesArea, this.pageTemplate, blank, this.hooks);
			var total = this.pages.push(page);

			// Create the pages
			page.create(undefined, lastPage && lastPage.element);

			page.index(this.total);

			if (!blank) {
				// Listen for page overflow
				page.onOverflow(function (overflowToken) {
					// console.log("overflow on", page.id, overflowToken);
					var index = _this.pages.indexOf(page) + 1;
					if (index < _this.pages.length && (_this.pages[index].breakBefore || _this.pages[index].previousBreakAfter)) {
						var newPage = _this.insertPage(index - 1);
						newPage.layout(_this.source, overflowToken);
					} else if (index < _this.pages.length) {
						_this.pages[index].layout(_this.source, overflowToken);
					} else {
						var _newPage = _this.addPage();
						_newPage.layout(_this.source, overflowToken);
					}
				});

				page.onUnderflow(function (overflowToken) {
					// console.log("underflow on", page.id, overflowToken);

					// page.append(this.source, overflowToken);

				});
			}

			this.total += 1;

			return page;
		}
	}, {
		key: "insertPage",
		value: function insertPage(index, blank) {
			var _this2 = this;

			var lastPage = this.pages[index];
			// Create a new page from the template
			var page = new _page2.default(this.pagesArea, this.pageTemplate, blank, this.hooks);

			var total = this.pages.splice(index, 0, page);

			// Create the pages
			page.create(undefined, lastPage && lastPage.element);

			page.index(index + 1);

			for (var i = index + 2; i < this.pages.length; i++) {
				this.pages[i].index(i);
			}

			if (!blank) {
				// Listen for page overflow
				page.onOverflow(function (overflowToken) {
					if (total < _this2.pages.length) {
						_this2.pages[total].layout(_this2.source, overflowToken);
					} else {
						var newPage = _this2.addPage();
						newPage.layout(_this2.source, overflowToken);
					}
				});

				page.onUnderflow(function () {
					// console.log("underflow on", page.id);
				});
			}

			this.total += 1;

			return page;
		}
	}, {
		key: "destroy",
		value: function destroy() {
			this.pagesArea.remove();
			this.pageTemplate.remove();
		}
	}, {
		key: "total",
		get: function get() {
			return this._total;
		},
		set: function set(num) {
			this.pagesArea.style.setProperty('--page-count', num);
			this._total = num;
		}
	}]);
	return Chunker;
}();

(0, _eventEmitter2.default)(Chunker.prototype);

exports.default = Chunker;
},{"../utils/dom":295,"../utils/hook":297,"./page":276,"./parser":277,"babel-runtime/core-js/promise":9,"babel-runtime/helpers/asyncGenerator":12,"babel-runtime/helpers/asyncToGenerator":13,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/regenerator":20,"event-emitter":272}],275:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require("../utils/utils");

var _dom = require("../utils/dom");

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _hook = require("../utils/hook");

var _hook2 = _interopRequireDefault(_hook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _requestIdleCallback = 'requestIdleCallback' in window ? requestIdleCallback : requestAnimationFrame;

var PER_PAGE_CHECK = 4;

/**
 * Layout
 * @class
 */

var Layout = function () {
  function Layout(element, hooks) {
    (0, _classCallCheck3.default)(this, Layout);

    this.element = element;

    this.bounds = this.element.getBoundingClientRect();

    if (hooks) {
      this.hooks = hooks;
    } else {
      this.hooks = {};
      this.hooks.layout = new _hook2.default();
      this.hooks.renderNode = new _hook2.default();
      this.hooks.layoutNode = new _hook2.default();
      this.hooks.overflow = new _hook2.default();
    }
  }

  (0, _createClass3.default)(Layout, [{
    key: "renderTo",
    value: function renderTo(wrapper, source, breakToken) {
      var bounds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.bounds;

      var start = this.getStart(source, breakToken);
      var walker = (0, _dom.walk)(start, source);

      var node = void 0;
      var done = void 0;
      var next = void 0;

      var hasContent = false;
      var newBreakToken = void 0;

      var check = 0;

      while (!done && !newBreakToken) {
        next = walker.next();
        node = next.value;
        done = next.done;

        if (!node) {
          newBreakToken = this.findBreakToken(wrapper, source, bounds);
          return newBreakToken;
        }

        /*
        let exists;
        if (isElement(node)) {
          exists = findElement(node, wrapper);
        } else {
          exists = false;
        }
         if (exists) {
          console.log("found", exists);
          break;
        }
        */

        this.hooks && this.hooks.layoutNode.trigger(node);

        // Check if the rendered element has a break set
        if (hasContent && this.shouldBreak(node)) {
          newBreakToken = this.findBreakToken(wrapper, source, bounds);

          if (!newBreakToken) {
            newBreakToken = this.breakAt(node);
          }

          break;
        }

        // Should the Node be a shallow or deep clone
        var shallow = (0, _dom.isContainer)(node);

        var rendered = this.append(node, wrapper, breakToken, shallow);

        // Check if layout has content yet
        if (!hasContent) {
          hasContent = (0, _dom.isVisible)(node);
        }

        // Skip to the next node if a deep clone was rendered
        if (!shallow) {
          walker = (0, _dom.walk)((0, _dom.nodeAfter)(node, source), source);
        }

        // Only check every few elements
        if (check >= PER_PAGE_CHECK) {
          check = 0;

          this.hooks && this.hooks.layout.trigger(wrapper, this);

          newBreakToken = this.findBreakToken(wrapper, source, bounds);
        }

        check += 1;
      }

      return newBreakToken;
    }
  }, {
    key: "breakAt",
    value: function breakAt(node) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      return {
        node: node,
        offset: offset
      };
    }
  }, {
    key: "shouldBreak",
    value: function shouldBreak(node) {
      return (0, _dom.needsBreakBefore)(node) || (0, _dom.needsPreviousBreakAfter)(node) || (0, _dom.needsPageBreak)(node);
    }
  }, {
    key: "getStart",
    value: function getStart(source, breakToken) {
      var start = void 0;
      var node = breakToken && breakToken.node;

      if (node) {
        start = node;
      } else {
        start = source.firstChild;
      }

      return start;
    }
  }, {
    key: "append",
    value: function append(node, dest, breakToken) {
      var shallow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var rebuild = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;


      var clone = (0, _dom.cloneNode)(node, !shallow);

      if (node.parentNode && (0, _dom.isElement)(node.parentNode)) {
        var parent = (0, _dom.findElement)(node.parentNode, dest);
        // Rebuild chain
        if (parent) {
          parent.appendChild(clone);
        } else if (rebuild) {
          var fragment = (0, _dom.rebuildAncestors)(node);
          parent = (0, _dom.findElement)(node.parentNode, fragment);
          if (!parent) {
            dest.appendChild(clone);
          } else if (breakToken && (0, _dom.isText)(breakToken.node) && breakToken.offset > 0) {
            clone.textContent = clone.textContent.substring(breakToken.offset);
            parent.appendChild(clone);
          } else {
            parent.appendChild(clone);
          }

          dest.appendChild(fragment);
        } else {
          dest.appendChild(clone);
        }
      } else {
        dest.appendChild(clone);
      }

      this.hooks && this.hooks.renderNode.trigger(clone);

      return clone;
    }
  }, {
    key: "avoidBreakInside",
    value: function avoidBreakInside(node, limiter) {
      var breakNode = void 0;

      if (node === limiter) {
        return;
      }

      while (node.parentNode) {
        node = node.parentNode;

        if (node === limiter) {
          break;
        }

        if (window.getComputedStyle(node)["break-inside"] === "avoid") {
          breakNode = node;
          break;
        }
      }
      return breakNode;
    }
  }, {
    key: "createBreakToken",
    value: function createBreakToken(overflow, rendered, source) {
      var container = overflow.startContainer;
      var offset = overflow.startOffset;
      var node = void 0,
          renderedNode = void 0,
          ref = void 0,
          parent = void 0,
          index = void 0,
          temp = void 0,
          startOffset = void 0;

      if ((0, _dom.isElement)(container)) {
        temp = (0, _dom.child)(container, offset);

        if ((0, _dom.isElement)(temp)) {
          renderedNode = (0, _dom.findElement)(temp, rendered);

          if (!renderedNode) {
            // Find closest element with data-ref
            renderedNode = (0, _dom.findElement)((0, _dom.prevValidNode)(temp), rendered);
            return;
          }

          node = (0, _dom.findElement)(renderedNode, source);
          offset = 0;
        } else {
          renderedNode = (0, _dom.findElement)(container, rendered);

          if (!renderedNode) {
            renderedNode = (0, _dom.findElement)((0, _dom.prevValidNode)(container), rendered);
          }

          parent = (0, _dom.findElement)(renderedNode, source);
          index = (0, _dom.indexOf)(temp);
          node = (0, _dom.child)(parent, index);
          offset = 0;
        }
      } else {
        renderedNode = (0, _dom.findElement)(container.parentNode, rendered);

        if (!renderedNode) {
          renderedNode = (0, _dom.findElement)((0, _dom.prevValidNode)(container.parentNode), rendered);
        }

        parent = (0, _dom.findElement)(renderedNode, source);
        index = (0, _dom.indexOf)(container);
        node = (0, _dom.child)(parent, index);
        startOffset = container.textContent.slice(offset);
        offset = parent.textContent.indexOf(startOffset);
      }

      if (!node) {
        return;
      }

      return {
        node: node,
        offset: offset
      };
    }
  }, {
    key: "findBreakToken",
    value: function findBreakToken(rendered, source) {
      var bounds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bounds;
      var extract = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var overflow = this.findOverflow(rendered, bounds);
      var breakToken = void 0;

      if (overflow) {
        breakToken = this.createBreakToken(overflow, rendered, source);

        if (breakToken && breakToken.node && extract) {
          this.removeOverflow(overflow);
        }
      }
      return breakToken;
    }
  }, {
    key: "hasOverflow",
    value: function hasOverflow(element) {
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bounds;

      var constrainingElement = element.parentNode; // this gets the element, instead of the wrapper for the width workaround

      var _element$getBoundingC = element.getBoundingClientRect(),
          width = _element$getBoundingC.width;

      var scrollWidth = constrainingElement.scrollWidth;

      return Math.max(Math.floor(width), scrollWidth) > Math.round(bounds.width);
    }
  }, {
    key: "findOverflow",
    value: function findOverflow(rendered) {
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.bounds;

      if (!this.hasOverflow(rendered, bounds)) return;

      var start = Math.round(bounds.left);
      var end = Math.round(bounds.right);
      var range = void 0;

      var walker = (0, _dom.walk)(rendered.firstChild, rendered);

      // Find Start
      var startContainer = void 0,
          startOffset = void 0;
      var next = void 0,
          done = void 0,
          node = void 0,
          offset = void 0,
          skip = void 0;
      while (!done) {
        next = walker.next();
        done = next.done;
        node = next.value;
        skip = false;

        if (node) {
          var pos = (0, _utils.getBoundingClientRect)(node);
          var left = Math.floor(pos.left);
          var right = Math.floor(pos.right);

          if (!range && left >= end) {
            // Check if it is a float
            var isFloat = false;
            if ((0, _dom.isElement)(node)) {
              var styles = window.getComputedStyle(node);
              isFloat = styles.getPropertyValue("float") !== "none";
              skip = window.getComputedStyle(node)["break-inside"] === "avoid";
            }

            if (!isFloat && (0, _dom.isElement)(node)) {
              range = document.createRange();
              range.setStartBefore(node);
              break;
            }

            if ((0, _dom.isText)(node) && node.textContent.trim().length) {
              range = document.createRange();
              range.setStartBefore(node);
              break;
            }
          }

          if (!range && (0, _dom.isText)(node) && right > end && node.textContent.trim().length && window.getComputedStyle(node.parentNode)["break-inside"] !== "avoid") {
            range = document.createRange();
            offset = this.textBreak(node, start, end);
            if (!offset) {
              range = undefined;
            } else {
              range.setStart(node, offset);
            }
            break;
          }

          // Skip children
          if (skip || right < end) {

            next = (0, _dom.nodeAfter)(node, rendered);
            if (next) {
              walker = (0, _dom.walk)(next, rendered);
            }
          }
        }
      }

      // Find End
      if (range) {
        range.setEndAfter(rendered.lastChild);
        return range;
      }
    }
  }, {
    key: "findEndToken",
    value: function findEndToken(rendered, source) {
      var bounds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.bounds;

      if (rendered.childNodes.length === 0) {
        return;
      }

      var lastChild = rendered.lastChild;

      var lastNodeIndex = void 0;
      while (lastChild && lastChild.lastChild) {
        if (!(0, _dom.validNode)(lastChild)) {
          // Only get elements with refs
          lastChild = lastChild.previousSibling;
        } else if (!(0, _dom.validNode)(lastChild.lastChild)) {
          // Deal with invalid dom items
          lastChild = (0, _dom.prevValidNode)(lastChild.lastChild);
          break;
        } else {
          lastChild = lastChild.lastChild;
        }
      }

      if ((0, _dom.isText)(lastChild)) {

        if (lastChild.parentNode.dataset.ref) {
          lastNodeIndex = (0, _dom.indexOf)(lastChild);
          lastChild = lastChild.parentNode;
        } else {
          lastChild = lastChild.previousSibling;
        }
      }

      var original = (0, _dom.findElement)(lastChild, source);

      if (lastNodeIndex) {
        original = original.childNodes[lastNodeIndex];
      }

      var after = (0, _dom.nodeAfter)(original);

      return this.breakAt(after);
    }
  }, {
    key: "textBreak",
    value: function textBreak(node, start, end) {
      var wordwalker = (0, _dom.words)(node);
      var left = 0;
      var right = 0;
      var word = void 0,
          next = void 0,
          done = void 0,
          pos = void 0;
      var offset = void 0;
      while (!done) {
        next = wordwalker.next();
        word = next.value;
        done = next.done;

        if (!word) {
          break;
        }

        pos = (0, _utils.getBoundingClientRect)(word);

        left = Math.floor(pos.left);
        right = Math.floor(pos.right);

        if (left >= end) {
          offset = word.startOffset;
          break;
        }

        if (right > end) {
          var letterwalker = (0, _dom.letters)(word);
          var letter = void 0,
              nextLetter = void 0,
              doneLetter = void 0,
              posLetter = void 0;

          while (!doneLetter) {
            nextLetter = letterwalker.next();
            letter = nextLetter.value;
            doneLetter = nextLetter.done;

            if (!letter) {
              break;
            }

            pos = (0, _utils.getBoundingClientRect)(letter);
            left = Math.floor(pos.left);

            if (left >= end) {
              offset = letter.startOffset;
              done = true;

              break;
            }
          }
        }
      }

      return offset;
    }
  }, {
    key: "removeOverflow",
    value: function removeOverflow(overflow) {
      this.hyphenateAtBreak(overflow);

      return overflow.extractContents();
    }
  }, {
    key: "hyphenateAtBreak",
    value: function hyphenateAtBreak(overflow) {
      if ((0, _dom.isText)(overflow.startContainer) && overflow.startOffset > 0) {
        var startText = overflow.startContainer.textContent;
        var startOffset = overflow.startOffset;
        var prevLetter = startText[startOffset - 1];

        // Add a hyphen if previous character is a letter or soft hyphen
        if (/^\w|\u00AD$/.test(prevLetter)) {
          overflow.startContainer.textContent = startText.slice(0, startOffset) + "\u2010";
          overflow.setStart(overflow.startContainer, startOffset + 1);
        }
      }
    }
  }]);
  return Layout;
}();

(0, _eventEmitter2.default)(Layout.prototype);

exports.default = Layout;
},{"../utils/dom":295,"../utils/hook":297,"../utils/utils":298,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"event-emitter":272}],276:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _layout = require("./layout");

var _layout2 = _interopRequireDefault(_layout);

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Render a page
 * @class
 */
var Page = function () {
  function Page(pagesArea, pageTemplate, blank, hooks) {
    (0, _classCallCheck3.default)(this, Page);

    this.pagesArea = pagesArea;
    this.pageTemplate = pageTemplate;
    this.blank = blank;

    // this.mapper = new Mapping(undefined, undefined, undefined, true);

    this.width = undefined;
    this.height = undefined;

    this.hooks = hooks;

    // this.element = this.create(this.pageTemplate);
  }

  (0, _createClass3.default)(Page, [{
    key: "create",
    value: function create(template, after) {
      //let documentFragment = document.createRange().createContextualFragment( TEMPLATE );
      //let page = documentFragment.children[0];
      var clone = document.importNode(this.pageTemplate.content, true);

      var page = void 0;
      if (after) {
        this.pagesArea.insertBefore(clone, after.nextSibling);
        var index = Array.prototype.indexOf.call(this.pagesArea.children, after.nextSibling);
        page = this.pagesArea.children[index];
      } else {
        this.pagesArea.appendChild(clone);
        page = this.pagesArea.lastChild;
      }

      var area = page.querySelector(".pagedjs_page_content");

      var size = area.getBoundingClientRect();

      area.style.columnWidth = Math.round(size.width) + "px";
      area.style.columnGap = "calc(var(--margin-right) + var(--margin-left))";
      // area.style.overflow = "scroll";

      this.width = Math.round(size.width);
      this.height = Math.round(size.height);

      this.element = page;
      this.area = area;

      return page;
    }
  }, {
    key: "createWrapper",
    value: function createWrapper() {
      var wrapper = document.createElement("div");

      this.area.appendChild(wrapper);

      this.wrapper = wrapper;

      return wrapper;
    }
  }, {
    key: "index",
    value: function index(pgnum) {
      this.position = pgnum;

      var page = this.element;

      var id = "page-" + (pgnum + 1);

      this.id = id;

      page.dataset.pageNumber = pgnum + 1;

      if (this.name) {
        page.classList.add("pagedjs_" + this.name + "_page");
      }

      if (this.blank) {
        page.classList.add("pagedjs_blank_page");
      }

      if (pgnum === 0) {
        page.classList.add("pagedjs_first_page");
      }

      if (pgnum % 2 !== 1) {
        page.classList.remove("pagedjs_left_page");
        page.classList.add("pagedjs_right_page");
      } else {
        page.classList.remove("pagedjs_right_page");
        page.classList.add("pagedjs_left_page");
      }
    }

    /*
    size(width, height) {
      if (width === this.width && height === this.height) {
        return;
      }
      this.width = width;
      this.height = height;
       this.element.style.width = Math.round(width) + "px";
      this.element.style.height = Math.round(height) + "px";
      this.element.style.columnWidth = Math.round(width) + "px";
    }
    */

  }, {
    key: "layout",
    value: function layout(contents, breakToken) {
      // console.log("layout page", this.id);
      this.clear();

      this.layoutMethod = new _layout2.default(this.area, this.hooks);

      breakToken = this.layoutMethod.renderTo(this.wrapper, contents, breakToken);

      this.addListeners(contents);

      return breakToken;
    }
  }, {
    key: "append",
    value: function append(contents, breakToken) {

      if (!this.layoutMethod) {
        return this.layout(contents, breakToken);
      }

      breakToken = this.layoutMethod.renderTo(this.wrapper, contents, breakToken);

      return breakToken;
    }
  }, {
    key: "getByParent",
    value: function getByParent(ref, entries) {
      var e = void 0;
      for (var i = 0; i < entries.length; i++) {
        e = entries[i];
        if (e.dataset.ref === ref) {
          return e;
          break;
        }
      }
    }
  }, {
    key: "onOverflow",
    value: function onOverflow(func) {
      this._onOverflow = func;
    }
  }, {
    key: "onUnderflow",
    value: function onUnderflow(func) {
      this._onUnderflow = func;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.removeListeners();
      this.wrapper && this.wrapper.remove();
      this.createWrapper();
    }
  }, {
    key: "addListeners",
    value: function addListeners(contents) {
      var _this = this;

      if (typeof ResizeObserver !== "undefined") {
        this.addResizeObserver(contents);
      } else {
        this.element.addEventListener("overflow", this.checkOverflowAfterResize.bind(this, contents), false);
        this.element.addEventListener("underflow", this.checkOverflowAfterResize.bind(this, contents), false);
      }
      // TODO: fall back to mutation observer?


      // Key scroll width from changing
      this.element.addEventListener("scroll", function () {
        if (_this.listening) {
          _this.element.scrollLeft = 0;
        }
      });

      this.listening = true;

      return true;
    }
  }, {
    key: "removeListeners",
    value: function removeListeners() {
      this.listening = false;
      // clearTimeout(this.timeoutAfterResize);

      if (this.element) {
        this.element.removeEventListener("overflow", this.checkOverflowAfterResize.bind(this), false);
        this.element.removeEventListener("underflow", this.checkOverflowAfterResize.bind(this), false);
      }

      if (this.ro) {
        this.ro.disconnect();
      }
    }
  }, {
    key: "addResizeObserver",
    value: function addResizeObserver(contents) {
      var _this2 = this;

      var wrapper = this.wrapper;
      var prevHeight = wrapper.getBoundingClientRect().height;
      this.ro = new ResizeObserver(function (entries) {

        if (!_this2.listening) {
          return;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(entries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var entry = _step.value;

            var cr = entry.contentRect;

            if (cr.height > prevHeight) {
              _this2.checkOverflowAfterResize(contents);
              prevHeight = wrapper.getBoundingClientRect().height;
            } else if (cr.height < prevHeight) {
              // TODO: calc line height && (prevHeight - cr.height) >= 22
              _this2.checkUnderflowAfterResize(contents);
              prevHeight = cr.height;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });

      this.ro.observe(wrapper);
    }
  }, {
    key: "checkOverflowAfterResize",
    value: function checkOverflowAfterResize(contents) {
      if (!this.listening || !this.layoutMethod) {
        return;
      }

      var newBreakToken = this.layoutMethod.findBreakToken(this.wrapper, contents);

      if (newBreakToken) {
        this._onOverflow && this._onOverflow(newBreakToken);
      }
    }
  }, {
    key: "checkUnderflowAfterResize",
    value: function checkUnderflowAfterResize(contents) {
      if (!this.listening || !this.layoutMethod) {
        return;
      }

      var endToken = this.layoutMethod.findEndToken(this.wrapper, contents);

      // let newBreakToken = this.layoutMethod.findBreakToken(this.wrapper, contents);

      if (endToken) {
        this._onUnderflow && this._onUnderflow(endToken);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.removeListeners();

      this.element = undefined;
      this.wrapper = undefined;
    }
  }]);
  return Page;
}();

(0, _eventEmitter2.default)(Page.prototype);

exports.default = Page;
},{"./layout":275,"babel-runtime/core-js/get-iterator":2,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"event-emitter":272}],277:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require("../utils/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Render a flow of text offscreen
 * @class
 */
var ContentParser = function () {
	function ContentParser(content, cb) {
		(0, _classCallCheck3.default)(this, ContentParser);

		if (content && content.nodeType) {
			// handle dom
			this.dom = this.add(content);
		} else if (typeof content === "string") {
			this.dom = this.parse(content);
		}

		return this.dom;
	}

	(0, _createClass3.default)(ContentParser, [{
		key: "parse",
		value: function parse(markup, mime) {
			var parser = new DOMParser();

			var range = document.createRange();
			var fragment = range.createContextualFragment(markup);

			this.addRefs(fragment);
			this.removeEmpty(fragment);

			return fragment;
		}
	}, {
		key: "add",
		value: function add(contents) {
			// let fragment = document.createDocumentFragment();
			//
			// let children = [...contents.childNodes];
			// for (let child of children) {
			// 	let clone = child.cloneNode(true);
			// 	fragment.appendChild(clone);
			// }

			this.addRefs(contents);
			this.removeEmpty(contents);

			return contents;
		}
	}, {
		key: "addRefs",
		value: function addRefs(content) {
			var treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_ELEMENT, { acceptNode: function acceptNode(node) {
					return NodeFilter.FILTER_ACCEPT;
				} }, false);

			var node = void 0;
			while (node = treeWalker.nextNode()) {

				if (!node.hasAttribute("data-ref")) {
					var uuid = (0, _utils.UUID)();
					node.setAttribute("data-ref", uuid);
				}

				if (node.id) {
					node.setAttribute("data-id", node.id);
				}

				// node.setAttribute("data-children", node.childNodes.length);

				// node.setAttribute("data-text", node.textContent.trim().length);
			}
		}
	}, {
		key: "removeEmpty",
		value: function removeEmpty(content) {
			var treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, { acceptNode: function acceptNode(node) {
					// Only remove more than a single space
					if (node.textContent.length > 1 && !node.textContent.trim()) {
						return NodeFilter.FILTER_ACCEPT;
					} else {
						return NodeFilter.FILTER_REJECT;
					}
				} }, false);

			var node = void 0;
			var current = void 0;
			node = treeWalker.nextNode();
			while (node) {
				current = node;
				node = treeWalker.nextNode();
				// if (!current.nextSibling || (current.nextSibling && current.nextSibling.nodeType === 1)) {
				current.parentNode.removeChild(current);
				// }
			}
		}
	}, {
		key: "find",
		value: function find(ref) {
			return this.refs[ref];
		}

		// isWrapper(element) {
		//   return wrappersRegex.test(element.nodeName);
		// }

	}, {
		key: "isText",
		value: function isText(node) {
			return node.tagName === "TAG";
		}
	}, {
		key: "isElement",
		value: function isElement(node) {
			return node.nodeType === 1;
		}
	}, {
		key: "hasChildren",
		value: function hasChildren(node) {
			return node.childNodes && node.childNodes.length;
		}
	}, {
		key: "destroy",
		value: function destroy() {
			this.refs = undefined;
			this.dom = undefined;
		}
	}]);
	return ContentParser;
}();

exports.default = ContentParser;
},{"../utils/utils":298,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15}],278:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeHandlers = exports.registerHandlers = exports.Handler = exports.Previewer = exports.Polisher = exports.Chunker = undefined;

var _chunker = require('./chunker/chunker');

var _chunker2 = _interopRequireDefault(_chunker);

var _polisher = require('./polisher/polisher');

var _polisher2 = _interopRequireDefault(_polisher);

var _previewer = require('./polyfill/previewer');

var _previewer2 = _interopRequireDefault(_previewer);

var _handler = require('./modules/handler');

var _handler2 = _interopRequireDefault(_handler);

var _handlers = require('./utils/handlers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Chunker = _chunker2.default;
exports.Polisher = _polisher2.default;
exports.Previewer = _previewer2.default;
exports.Handler = _handler2.default;
exports.registerHandlers = _handlers.registerHandlers;
exports.initializeHandlers = _handlers.initializeHandlers;
},{"./chunker/chunker":274,"./modules/handler":284,"./polisher/polisher":291,"./polyfill/previewer":294,"./utils/handlers":296}],279:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _runningHeaders = require('./running-headers');

var _runningHeaders2 = _interopRequireDefault(_runningHeaders);

var _stringSets = require('./string-sets');

var _stringSets2 = _interopRequireDefault(_stringSets);

var _targetCounters = require('./target-counters');

var _targetCounters2 = _interopRequireDefault(_targetCounters);

var _targetText = require('./target-text');

var _targetText2 = _interopRequireDefault(_targetText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_runningHeaders2.default, _stringSets2.default, _targetCounters2.default, _targetText2.default];
},{"./running-headers":280,"./string-sets":281,"./target-counters":282,"./target-text":283}],280:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RunningHeaders = function (_Handler) {
	(0, _inherits3.default)(RunningHeaders, _Handler);

	function RunningHeaders(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, RunningHeaders);

		var _this = (0, _possibleConstructorReturn3.default)(this, (RunningHeaders.__proto__ || (0, _getPrototypeOf2.default)(RunningHeaders)).call(this, chunker, polisher, caller));

		_this.runningSelectors = {};
		_this.elements = {};
		return _this;
	}

	(0, _createClass3.default)(RunningHeaders, [{
		key: "onDeclaration",
		value: function onDeclaration(declaration, dItem, dList, rule) {
			var _this2 = this;

			if (declaration.property === "position") {
				var selector = _cssTree2.default.generate(rule.ruleNode.prelude);
				var identifier = declaration.value.children.first().name;

				if (identifier === "running") {
					var value = void 0;
					_cssTree2.default.walk(declaration, {
						visit: 'Function',
						enter: function enter(node, item, list) {
							value = node.children.first().name;
						}
					});

					this.runningSelectors[value] = {
						identifier: identifier,
						value: value,
						selector: selector
					};
				}
			}

			if (declaration.property === "content") {

				_cssTree2.default.walk(declaration, {
					visit: 'Function',
					enter: function enter(funcNode, fItem, fList) {

						if (funcNode.name.indexOf("element") > -1) {

							var _selector = _cssTree2.default.generate(rule.ruleNode.prelude);

							var func = funcNode.name;

							var _value = funcNode.children.first().name;

							var args = [_value];

							// we only handle first for now
							var style = "first";

							_selector.split(",").forEach(function (s) {
								// remove before / after
								s = s.replace(/::after|::before/, "");

								_this2.elements[s] = {
									func: func,
									args: args,
									value: _value,
									style: style || "first",
									selector: s,
									fullSelector: _selector
								};
							});
						}
					}
				});
			}
		}
	}, {
		key: "afterParsed",
		value: function afterParsed(fragment) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.runningSelectors)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var name = _step.value;

					var set = this.runningSelectors[name];
					var selected = (0, _from2.default)(fragment.querySelectorAll(set.selector));

					if (set.identifier === "running") {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = (0, _getIterator3.default)(selected), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var header = _step2.value;

								header.style.display = "none";
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: "afterPageLayout",
		value: function afterPageLayout(fragment) {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = (0, _getIterator3.default)((0, _keys2.default)(this.runningSelectors)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var name = _step3.value;

					var set = this.runningSelectors[name];
					var selected = fragment.querySelector(set.selector);
					if (selected) {
						var cssVar = void 0;
						if (set.identifier === "running") {
							// cssVar = selected.textContent.replace(/\\([\s\S])|(["|'])/g,"\\$1$2");
							// this.styleSheet.insertRule(`:root { --string-${name}: "${cssVar}"; }`, this.styleSheet.cssRules.length);
							// fragment.style.setProperty(`--string-${name}`, `"${cssVar}"`);
							set.first = selected;
						} else {
							console.log(set.value + "needs css replacement");
						}
					}
				}

				// move elements
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			if (!this.orderedSelectors) {
				this.orderedSelectors = this.orderSelectors(this.elements);
			}

			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = (0, _getIterator3.default)(this.orderedSelectors), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var selector = _step4.value;

					if (selector) {

						var el = this.elements[selector];
						var _selected = fragment.querySelector(selector);
						if (_selected) {
							var running = this.runningSelectors[el.args[0]];
							if (running && running.first) {
								_selected.innerHTML = ""; // Clear node
								// selected.classList.add("pagedjs_clear-after"); // Clear ::after
								var clone = running.first.cloneNode(true);
								clone.style.display = null;
								_selected.appendChild(clone);
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}

		/**
  * Assign a weight to @page selector classes
  * 1) page
  * 2) left & right
  * 3) blank
  * 4) first & nth
  * 5) named page
  * 6) named left & right
  * 7) named first & nth
  */

	}, {
		key: "pageWeight",
		value: function pageWeight(s) {
			var weight = 1;
			var selector = s.split(" ");
			var parts = selector.length && selector[0].split(".");

			parts.shift(); // remove empty first part

			switch (parts.length) {
				case 4:
					if (parts[3] === "pagedjs_first_page") {
						weight = 7;
					} else if (parts[3] === "pagedjs_left_page" || parts[3] === "pagedjs_right_page") {
						weight = 6;
					}
					break;
				case 3:
					if (parts[1] === "pagedjs_named_page") {
						if (parts[2].indexOf(":nth-of-type") > -1) {
							weight = 7;
						} else {
							weight = 5;
						}
					}
					break;
				case 2:
					if (parts[1] === "pagedjs_first_page") {
						weight = 4;
					} else if (parts[1] === "pagedjs_blank_page") {
						weight = 3;
					} else if (parts[1] === "pagedjs_left_page" || parts[1] === "pagedjs_right_page") {
						weight = 2;
					}
					break;
				default:
					if (parts[0].indexOf(":nth-of-type") > -1) {
						weight = 4;
					} else {
						weight = 1;
					}
			}

			return weight;
		}

		/**
  * Orders the selectors based on weight
  *
  * Does not try to deduplicate base on specifity of the selector
  * Previous matched selector will just be overwritten
  */

	}, {
		key: "orderSelectors",
		value: function orderSelectors(obj) {
			var selectors = (0, _keys2.default)(obj);
			var weighted = {
				1: [],
				2: [],
				3: [],
				4: [],
				5: [],
				6: [],
				7: []
			};

			var orderedSelectors = [];

			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;

			try {
				for (var _iterator5 = (0, _getIterator3.default)(selectors), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var s = _step5.value;

					var w = this.pageWeight(s);
					weighted[w].unshift(s);
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}

			for (var i = 1; i <= 7; i++) {
				orderedSelectors = orderedSelectors.concat(weighted[i]);
			}

			return orderedSelectors;
		}
	}, {
		key: "beforeTreeParse",
		value: function beforeTreeParse(text, sheet) {
			// element(x) is parsed as image element selector, so update element to element-ident
			sheet.text = text.replace(/element[\s]*\(([^\|^#)]*)\)/g, "element-ident($1)");
		}
	}]);
	return RunningHeaders;
}(_handler2.default);

exports.default = RunningHeaders;
},{"../handler":284,"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/get-iterator":2,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],281:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StringSets = function (_Handler) {
	(0, _inherits3.default)(StringSets, _Handler);

	function StringSets(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, StringSets);

		var _this = (0, _possibleConstructorReturn3.default)(this, (StringSets.__proto__ || (0, _getPrototypeOf2.default)(StringSets)).call(this, chunker, polisher, caller));

		_this.stringSetSelectors = {};
		return _this;
	}

	(0, _createClass3.default)(StringSets, [{
		key: "onDeclaration",
		value: function onDeclaration(declaration, dItem, dList, rule) {
			if (declaration.property === "string-set") {
				var selector = _cssTree2.default.generate(rule.ruleNode.prelude);

				var identifier = declaration.value.children.first().name;

				var value = void 0;
				_cssTree2.default.walk(declaration, {
					visit: 'Function',
					enter: function enter(node, item, list) {
						value = _cssTree2.default.generate(node);
					}
				});

				this.stringSetSelectors[identifier] = {
					identifier: identifier,
					value: value,
					selector: selector
				};
			}
		}
	}, {
		key: "onContent",
		value: function onContent(funcNode, fItem, fList, declaration, rule) {
			if (funcNode.name === "string") {
				var identifier = funcNode.children && funcNode.children.first().name;
				funcNode.name = "var";
				funcNode.children = new _cssTree2.default.List();

				funcNode.children.append(funcNode.children.createItem({
					type: "Identifier",
					loc: null,
					name: "--string-" + identifier
				}));
			}
		}
	}, {
		key: "afterPageLayout",
		value: function afterPageLayout(fragment) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)((0, _keys2.default)(this.stringSetSelectors)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var name = _step.value;

					var set = this.stringSetSelectors[name];
					var selected = fragment.querySelector(set.selector);
					if (selected) {
						var cssVar = void 0;
						if (set.value === "content" || set.value === "content(text)") {
							cssVar = selected.textContent.replace(/\\([\s\S])|(["|'])/g, "\\$1$2");
							// this.styleSheet.insertRule(`:root { --string-${name}: "${cssVar}"; }`, this.styleSheet.cssRules.length);
							// fragment.style.setProperty(`--string-${name}`, `"${cssVar}"`);
							set.first = cssVar;
						} else {
							console.log(set.value + "needs css replacement");
						}
					} else {
						// Use the previous values
						if (set.first) {
							fragment.style.setProperty("--string-" + name, "\"" + set.first + "\"");
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}]);
	return StringSets;
}(_handler2.default);

exports.default = StringSets;
},{"../handler":284,"babel-runtime/core-js/get-iterator":2,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],282:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

var _utils = require("../../utils/utils");

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TargetCounters = function (_Handler) {
	(0, _inherits3.default)(TargetCounters, _Handler);

	function TargetCounters(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, TargetCounters);

		var _this = (0, _possibleConstructorReturn3.default)(this, (TargetCounters.__proto__ || (0, _getPrototypeOf2.default)(TargetCounters)).call(this, chunker, polisher, caller));

		_this.styleSheet = polisher.styleSheet;

		_this.counterTargets = {};
		return _this;
	}

	(0, _createClass3.default)(TargetCounters, [{
		key: "onContent",
		value: function onContent(funcNode, fItem, fList, declaration, rule) {
			var _this2 = this;

			if (funcNode.name === "target-counter") {
				var selector = _cssTree2.default.generate(rule.ruleNode.prelude);
				var first = funcNode.children.first();
				var last = funcNode.children.last();
				var func = first.name;

				var value = _cssTree2.default.generate(funcNode);

				var args = [];

				first.children.forEach(function (child) {
					if (child.type === "Identifier") {
						args.push(child.name);
					}
				});

				var counter = void 0;
				if (last !== first) {
					counter = last.name;
				}

				var variable = "--" + (0, _utils.UUID)();

				selector.split(",").forEach(function (s) {
					_this2.counterTargets[s] = {
						func: func,
						args: args,
						value: value,
						counter: counter,
						selector: s,
						fullSelector: selector,
						variable: variable
					};
				});

				// Replace with variable
				funcNode.name = "var";
				funcNode.children = new _cssTree2.default.List();
				funcNode.children.appendData({
					type: "Identifier",
					loc: 0,
					name: variable
				});
			}
		}
	}, {
		key: "afterPageLayout",
		value: function afterPageLayout(fragment, page, breakToken, chunker) {
			var _this3 = this;

			(0, _keys2.default)(this.counterTargets).forEach(function (name) {
				var target = _this3.counterTargets[name];
				var split = target.selector.split("::");
				var query = split[0];
				var queried = chunker.pagesArea.querySelectorAll(query + ":not([data-target-counter])");

				queried.forEach(function (selected, index) {
					// TODO: handle func other than attr
					if (target.func !== "attr") {
						return;
					}
					var val = (0, _utils.attr)(selected, target.args);
					var element = chunker.pagesArea.querySelector(val);

					if (element) {
						var selector = (0, _utils.UUID)();
						selected.setAttribute("data-target-counter", selector);
						// TODO: handle other counter types (by query)
						if (target.counter === "page") {
							var pages = chunker.pagesArea.querySelectorAll(".pagedjs_page");
							var pg = 0;
							for (var i = 0; i < pages.length; i++) {
								pg += 1;
								if (pages[i].contains(element)) {
									break;
								}
							}

							var psuedo = "";
							if (split.length > 1) {
								psuedo += "::" + split[1];
							}

							// this.styleSheet.insertRule(`[data-target-counter="${selector}"]${psuedo} { content: "${pg}"; }`, this.styleSheet.cssRules.length);
							_this3.styleSheet.insertRule("[data-target-counter=\"" + selector + "\"]" + psuedo + " { " + target.variable + ": \"" + pg + "\" }", _this3.styleSheet.cssRules.length);
						}
					}
				});
			});
		}
	}]);
	return TargetCounters;
}(_handler2.default);

exports.default = TargetCounters;
},{"../../utils/utils":298,"../handler":284,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],283:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

var _utils = require("../../utils/utils");

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TargetText = function (_Handler) {
	(0, _inherits3.default)(TargetText, _Handler);

	function TargetText(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, TargetText);

		var _this = (0, _possibleConstructorReturn3.default)(this, (TargetText.__proto__ || (0, _getPrototypeOf2.default)(TargetText)).call(this, chunker, polisher, caller));

		_this.styleSheet = polisher.styleSheet;
		_this.textTargets = {};
		return _this;
	}

	(0, _createClass3.default)(TargetText, [{
		key: "onContent",
		value: function onContent(funcNode, fItem, fList, declaration, rule) {
			var _this2 = this;

			if (funcNode.name === "target-text") {
				var selector = _cssTree2.default.generate(rule.ruleNode.prelude);
				var first = funcNode.children.first();
				var last = funcNode.children.last();
				var func = first.name;

				var value = _cssTree2.default.generate(funcNode);

				var args = [];

				first.children.forEach(function (child) {
					if (child.type === "Identifier") {
						args.push(child.name);
					}
				});

				var style = void 0;
				if (last !== first) {
					style = last.name;
				}

				var variable = "--" + (0, _utils.UUID)();

				selector.split(",").forEach(function (s) {
					_this2.textTargets[s] = {
						func: func,
						args: args,
						value: value,
						style: style || "content",
						selector: s,
						fullSelector: selector,
						variable: variable
					};
				});

				// Replace with variable
				funcNode.name = "var";
				funcNode.children = new _cssTree2.default.List();
				funcNode.children.appendData({
					type: "Identifier",
					loc: 0,
					name: variable
				});
			}
		}
	}, {
		key: "afterParsed",
		value: function afterParsed(fragment) {
			var _this3 = this;

			(0, _keys2.default)(this.textTargets).forEach(function (name) {
				var target = _this3.textTargets[name];
				var split = target.selector.split("::");
				var query = split[0];
				var queried = fragment.querySelectorAll(query);
				queried.forEach(function (selected, index) {
					var val = (0, _utils.attr)(selected, target.args);
					var element = fragment.querySelector(val);
					if (element) {
						if (target.style === "content") {
							var text = element.textContent;
							var selector = (0, _utils.UUID)();
							selected.setAttribute("data-target-text", selector);

							var psuedo = "";
							if (split.length > 1) {
								psuedo += "::" + split[1];
							}

							var textContent = element.textContent.trim().replace(/[\"\']/g, function (match) {
								return "\\" + match;
							}).replace(/[\n]/g, function (match) {
								return "\\00000A";
							});

							// this.styleSheet.insertRule(`[data-target-text="${selector}"]${psuedo} { content: "${element.textContent}" }`, this.styleSheet.cssRules.length);
							_this3.styleSheet.insertRule("[data-target-text=\"" + selector + "\"]" + psuedo + " { " + target.variable + ": \"" + textContent + "\" }", _this3.styleSheet.cssRules.length);
						}
					} else {
						console.warn("missed target", val);
					}
				});
			});
		}
	}]);
	return TargetText;
}(_handler2.default);

exports.default = TargetText;
},{"../../utils/utils":298,"../handler":284,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/core-js/object/keys":7,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],284:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Handler = function Handler(chunker, polisher, caller) {
	(0, _classCallCheck3.default)(this, Handler);

	var hooks = (0, _assign2.default)({}, chunker && chunker.hooks, polisher && polisher.hooks, caller && caller.hooks);
	this.chunker = chunker;
	this.polisher = polisher;
	this.caller = caller;

	for (var name in hooks) {
		if (name in this) {
			var hook = hooks[name];
			hook.register(this[name].bind(this));
		}
	}
};

(0, _eventEmitter2.default)(Handler.prototype);

exports.default = Handler;
},{"babel-runtime/core-js/object/assign":3,"babel-runtime/helpers/classCallCheck":14,"event-emitter":272}],285:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require('../handler');

var _handler2 = _interopRequireDefault(_handler);

var _cssTree = require('css-tree');

var _cssTree2 = _interopRequireDefault(_cssTree);

var _sizes = require('../../polisher/sizes');

var _sizes2 = _interopRequireDefault(_sizes);

var _dom = require('../../utils/dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AtPage = function (_Handler) {
	(0, _inherits3.default)(AtPage, _Handler);

	function AtPage(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, AtPage);

		var _this = (0, _possibleConstructorReturn3.default)(this, (AtPage.__proto__ || (0, _getPrototypeOf2.default)(AtPage)).call(this, chunker, polisher, caller));

		_this.pages = {};

		_this.width = undefined;
		_this.height = undefined;
		_this.orientation = undefined;

		_this.marginalia = {};
		return _this;
	}

	(0, _createClass3.default)(AtPage, [{
		key: 'pageModel',
		value: function pageModel(selector) {
			return {
				selector: selector,
				name: undefined,
				psuedo: undefined,
				nth: undefined,
				marginalia: {},
				width: undefined,
				height: undefined,
				orientation: undefined,
				margin: {
					top: {},
					right: {},
					left: {},
					bottom: {}
				},
				block: {},
				marks: undefined
			};
		}

		// Find and Remove @page rules

	}, {
		key: 'onAtPage',
		value: function onAtPage(node, item, list) {
			var page = void 0,
			    marginalia = void 0;
			var selector = "";
			var name = "";
			var named = void 0,
			    psuedo = void 0,
			    nth = void 0;
			var needsMerge = false;

			if (node.prelude) {
				named = this.getTypeSelector(node);
				psuedo = this.getPsuedoSelector(node);
				nth = this.getNthSelector(node);
				selector = _cssTree2.default.generate(node.prelude);
			} else {
				selector = "*";
			}

			if (selector in this.pages) {
				// this.pages[selector] = Object.assign(this.pages[selector], page);
				// console.log("after", selector, this.pages[selector]);

				// this.pages[selector].added = false;
				page = this.pages[selector];
				marginalia = this.replaceMarginalia(node);
				needsMerge = true;
			} else {
				page = this.pageModel(selector);
				marginalia = this.replaceMarginalia(node);
				this.pages[selector] = page;
			}

			page.name = named;
			page.psuedo = psuedo;
			page.nth = nth;

			if (needsMerge) {
				page.marginalia = (0, _assign2.default)(page.marginalia, marginalia);
			} else {
				page.marginalia = marginalia;
			}

			var declarations = this.replaceDeclartations(node);

			if (declarations.size) {
				page.size = declarations.size;
				page.width = declarations.size.width;
				page.height = declarations.size.height;
				page.orientation = declarations.size.orientation;
				page.format = declarations.size.format;
			}

			if (declarations.margin) {
				page.margin = declarations.margin;
			}

			if (declarations.marks) {
				page.marks = declarations.marks;
			}

			if (needsMerge) {
				page.block.children.appendList(node.block.children);
			} else {
				page.block = node.block;
			}

			// Remove the rule
			list.remove(item);
		}

		/* Handled in breaks */
		/*
  afterParsed(parsed) {
  	for (let b in this.named) {
  		// Find elements
  		let elements = parsed.querySelectorAll(b);
  		// Add break data
  		for (var i = 0; i < elements.length; i++) {
  			elements[i].setAttribute("data-page", this.named[b]);
  		}
  	}
  }
  */

	}, {
		key: 'afterTreeWalk',
		value: function afterTreeWalk(ast, sheet) {
			this.addPageClasses(this.pages, ast, sheet);

			if ("*" in this.pages) {
				var width = this.pages["*"].width;
				var height = this.pages["*"].height;
				var format = this.pages["*"].format;
				var orientation = this.pages["*"].orientation;

				if (width && height && (this.width !== width || this.height !== height)) {
					this.width = width;
					this.height = height;
					this.format = format;
					this.orientation = orientation;

					this.addRootVars(ast, width, height, orientation);
					this.addRootPage(ast, this.pages["*"].size);

					this.emit("size", { width: width, height: height, orientation: orientation, format: format });
				}
			}
		}
	}, {
		key: 'getTypeSelector',
		value: function getTypeSelector(ast) {
			// Find page name
			var name = void 0;

			_cssTree2.default.walk(ast, {
				visit: "TypeSelector",
				enter: function enter(node, item, list) {
					name = node.name;
				}
			});

			return name;
		}
	}, {
		key: 'getPsuedoSelector',
		value: function getPsuedoSelector(ast) {
			// Find if it has :left & :right & :black & :first
			var name = void 0;
			_cssTree2.default.walk(ast, {
				visit: "PseudoClassSelector",
				enter: function enter(node, item, list) {
					if (node.name !== "nth") {
						name = node.name;
					}
				}
			});

			return name;
		}
	}, {
		key: 'getNthSelector',
		value: function getNthSelector(ast) {
			// Find if it has :nth
			var nth = void 0;
			_cssTree2.default.walk(ast, {
				visit: "PseudoClassSelector",
				enter: function enter(node, item, list) {
					if (node.name === "nth" && node.children) {
						var raw = node.children.first();
						nth = raw.value;
					}
				}
			});

			return nth;
		}
	}, {
		key: 'replaceMarginalia',
		value: function replaceMarginalia(ast) {
			var parsed = {};

			_cssTree2.default.walk(ast.block, {
				visit: 'Atrule',
				enter: function enter(node, item, list) {
					var name = node.name;
					if (name === "top") {
						name = "top-center";
					}
					if (name === "right") {
						name = "right-middle";
					}
					if (name === "left") {
						name = "left-middle";
					}
					if (name === "bottom") {
						name = "bottom-center";
					}
					parsed[name] = node.block;
					list.remove(item);
				}
			});

			return parsed;
		}
	}, {
		key: 'replaceDeclartations',
		value: function replaceDeclartations(ast) {
			var _this2 = this;

			var parsed = {};

			_cssTree2.default.walk(ast.block, {
				visit: 'Declaration',
				enter: function enter(declaration, dItem, dList) {
					var prop = _cssTree2.default.property(declaration.property).name;
					var value = declaration.value;
					if (prop === "marks") {
						parsed.marks = value.children.first().name;
						dList.remove(dItem);
					} else if (prop === "margin") {
						parsed.margin = _this2.getMargins(declaration);
						dList.remove(dItem);
					} else if (prop.indexOf("margin-") === 0) {
						var m = prop.substring("margin-".length);
						if (!parsed.margin) {
							parsed.margin = {
								top: {},
								right: {},
								left: {},
								bottom: {}
							};
						}
						parsed.margin[m] = declaration.value.children.first();
						dList.remove(dItem);
					} else if (prop === "size") {
						parsed.size = _this2.getSize(declaration);
						dList.remove(dItem);
					}
				}
			});

			return parsed;
		}
	}, {
		key: 'getSize',
		value: function getSize(declaration) {
			var width = void 0,
			    height = void 0,
			    orientation = void 0,
			    format = void 0;

			// Get size: Xmm Ymm
			_cssTree2.default.walk(declaration, {
				visit: 'Dimension',
				enter: function enter(node, item, list) {
					var value = node.value,
					    unit = node.unit;

					if (typeof width === "undefined") {
						width = { value: value, unit: unit };
					} else if (typeof height === "undefined") {
						height = { value: value, unit: unit };
					}
				}
			});

			// Get size: 'A4'
			_cssTree2.default.walk(declaration, {
				visit: 'String',
				enter: function enter(node, item, list) {
					var name = node.value.replace(/["|']/g, '');
					var s = _sizes2.default[name];
					if (s) {
						width = s.width;
						height = s.height;
					}
				}
			});

			// Get Format or Landscape or Portrait
			_cssTree2.default.walk(declaration, {
				visit: "Identifier",
				enter: function enter(node, item, list) {
					var name = node.name;
					if (name === "landscape" || name === "portrait") {
						orientation = node.name;
					} else if (name !== "auto") {
						var s = _sizes2.default[name];
						if (s) {
							width = s.width;
							height = s.height;
						}
						format = name;
					}
				}
			});

			return {
				width: width,
				height: height,
				orientation: orientation,
				format: format
			};
		}
	}, {
		key: 'getMargins',
		value: function getMargins(declaration) {
			var margins = [];
			var margin = {
				top: {},
				right: {},
				left: {},
				bottom: {}
			};

			_cssTree2.default.walk(declaration, {
				visit: 'Dimension',
				enter: function enter(node, item, list) {
					margins.push(node);
				}
			});

			if (margins.length === 1) {
				for (var m in margin) {
					margin[m] = margins[0];
				}
			} else if (margins.length === 2) {
				margin.top = margins[0];
				margin.right = margins[1];
				margin.bottom = margins[0];
				margin.left = margins[1];
			} else if (margins.length === 3) {
				margin.top = margins[0];
				margin.right = margins[1];
				margin.bottom = margins[2];
				margin.left = margins[1];
			} else if (margins.length === 4) {
				margin.top = margins[0];
				margin.right = margins[1];
				margin.bottom = margins[2];
				margin.left = margins[3];
			}

			return margin;
		}
	}, {
		key: 'addPageClasses',
		value: function addPageClasses(pages, ast, sheet) {
			// First add * page
			if ("*" in pages && !pages["*"].added) {
				var p = this.createPage(pages["*"], ast.children, sheet);
				sheet.insertRule(p);
				pages["*"].added = true;
			}
			// Add :left & :right
			if (":left" in pages && !pages[":left"].added) {
				var left = this.createPage(pages[":left"], ast.children, sheet);
				sheet.insertRule(left);
				pages[":left"].added = true;
			}
			if (":right" in pages && !pages[":right"].added) {
				var right = this.createPage(pages[":right"], ast.children, sheet);
				sheet.insertRule(right);
				pages[":right"].added = true;
			}
			// Add :first & :blank
			if (":first" in pages && !pages[":first"].first) {
				var first = this.createPage(pages[":first"], ast.children, sheet);
				sheet.insertRule(first);
				pages[":first"].added = true;
			}
			if (":blank" in pages && !pages[":blank"].added) {
				var blank = this.createPage(pages[":blank"], ast.children, sheet);
				sheet.insertRule(blank);
				pages[":blank"].added = true;
			}
			// Add nth pages
			for (var pg in pages) {
				if (pages[pg].nth && !pages[pg].added) {
					var nth = this.createPage(pages[pg], ast.children, sheet);
					sheet.insertRule(nth);
					pages[pg].added = true;
				}
			}

			// Add named pages
			for (var _pg in pages) {
				if (pages[_pg].name && !pages[_pg].added) {
					var named = this.createPage(pages[_pg], ast.children, sheet);
					sheet.insertRule(named);
					pages[_pg].added = true;
				}
			}
		}
	}, {
		key: 'createPage',
		value: function createPage(page, ruleList, sheet) {

			var selectors = this.selectorsForPage(page);
			var children = page.block.children.copy();
			var block = {
				type: 'Block',
				loc: 0,
				children: children
			};
			var rule = this.createRule(selectors, block);

			this.addMarginVars(page.margin, children, children.first());

			if (page.width) {
				this.addDimensions(page.width, page.height, page.orientation, children, children.first());
			}

			if (page.marginalia) {
				this.addMarginaliaStyles(page, ruleList, rule, sheet);
				this.addMarginaliaContent(page, ruleList, rule, sheet);
			}

			return rule;
		}
	}, {
		key: 'addMarginVars',
		value: function addMarginVars(margin, list, item) {
			// variables for margins
			for (var m in margin) {
				if (typeof margin[m].value !== "undefined") {
					var value = margin[m].value + (margin[m].unit || '');
					var mVar = list.createItem({
						type: 'Declaration',
						property: "--margin-" + m,
						value: {
							type: "Raw",
							value: value
						}
					});
					list.append(mVar, item);
				}
			}
		}
	}, {
		key: 'addDimensions',
		value: function addDimensions(width, height, orientation, list, item) {

			var outputWidth = void 0,
			    outputHeight = void 0;
			if (!orientation || orientation === "portrait") {
				outputWidth = width;
				outputHeight = height;
			} else {
				outputWidth = height;
				outputHeight = width;
			}

			// width variable
			var wVar = this.createVariable("--width", outputWidth.value + (outputWidth.unit || ''));
			list.appendData(wVar);

			// height variable
			var hVar = this.createVariable("--height", outputHeight.value + (outputHeight.unit || ''));
			list.appendData(hVar);

			// width dimension
			var w = this.createDimension("width", outputWidth.value, outputWidth.unit);
			list.appendData(w);

			// height dimension
			var h = this.createDimension("height", outputHeight.value, outputHeight.unit);
			list.appendData(h);
		}
	}, {
		key: 'addMarginaliaStyles',
		value: function addMarginaliaStyles(page, list, item, sheet) {
			var _this3 = this;

			var _loop = function _loop(loc) {
				var block = _cssTree2.default.clone(page.marginalia[loc]);
				var hasContent = false;

				if (block.children.isEmpty()) {
					return 'continue';
				}

				_cssTree2.default.walk(block, {
					visit: "Declaration",
					enter: function enter(node, item, list) {
						if (node.property === "content") {
							if (node.value.children && node.value.children.first().name === "none") {
								hasContent = false;
							} else {
								hasContent = true;
							}
							list.remove(item);
						}
						if (node.property === "vertical-align") {
							_cssTree2.default.walk(node, {
								visit: "Identifier",
								enter: function enter(identNode, identItem, identlist) {
									var name = identNode.name;
									if (name === "top") {
										identNode.name = "flex-start";
									} else if (name === "middle") {
										identNode.name = "center";
									} else if (name === "bottom") {
										identNode.name = "flex-end";
									}
								}
							});
							node.property = "align-items";
						}

						if (node.property === "width" && (loc === "top-left" || loc === "top-center" || loc === "top-right" || loc === "bottom-left" || loc === "bottom-center" || loc === "bottom-right")) {
							var c = _cssTree2.default.clone(node);
							c.property = "max-width";
							list.appendData(c);
						}

						if (node.property === "height" && (loc === "left-top" || loc === "left-middle" || loc === "left-bottom" || loc === "right-top" || loc === "right-middle" || loc === "right-bottom")) {
							var _c = _cssTree2.default.clone(node);
							_c.property = "max-height";
							list.appendData(_c);
						}
					}
				});

				var marginSelectors = _this3.selectorsForPageMargin(page, loc);
				var marginRule = _this3.createRule(marginSelectors, block);

				list.appendData(marginRule);

				var sel = _cssTree2.default.generate({
					type: 'Selector',
					children: marginSelectors
				});

				_this3.marginalia[sel] = {
					page: page,
					selector: sel,
					block: page.marginalia[loc],
					hasContent: hasContent
				};
			};

			for (var loc in page.marginalia) {
				var _ret = _loop(loc);

				if (_ret === 'continue') continue;
			}
		}
	}, {
		key: 'addMarginaliaContent',
		value: function addMarginaliaContent(page, list, item, sheet) {
			var displayNone = void 0;
			// Just content
			for (var loc in page.marginalia) {
				var content = _cssTree2.default.clone(page.marginalia[loc]);
				_cssTree2.default.walk(content, {
					visit: "Declaration",
					enter: function enter(node, item, list) {
						if (node.property !== "content") {
							list.remove(item);
						}

						if (node.value.children && node.value.children.first().name === "none") {
							displayNone = true;
						}
					}
				});

				if (content.children.isEmpty()) {
					continue;
				}

				var displaySelectors = this.selectorsForPageMargin(page, loc);
				var displayDeclaration = void 0;

				displaySelectors.insertData({
					type: 'Combinator',
					name: ">"
				});

				displaySelectors.insertData({
					type: 'ClassSelector',
					name: "pagedjs_margin-content"
				});

				displaySelectors.insertData({
					type: 'Combinator',
					name: ">"
				});

				displaySelectors.insertData({
					type: 'TypeSelector',
					name: "*"
				});

				if (displayNone) {
					displayDeclaration = this.createDeclaration("display", "none");
				} else {
					displayDeclaration = this.createDeclaration("display", "block");
				}

				var displayRule = this.createRule(displaySelectors, [displayDeclaration]);
				sheet.insertRule(displayRule);

				// insert content rule
				var contentSelectors = this.selectorsForPageMargin(page, loc);

				contentSelectors.insertData({
					type: 'Combinator',
					name: ">"
				});

				contentSelectors.insertData({
					type: 'ClassSelector',
					name: "pagedjs_margin-content"
				});

				contentSelectors.insertData({
					type: 'PseudoElementSelector',
					name: "after",
					children: null
				});

				var contentRule = this.createRule(contentSelectors, content);
				sheet.insertRule(contentRule);
			}
		}
	}, {
		key: 'addRootVars',
		value: function addRootVars(ast, width, height, orientation) {
			var selectors = new _cssTree2.default.List();
			selectors.insertData({
				type: "PseudoClassSelector",
				name: "root",
				children: null
			});

			// orientation variable
			var oVar = this.createVariable("--orientation", orientation || "");

			var widthString = void 0,
			    heightString = void 0;
			if (!orientation || orientation === "portrait") {
				widthString = width.value + (width.unit || '');
				heightString = height.value + (height.unit || '');
			} else {
				widthString = height.value + (height.unit || '');
				heightString = width.value + (width.unit || '');
			}

			var wVar = this.createVariable("--width", widthString);
			var hVar = this.createVariable("--height", heightString);
			var rule = this.createRule(selectors, [wVar, hVar, oVar]);

			ast.children.appendData(rule);
		}

		/*
  @page {
  	size: var(--width) var(--height);
  	margin: 0;
  	padding: 0;
  }
  */

	}, {
		key: 'addRootPage',
		value: function addRootPage(ast, size) {
			var width = size.width,
			    height = size.height,
			    orientation = size.orientation,
			    format = size.format;

			var children = new _cssTree2.default.List();
			var dimensions = new _cssTree2.default.List();

			if (format) {
				dimensions.appendData({
					type: 'Identifier',
					name: format
				});

				if (orientation) {
					dimensions.appendData({
						type: 'WhiteSpace',
						value: " "
					});

					dimensions.appendData({
						type: 'Identifier',
						name: orientation
					});
				}
			} else {
				dimensions.appendData({
					type: 'Dimension',
					unit: width.unit,
					value: width.value
				});

				dimensions.appendData({
					type: 'WhiteSpace',
					value: " "
				});

				dimensions.appendData({
					type: 'Dimension',
					unit: height.unit,
					value: height.value
				});
			}

			children.appendData({
				type: 'Declaration',
				property: "size",
				loc: null,
				value: {
					type: "Value",
					children: dimensions
				}
			});

			children.appendData({
				type: 'Declaration',
				property: "margin",
				loc: null,
				value: {
					type: "Value",
					children: [{
						type: 'Dimension',
						unit: 'px',
						value: 0
					}]
				}
			});

			children.appendData({
				type: 'Declaration',
				property: "padding",
				loc: null,
				value: {
					type: "Value",
					children: [{
						type: 'Dimension',
						unit: 'px',
						value: 0
					}]
				}
			});

			var rule = ast.children.createItem({
				type: 'Atrule',
				prelude: null,
				name: "page",
				block: {
					type: 'Block',
					loc: null,
					children: children
				}
			});

			ast.children.append(rule);
		}
	}, {
		key: 'getNth',
		value: function getNth(nth) {
			var n = nth.indexOf("n");
			var plus = nth.indexOf("+");
			var splitN = nth.split("n");
			var splitP = nth.split("+");
			var a = null;
			var b = null;
			if (n > -1) {
				a = splitN[0];
				if (plus > -1) {
					b = splitP[1];
				}
			} else {
				b = nth;
			}

			return {
				type: 'Nth',
				loc: null,
				selector: null,
				nth: {
					type: "AnPlusB",
					loc: null,
					a: a,
					b: b
				}
			};
		}
	}, {
		key: 'addPageAttributes',
		value: function addPageAttributes(page, start, pages) {
			var named = start.dataset.page;

			if (named) {
				page.name = named;
				page.element.classList.add("pagedjs_named_page");
				page.element.classList.add("pagedjs_" + named + "_page");

				if (!start.dataset.splitFrom) {
					page.element.classList.add("pagedjs_" + named + "_first_page");
				}
			}
		}
	}, {
		key: 'getStartElement',
		value: function getStartElement(content, breakToken) {
			var start = content;
			var node = breakToken && breakToken.node;
			var index = void 0,
			    ref = void 0,
			    parent = void 0;

			if (!content && !breakToken) {
				return;
			}

			// No break
			if (!node) {
				return content.children[0];
			}

			// Top level element
			if (node.nodeType === 1 && node.parentNode.nodeType === 11) {
				return node;
			}

			// Named page
			if (node.nodeType === 1 && node.dataset.page) {
				return node;
			}

			// Get top level Named parent
			var fragment = (0, _dom.rebuildAncestors)(node);
			var pages = fragment.querySelectorAll("[data-page]");

			if (pages.length) {
				return pages[pages.length - 1];
			} else {
				return fragment.children[0];
			}
		}
	}, {
		key: 'beforePageLayout',
		value: function beforePageLayout(page, contents, breakToken, chunker) {
			var start = this.getStartElement(contents, breakToken);
			if (start) {
				this.addPageAttributes(page, start, chunker.pages);
			}
		}
	}, {
		key: 'afterPageLayout',
		value: function afterPageLayout(fragment, page, breakToken, chunker) {
			for (var m in this.marginalia) {
				var margin = this.marginalia[m];
				var sels = m.split(" ");

				var content = void 0;
				if (page.element.matches(sels[0]) && margin.hasContent) {
					content = page.element.querySelector(sels[1]);
					content.classList.add("hasContent");
				}
			}

			// check center
			["top", "bottom"].forEach(function (loc) {
				var marginGroup = page.element.querySelector(".pagedjs_margin-" + loc);
				var center = page.element.querySelector(".pagedjs_margin-" + loc + "-center");
				var left = page.element.querySelector(".pagedjs_margin-" + loc + "-left");
				var right = page.element.querySelector(".pagedjs_margin-" + loc + "-right");

				var centerContent = center.classList.contains("hasContent");
				var leftContent = left.classList.contains("hasContent");
				var rightContent = right.classList.contains("hasContent");
				var marginGroupWidth = marginGroup.offsetWidth;
				var centerWidth = void 0,
				    leftWidth = void 0,
				    rightWidth = void 0;

				if (leftContent) {
					leftWidth = window.getComputedStyle(left)["max-width"];
				}

				if (rightContent) {
					rightWidth = window.getComputedStyle(right)["max-width"];
				}

				if (centerContent) {
					centerWidth = window.getComputedStyle(center)["max-width"];

					if (centerWidth === "none" || centerWidth === "auto") {
						if (!leftContent && !rightContent) {
							marginGroup.style["grid-template-columns"] = "0 1fr 0";
						} else if (leftContent) {
							if (!rightContent) {
								if (leftWidth !== "none" && leftWidth !== "auto") {
									marginGroup.style["grid-template-columns"] = leftWidth + " 1fr " + leftWidth;
								} else {
									marginGroup.style["grid-template-columns"] = "auto auto 1fr";
									left.style["white-space"] = "nowrap";
									center.style["white-space"] = "nowrap";
									var leftOuterWidth = left.offsetWidth;
									var centerOuterWidth = center.offsetWidth;
									var outerwidths = leftOuterWidth + centerOuterWidth;
									var newcenterWidth = centerOuterWidth * 100 / outerwidths;
									marginGroup.style["grid-template-columns"] = "minmax(16.66%, 1fr) minmax(33%, " + newcenterWidth + "%) minmax(16.66%, 1fr)";
									left.style["white-space"] = "normal";
									center.style["white-space"] = "normal";
								}
							} else {
								if (leftWidth !== "none" && leftWidth !== "auto") {
									if (rightWidth !== "none" && rightWidth !== "auto") {
										marginGroup.style["grid-template-columns"] = leftWidth + " 1fr " + rightWidth;
									} else {
										marginGroup.style["grid-template-columns"] = leftWidth + " 1fr " + leftWidth;
									}
								} else {
									if (rightWidth !== "none" && rightWidth !== "auto") {
										marginGroup.style["grid-template-columns"] = rightWidth + " 1fr " + rightWidth;
									} else {
										marginGroup.style["grid-template-columns"] = "auto auto 1fr";
										left.style["white-space"] = "nowrap";
										center.style["white-space"] = "nowrap";
										right.style["white-space"] = "nowrap";
										var _leftOuterWidth = left.offsetWidth;
										var _centerOuterWidth = center.offsetWidth;
										var rightOuterWidth = right.offsetWidth;
										var _outerwidths = _leftOuterWidth + _centerOuterWidth + rightOuterWidth;
										var _newcenterWidth = _centerOuterWidth * 100 / _outerwidths;
										if (_newcenterWidth > 40) {
											marginGroup.style["grid-template-columns"] = "minmax(16.66%, 1fr) minmax(33%, " + _newcenterWidth + "%) minmax(16.66%, 1fr)";
										} else {
											marginGroup.style["grid-template-columns"] = "repeat(3, 1fr)";
										}
										left.style["white-space"] = "normal";
										center.style["white-space"] = "normal";
										right.style["white-space"] = "normal";
									}
								}
							}
						} else {
							if (rightWidth !== "none" && rightWidth !== "auto") {
								marginGroup.style["grid-template-columns"] = rightWidth + " 1fr " + rightWidth;
							} else {
								marginGroup.style["grid-template-columns"] = "auto auto 1fr";
								right.style["white-space"] = "nowrap";
								center.style["white-space"] = "nowrap";
								var _rightOuterWidth = right.offsetWidth;
								var _centerOuterWidth2 = center.offsetWidth;
								var _outerwidths2 = _rightOuterWidth + _centerOuterWidth2;
								var _newcenterWidth2 = _centerOuterWidth2 * 100 / _outerwidths2;
								marginGroup.style["grid-template-columns"] = "minmax(16.66%, 1fr) minmax(33%, " + _newcenterWidth2 + "%) minmax(16.66%, 1fr)";
								right.style["white-space"] = "normal";
								center.style["white-space"] = "normal";
							}
						}
					} else if (centerWidth !== "none" && centerWidth !== "auto") {
						if (leftContent && leftWidth !== "none" && leftWidth !== "auto") {
							marginGroup.style["grid-template-columns"] = leftWidth + " " + centerWidth + " 1fr";
						} else if (rightContent && rightWidth !== "none" && rightWidth !== "auto") {
							marginGroup.style["grid-template-columns"] = "1fr " + centerWidth + " " + rightWidth;
						} else {
							marginGroup.style["grid-template-columns"] = "1fr " + centerWidth + " 1fr";
						}
					}
				} else {
					if (leftContent) {
						if (!rightContent) {
							marginGroup.style["grid-template-columns"] = "1fr 0 0";
						} else {
							if (leftWidth !== "none" && leftWidth !== "auto") {
								if (rightWidth !== "none" && rightWidth !== "auto") {
									marginGroup.style["grid-template-columns"] = leftWidth + " 1fr " + rightWidth;
								} else {
									marginGroup.style["grid-template-columns"] = leftWidth + " 0 1fr";
								}
							} else {
								if (rightWidth !== "none" && rightWidth !== "auto") {
									marginGroup.style["grid-template-columns"] = "1fr 0 " + rightWidth;
								} else {
									marginGroup.style["grid-template-columns"] = "auto 1fr auto";
									left.style["white-space"] = "nowrap";
									right.style["white-space"] = "nowrap";
									var _leftOuterWidth2 = left.offsetWidth;
									var _rightOuterWidth2 = right.offsetWidth;
									var _outerwidths3 = _leftOuterWidth2 + _rightOuterWidth2;
									var newLeftWidth = _leftOuterWidth2 * 100 / _outerwidths3;
									marginGroup.style["grid-template-columns"] = "minmax(16.66%, " + newLeftWidth + "%) 0 1fr";
									left.style["white-space"] = "normal";
									right.style["white-space"] = "normal";
								}
							}
						}
					} else {
						if (rightWidth !== "none" && rightWidth !== "auto") {
							marginGroup.style["grid-template-columns"] = "1fr 0 " + rightWidth;
						} else {
							marginGroup.style["grid-template-columns"] = "0 0 1fr";
						}
					}
				}
			});

			// check middle
			["left", "right"].forEach(function (loc) {
				var middle = page.element.querySelector(".pagedjs_margin-" + loc + "-middle.hasContent");
				var marginGroup = page.element.querySelector(".pagedjs_margin-" + loc);
				var top = page.element.querySelector(".pagedjs_margin-" + loc + "-top");
				var bottom = page.element.querySelector(".pagedjs_margin-" + loc + "-bottom");
				var topContent = top.classList.contains("hasContent");
				var bottomContent = bottom.classList.contains("hasContent");
				var middleHeight = void 0,
				    topHeight = void 0,
				    bottomHeight = void 0;

				if (topContent) {
					topHeight = window.getComputedStyle(top)["max-height"];
				}

				if (bottomContent) {
					bottomHeight = window.getComputedStyle(bottom)["max-height"];
				}

				if (middle) {
					middleHeight = window.getComputedStyle(middle)["max-height"];

					if (middleHeight === "none" || middleHeight === "auto") {
						if (!topContent && !bottomContent) {
							marginGroup.style["grid-template-rows"] = "0 1fr 0";
						} else if (topContent) {
							if (!bottomContent) {
								if (topHeight !== "none" && topHeight !== "auto") {
									marginGroup.style["grid-template-rows"] = topHeight + " calc(100% - " + topHeight + "*2) " + topHeight;
								}
							} else {
								if (topHeight !== "none" && topHeight !== "auto") {
									if (bottomHeight !== "none" && bottomHeight !== "auto") {
										marginGroup.style["grid-template-rows"] = topHeight + " calc(100% - " + topHeight + " - " + bottomHeight + ") " + bottomHeight;
									} else {
										marginGroup.style["grid-template-rows"] = topHeight + " calc(100% - " + topHeight + "*2) " + topHeight;
									}
								} else {
									if (bottomHeight !== "none" && bottomHeight !== "auto") {
										marginGroup.style["grid-template-rows"] = bottomHeight + " calc(100% - " + bottomHeight + "*2) " + bottomHeight;
									}
								}
							}
						} else {
							if (bottomHeight !== "none" && bottomHeight !== "auto") {
								marginGroup.style["grid-template-rows"] = bottomHeight + " calc(100% - " + bottomHeight + "*2) " + bottomHeight;
							}
						}
					} else {
						if (topContent && topHeight !== "none" && topHeight !== "auto") {
							marginGroup.style["grid-template-rows"] = topHeight + " " + middleHeight + " calc(100% - (" + topHeight + " + " + middleHeight + "))";
						} else if (bottomContent && bottomHeight !== "none" && bottomHeight !== "auto") {
							marginGroup.style["grid-template-rows"] = "1fr " + middleHeight + " " + bottomHeight;
						} else {
							marginGroup.style["grid-template-rows"] = "calc((100% - " + middleHeight + ")/2) " + middleHeight + " calc((100% - " + middleHeight + ")/2)";
						}
					}
				} else {
					if (topContent) {
						if (!bottomContent) {
							marginGroup.style["grid-template-rows"] = "1fr 0 0";
						} else {
							if (topHeight !== "none" && topHeight !== "auto") {
								if (bottomHeight !== "none" && bottomHeight !== "auto") {
									marginGroup.style["grid-template-rows"] = topHeight + " 1fr " + bottomHeight;
								} else {
									marginGroup.style["grid-template-rows"] = topHeight + " 0 1fr";
								}
							} else {
								if (bottomHeight !== "none" && bottomHeight !== "auto") {
									marginGroup.style["grid-template-rows"] = "1fr 0 " + bottomHeight;
								} else {
									marginGroup.style["grid-template-rows"] = "1fr 0 1fr";
								}
							}
						}
					} else {
						if (bottomHeight !== "none" && bottomHeight !== "auto") {
							marginGroup.style["grid-template-rows"] = "1fr 0 " + bottomHeight;
						} else {
							marginGroup.style["grid-template-rows"] = "0 0 1fr";
						}
					}
				}
			});
		}

		// CSS Tree Helpers

	}, {
		key: 'selectorsForPage',
		value: function selectorsForPage(page) {
			var nthlist = void 0;
			var nth = void 0;

			var selectors = new _cssTree2.default.List();

			selectors.insertData({
				type: 'ClassSelector',
				name: 'pagedjs_page'
			});

			// Named page
			if (page.name) {
				selectors.insertData({
					type: 'ClassSelector',
					name: "pagedjs_named_page"
				});

				name = page.name + "_page";
				selectors.insertData({
					type: 'ClassSelector',
					name: "pagedjs_" + page.name + "_page"
				});
			}

			// PsuedoSelector
			if (page.psuedo && !(page.name && page.psuedo === "first")) {
				selectors.insertData({
					type: 'ClassSelector',
					name: "pagedjs_" + page.psuedo + "_page"
				});
			}

			if (page.name && page.psuedo === "first") {
				selectors.insertData({
					type: 'ClassSelector',
					name: "pagedjs_" + page.name + "_" + page.psuedo + "_page"
				});
			}

			// Nth
			if (page.nth) {
				nthlist = new _cssTree2.default.List();
				nth = this.getNth(page.nth);

				nthlist.insertData(nth);

				selectors.insertData({
					type: 'PseudoClassSelector',
					name: 'nth-of-type',
					children: nthlist
				});
			}

			return selectors;
		}
	}, {
		key: 'selectorsForPageMargin',
		value: function selectorsForPageMargin(page, margin) {
			var selectors = this.selectorsForPage(page);

			selectors.insertData({
				type: 'Combinator',
				name: " "
			});

			selectors.insertData({
				type: 'ClassSelector',
				name: "pagedjs_margin-" + margin
			});

			return selectors;
		}
	}, {
		key: 'createDeclaration',
		value: function createDeclaration(property, value, important) {
			var children = new _cssTree2.default.List();

			children.insertData({
				type: "Identifier",
				loc: null,
				name: value
			});

			return {
				type: "Declaration",
				loc: null,
				important: important,
				property: property,
				value: {
					type: "Value",
					loc: null,
					children: children
				}
			};
		}
	}, {
		key: 'createVariable',
		value: function createVariable(property, value) {
			return {
				type: "Declaration",
				loc: null,
				property: property,
				value: {
					type: "Raw",
					value: value
				}
			};
		}
	}, {
		key: 'createDimension',
		value: function createDimension(property, value, unit, important) {
			var children = new _cssTree2.default.List();

			children.insertData({
				type: "Dimension",
				loc: null,
				value: value,
				unit: unit
			});

			return {
				type: "Declaration",
				loc: null,
				important: important,
				property: property,
				value: {
					type: "Value",
					loc: null,
					children: children
				}
			};
		}
	}, {
		key: 'createBlock',
		value: function createBlock(declarations) {
			var block = new _cssTree2.default.List();

			declarations.forEach(function (declaration) {
				block.insertData(declaration);
			});

			return {
				type: 'Block',
				loc: null,
				children: block
			};
		}
	}, {
		key: 'createRule',
		value: function createRule(selectors, block) {
			var selectorList = new _cssTree2.default.List();
			selectorList.insertData({
				type: 'Selector',
				children: selectors
			});

			if (Array.isArray(block)) {
				block = this.createBlock(block);
			}

			return {
				type: 'Rule',
				prelude: {
					type: 'SelectorList',
					children: selectorList
				},
				block: block
			};
		}
	}]);
	return AtPage;
}(_handler2.default);

exports.default = AtPage;
},{"../../polisher/sizes":293,"../../utils/dom":295,"../handler":284,"babel-runtime/core-js/object/assign":3,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],286:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

var _dom = require("../../utils/dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Breaks = function (_Handler) {
	(0, _inherits3.default)(Breaks, _Handler);

	function Breaks(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, Breaks);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Breaks.__proto__ || (0, _getPrototypeOf2.default)(Breaks)).call(this, chunker, polisher, caller));

		_this.breaks = {};
		return _this;
	}

	(0, _createClass3.default)(Breaks, [{
		key: "onDeclaration",
		value: function onDeclaration(declaration, dItem, dList, rule) {
			var _this2 = this;

			var property = declaration.property;

			if (property === "page") {
				var children = declaration.value.children.first();
				var value = children.name;
				var selector = _cssTree2.default.generate(rule.ruleNode.prelude);
				var name = value;

				var breaker = {
					property: property,
					value: value,
					selector: selector,
					name: name
				};

				selector.split(",").forEach(function (s) {
					if (!_this2.breaks[s]) {
						_this2.breaks[s] = [breaker];
					} else {
						_this2.breaks[s].push(breaker);
					}
				});

				dList.remove(dItem);
			}

			if (property === "break-before" || property === "break-after" || property === "page-break-before" || property === "page-break-after") {
				var child = declaration.value.children.first();
				var _value = child.name;
				var _selector = _cssTree2.default.generate(rule.ruleNode.prelude);

				if (property === "page-break-before") {
					property = "break-before";
				} else if (property === "page-break-after") {
					property = "break-after";
				}

				var _breaker = {
					property: property,
					value: _value,
					selector: _selector
				};

				_selector.split(",").forEach(function (s) {
					if (!_this2.breaks[s]) {
						_this2.breaks[s] = [_breaker];
					} else {
						_this2.breaks[s].push(_breaker);
					}
				});

				// Remove from CSS -- handle right / left in module
				dList.remove(dItem);
			}
		}
	}, {
		key: "afterParsed",
		value: function afterParsed(parsed) {
			this.processBreaks(parsed, this.breaks);
		}
	}, {
		key: "processBreaks",
		value: function processBreaks(parsed, breaks) {
			for (var b in breaks) {
				// Find elements
				var elements = parsed.querySelectorAll(b);
				// Add break data
				for (var i = 0; i < elements.length; i++) {
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = (0, _getIterator3.default)(breaks[b]), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var prop = _step.value;


							if (prop.property === "break-after") {
								var nodeAfter = (0, _dom.elementAfter)(elements[i], parsed);

								if (nodeAfter) {
									nodeAfter.setAttribute("data-previous-break-after", prop.value);
								}
							} else if (prop.property === "page") {
								elements[i].setAttribute("data-page", prop.value);

								var _nodeAfter = (0, _dom.elementAfter)(elements[i], parsed);

								if (_nodeAfter) {
									_nodeAfter.setAttribute("data-after-page", prop.value);
								}
							} else {
								elements[i].setAttribute("data-" + prop.property, prop.value);
							}
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				}
			}
		}
	}, {
		key: "mergeBreaks",
		value: function mergeBreaks(pageBreaks, newBreaks) {
			for (var b in newBreaks) {
				if (b in pageBreaks) {
					pageBreaks[b] = pageBreaks[b].concat(newBreaks[b]);
				} else {
					pageBreaks[b] = newBreaks[b];
				}
			}
			return pageBreaks;
		}
	}, {
		key: "addBreakAttributes",
		value: function addBreakAttributes(page) {
			var before = page.wrapper.querySelector("[data-break-before]");
			var after = page.wrapper.querySelector("[data-break-after]");
			var previousBreakAfter = page.wrapper.querySelector("[data-previous-break-after]");

			if (before) {
				if (before.dataset.splitFrom) {
					page.splitFrom = before.dataset.splitFrom;
					page.element.setAttribute("data-split-from", before.dataset.splitFrom);
				} else if (before.dataset.breakBefore && before.dataset.breakBefore !== "avoid") {
					page.breakBefore = before.dataset.breakBefore;
					page.element.setAttribute("data-break-before", before.dataset.breakBefore);
				}
			}

			if (after && after.dataset) {
				if (after.dataset.splitTo) {
					page.splitTo = after.dataset.splitTo;
					page.element.setAttribute("data-split-to", after.dataset.splitTo);
				} else if (after.dataset.breakAfter && after.dataset.breakAfter !== "avoid") {
					page.breakAfter = after.dataset.breakAfter;
					page.element.setAttribute("data-break-after", after.dataset.breakAfter);
				}
			}

			if (previousBreakAfter && previousBreakAfter.dataset) {
				if (previousBreakAfter.dataset.previousBreakAfter && previousBreakAfter.dataset.previousBreakAfter !== "avoid") {
					page.previousBreakAfter = previousBreakAfter.dataset.previousBreakAfter;
				}
			}
		}
	}, {
		key: "afterLayout",
		value: function afterLayout(pageElement, page) {
			this.addBreakAttributes(page);
		}
	}]);
	return Breaks;
}(_handler2.default);

exports.default = Breaks;
},{"../../utils/dom":295,"../handler":284,"babel-runtime/core-js/get-iterator":2,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],287:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _atpage = require('./atpage');

var _atpage2 = _interopRequireDefault(_atpage);

var _breaks = require('./breaks');

var _breaks2 = _interopRequireDefault(_breaks);

var _printMedia = require('./print-media');

var _printMedia2 = _interopRequireDefault(_printMedia);

var _splits = require('./splits');

var _splits2 = _interopRequireDefault(_splits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_atpage2.default, _breaks2.default, _printMedia2.default, _splits2.default];
},{"./atpage":285,"./breaks":286,"./print-media":288,"./splits":289}],288:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PrintMedia = function (_Handler) {
	(0, _inherits3.default)(PrintMedia, _Handler);

	function PrintMedia(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, PrintMedia);
		return (0, _possibleConstructorReturn3.default)(this, (PrintMedia.__proto__ || (0, _getPrototypeOf2.default)(PrintMedia)).call(this, chunker, polisher, caller));
	}

	(0, _createClass3.default)(PrintMedia, [{
		key: "onAtMedia",
		value: function onAtMedia(node, item, list) {
			var media = this.getMediaName(node);
			var rules = void 0;

			if (media === "print") {
				rules = node.block.children;

				// Remove rules from the @media block
				node.block.children = new _cssTree2.default.List();

				// Append rules to the end of main rules list
				list.appendList(rules);
			}
		}
	}, {
		key: "getMediaName",
		value: function getMediaName(node) {
			var media = '';

			if (typeof node.prelude === "undefined" || node.prelude.type !== "AtrulePrelude") {
				return;
			}

			_cssTree2.default.walk(node.prelude, {
				visit: 'Identifier',
				enter: function enter(identNode, iItem, iList) {
					media = identNode.name;
				}
			});
			return media;
		}
	}]);
	return PrintMedia;
}(_handler2.default);

exports.default = PrintMedia;
},{"../handler":284,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17,"css-tree":130}],289:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _handler = require("../handler");

var _handler2 = _interopRequireDefault(_handler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Splits = function (_Handler) {
	(0, _inherits3.default)(Splits, _Handler);

	function Splits(chunker, polisher, caller) {
		(0, _classCallCheck3.default)(this, Splits);
		return (0, _possibleConstructorReturn3.default)(this, (Splits.__proto__ || (0, _getPrototypeOf2.default)(Splits)).call(this, chunker, polisher, caller));
	}

	// layout(pageElement, page) {
	//
	// }

	(0, _createClass3.default)(Splits, [{
		key: "afterPageLayout",
		value: function afterPageLayout(pageElement, page, breakToken, chunker) {
			var splits = (0, _from2.default)(pageElement.querySelectorAll("[data-split-from]"));
			var pages = pageElement.parentNode;
			var index = Array.prototype.indexOf.call(pages.children, pageElement);
			var prevPage = void 0;

			if (index === 0) {
				return;
			}

			prevPage = pages.children[index - 1];

			splits.forEach(function (split) {
				var ref = split.dataset.ref;
				var from = prevPage.querySelector("[data-ref='" + ref + "']:not([data-split-to])");

				if (from) {
					from.dataset.splitTo = ref;

					if (!from.dataset.splitFrom) {
						from.dataset.splitOriginal = true;
					}
				}
			});
		}
	}]);
	return Splits;
}(_handler2.default);

exports.default = Splits;
},{"../handler":284,"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/object/get-prototype-of":6,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/inherits":16,"babel-runtime/helpers/possibleConstructorReturn":17}],290:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n:root {\n  --width: 8.5in;\n  --height: 11in;\n  --margin-top: 1in;\n  --margin-right: 1in;\n  --margin-bottom: 1in;\n  --margin-left: 1in;\n  --page-count: 0;\n}\n\n@page {\n  size: letter;\n  margin: 0;\n}\n\n.pagedjs_page {\n  box-sizing: border-box;\n  width: var(--width);\n  height: var(--height);\n  overflow: hidden;\n  position: relative;\n  display: grid;\n  grid-template-columns: [left] var(--margin-left) [center] calc(var(--width) - var(--margin-left) - var(--margin-right)) [right] var(--margin-right);\n  grid-template-rows: [header] var(--margin-top) [page] calc(var(--height) - var(--margin-top) - var(--margin-bottom)) [footer] var(--margin-bottom);\n}\n\n.pagedjs_page * {\n  box-sizing: border-box;\n}\n\n.pagedjs_margin-top {\n  width: calc(var(--width) - var(--margin-left) - var(--margin-right));\n  height: var(--margin-top);\n  grid-column: center;\n  grid-row: header;\n  flex-wrap: nowrap;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 100%;\n}\n\n.pagedjs_margin-top-left-corner-holder {\n  width: var(--margin-left);\n  height: var(--margin-top);\n  display: flex;\n  grid-column: left;\n  grid-row: header;\n}\n\n.pagedjs_margin-top-right-corner-holder {\n  width: var(--margin-right);\n  height: var(--margin-top);\n  display: flex;\n  grid-column: right;\n  grid-row: header;\n}\n\n.pagedjs_margin-top-left-corner {\n  width: var(--margin-left);\n}\n\n.pagedjs_margin-top-right-corner {\n  width: var(--margin-right);\n}\n\n\n.pagedjs_margin-right {\n  height: calc(var(--height) - var(--margin-top) - var(--margin-bottom));\n  width: var(--margin-right);\n  right: 0;\n  grid-column: right;\n  grid-row: page;\n  display: grid;\n  grid-template-rows: repeat(3, 33.3333%);\n  grid-template-columns: 100%;\n}\n\n\n\n.pagedjs_margin-bottom {\n  width: calc(var(--width) - var(--margin-left) - var(--margin-right));\n  height: var(--margin-bottom);\n  grid-column: center;\n  grid-row: footer;\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 100%;\n}\n\n.pagedjs_margin-bottom-left-corner-holder {\n  width: var(--margin-left);\n  height: var(--margin-bottom);\n  display: flex;\n  grid-column: left;\n  grid-row: footer;\n}\n\n.pagedjs_margin-bottom-right-corner-holder {\n  width: var(--margin-right);\n  height: var(--margin-bottom);\n  display: flex;\n  grid-column: right;\n  grid-row: footer;\n}\n\n.pagedjs_margin-bottom-left-corner {\n  width: var(--margin-left);\n}\n\n.pagedjs_margin-bottom-right-corner {\n  width: var(--margin-right);\n}\n\n\n\n.pagedjs_margin-left {\n  height: calc(var(--height) - var(--margin-top) - var(--margin-bottom));\n  width: var(--margin-left);\n  grid-column: left;\n  grid-row: page;\n  display: grid;\n  grid-template-rows: repeat(3, 33.33333%);\n  grid-template-columns: 100%;\n}\n\n.pagedjs_pages .pagedjs_page .pagedjs_margin:not(.hasContent) {\n  visibility: hidden;\n}\n\n.pagedjs_page > .pagedjs_area {\n  grid-column: center;\n  grid-row: page;\n  width: 100%;\n  height: 100%;\n}\n\n.pagedjs_page > .pagedjs_area > .pagedjs_page_content {\n  width: 100%;\n  height: 100%;\n  position: relative;\n  column-fill: auto;\n}\n\n.pagedjs_page {\n  counter-increment: page;\n}\n\n.pagedjs_pages {\n  counter-reset: pages var(--page-count);\n}\n\n\n.pagedjs_page .pagedjs_margin-top-left-corner,\n.pagedjs_page .pagedjs_margin-top-right-corner,\n.pagedjs_page .pagedjs_margin-bottom-left-corner,\n.pagedjs_page .pagedjs_margin-bottom-right-corner,\n.pagedjs_page .pagedjs_margin-top-left,\n.pagedjs_page .pagedjs_margin-top-right,\n.pagedjs_page .pagedjs_margin-bottom-left,\n.pagedjs_page .pagedjs_margin-bottom-right,\n.pagedjs_page .pagedjs_margin-top-center,\n.pagedjs_page .pagedjs_margin-bottom-center,\n.pagedjs_page .pagedjs_margin-top-center,\n.pagedjs_page .pagedjs_margin-bottom-center,\n.pagedjs_margin-right-middle,\n.pagedjs_margin-left-middle  {\n  display: flex;\n  align-items: center;\n}\n\n.pagedjs_margin-right-top,\n.pagedjs_margin-left-top  {\n  display: flex;\n  align-items: flex-top;\n}\n\n\n.pagedjs_margin-right-bottom,\n.pagedjs_margin-left-bottom  {\n  display: flex;\n  align-items: flex-end;\n}\n\n\n\n/*\n.pagedjs_page .pagedjs_margin-top-center,\n.pagedjs_page .pagedjs_margin-bottom-center {\n  height: 100%;\n  display: none;\n  align-items: center;\n  flex: 1 0 33%;\n  margin: 0 auto;\n}\n\n.pagedjs_page .pagedjs_margin-top-left-corner,\n.pagedjs_page .pagedjs_margin-top-right-corner,\n.pagedjs_page .pagedjs_margin-bottom-right-corner,\n.pagedjs_page .pagedjs_margin-bottom-left-corner {\n  display: none;\n  align-items: center;\n}\n\n.pagedjs_page .pagedjs_margin-left-top,\n.pagedjs_page .pagedjs_margin-right-top {\n  display: none;\n  align-items: flex-start;\n}\n\n.pagedjs_page .pagedjs_margin-right-middle,\n.pagedjs_page .pagedjs_margin-left-middle {\n  display: none;\n  align-items: center;\n}\n\n.pagedjs_page .pagedjs_margin-left-bottom,\n.pagedjs_page .pagedjs_margin-right-bottom {\n  display: none;\n  align-items: flex-end;\n}\n*/\n\n.pagedjs_page .pagedjs_margin-top-left,\n.pagedjs_page .pagedjs_margin-top-right-corner,\n.pagedjs_page .pagedjs_margin-bottom-left,\n.pagedjs_page .pagedjs_margin-bottom-right-corner { text-align: left; }\n\n.pagedjs_page .pagedjs_margin-top-left-corner,\n.pagedjs_page .pagedjs_margin-top-right,\n.pagedjs_page .pagedjs_margin-bottom-left-corner,\n.pagedjs_page .pagedjs_margin-bottom-right { text-align: right; }\n\n.pagedjs_page .pagedjs_margin-top-center,\n.pagedjs_page .pagedjs_margin-bottom-center,\n.pagedjs_page .pagedjs_margin-left-top,\n.pagedjs_page .pagedjs_margin-left-middle,\n.pagedjs_page .pagedjs_margin-left-bottom,\n.pagedjs_page .pagedjs_margin-right-top,\n.pagedjs_page .pagedjs_margin-right-middle,\n.pagedjs_page .pagedjs_margin-right-bottom { text-align: center; }\n\n.pagedjs_pages .pagedjs_margin .pagedjs_margin-content {\n  width: 100%;\n}\n\n.pagedjs_pages .pagedjs_margin-left .pagedjs_margin-content::after,\n.pagedjs_pages .pagedjs_margin-top .pagedjs_margin-content::after,\n.pagedjs_pages .pagedjs_margin-right .pagedjs_margin-content::after,\n.pagedjs_pages .pagedjs_margin-bottom .pagedjs_margin-content::after {\n  display: block;\n}\n\n.pagedjs_pages > .pagedjs_page > .pagedjs_area > div [data-split-to] {\n  margin-bottom: unset;\n  padding-bottom: unset;\n}\n\n.pagedjs_pages > .pagedjs_page > .pagedjs_area > div [data-split-from] {\n  text-indent: unset;\n  margin-top: unset;\n  padding-top: unset;\n  initial-letter: unset;\n}\n\n.pagedjs_pages > .pagedjs_page > .pagedjs_area > div [data-split-from] > *::first-letter,\n.pagedjs_pages > .pagedjs_page > .pagedjs_area > div [data-split-from]::first-letter {\n  color: unset;\n  font-size: unset;\n  font-weight: unset;\n  font-family: unset;\n  color: unset;\n  line-height: unset;\n  float: unset;\n  padding: unset;\n  margin: unset;\n}\n\n/*\n[data-page]:not([data-split-from]),\n[data-break-before=\"page\"]:not([data-split-from]),\n[data-break-before=\"always\"]:not([data-split-from]),\n[data-break-before=\"left\"]:not([data-split-from]),\n[data-break-before=\"right\"]:not([data-split-from]),\n[data-break-before=\"recto\"]:not([data-split-from]),\n[data-break-before=\"verso\"]:not([data-split-from])\n{\n  break-before: column;\n}\n\n[data-page]:not([data-split-to]),\n[data-break-after=\"page\"]:not([data-split-to]),\n[data-break-after=\"always\"]:not([data-split-to]),\n[data-break-after=\"left\"]:not([data-split-to]),\n[data-break-after=\"right\"]:not([data-split-to]),\n[data-break-after=\"recto\"]:not([data-split-to]),\n[data-break-after=\"verso\"]:not([data-split-to])\n{\n  break-after: column;\n}\n*/\n\n.pagedjs_clear-after::after {\n  content: none !important;\n}\n\n@media print {\n  html {\n    width: 100%;\n    height: 100%;\n  }\n  body {\n    margin: 0;\n    padding: 0;\n    width: 100% !important;\n    height: 100% !important;\n    min-width: 100%;\n    max-width: 100%;\n    min-height: 100%;\n    max-height: 100%;\n  }\n  .pagedjs_pages {\n    width: var(--width);\n    display: block !important;\n    transform: none !important;\n    height: 100% !important;\n    min-height: 100%;\n    max-height: 100%;\n    overflow: visible;\n  }\n  .pagedjs_page {\n    margin: 0;\n    padding: 0;\n    max-height: 100%;\n    min-height: 100%;\n    height: 100% !important;\n    page-break-after: always;\n    break-after: page;\n  }\n}\n";
},{}],291:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _sheet = require('./sheet');

var _sheet2 = _interopRequireDefault(_sheet);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _utils = require('../utils/utils');

var _hook = require('../utils/hook');

var _hook2 = _interopRequireDefault(_hook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Polisher = function () {
	function Polisher(setup) {
		(0, _classCallCheck3.default)(this, Polisher);

		this.sheets = [];
		this.inserted = [];

		this.hooks = {};
		this.hooks.onUrl = new _hook2.default(this);
		this.hooks.onAtPage = new _hook2.default(this);
		this.hooks.onAtMedia = new _hook2.default(this);
		this.hooks.onRule = new _hook2.default(this);
		this.hooks.onDeclaration = new _hook2.default(this);
		this.hooks.onContent = new _hook2.default(this);

		this.hooks.beforeTreeParse = new _hook2.default(this);
		this.hooks.beforeTreeWalk = new _hook2.default(this);
		this.hooks.afterTreeWalk = new _hook2.default(this);

		if (setup !== false) {
			this.setup();
		}
	}

	(0, _createClass3.default)(Polisher, [{
		key: 'setup',
		value: function setup() {
			this.base = this.addBase();
			this.inserted.push(this.base);
			this.styleEl = document.createElement("style");
			document.head.appendChild(this.styleEl);
			this.styleSheet = this.styleEl.sheet;
			return this.styleSheet;
		}
	}, {
		key: 'add',
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
				var _arguments = arguments,
				    _this = this;

				var fetched,
				    urls,
				    i,
				    f,
				    _loop,
				    url,
				    _args2 = arguments;

				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								fetched = [];
								urls = [];


								for (i = 0; i < _args2.length; i++) {
									f = void 0;


									if ((0, _typeof3.default)(_args2[i]) === "object") {
										_loop = function _loop(url) {
											var obj = _arguments[i];
											f = new _promise2.default(function (resolve, reject) {
												urls.push(url);
												resolve(obj[url]);
											});
										};

										for (url in _args2[i]) {
											_loop(url);
										}
									} else {
										urls.push(_args2[i]);
										f = fetch(_args2[i]).then(function (response) {
											return response.text();
										});
									}

									fetched.push(f);
								}

								_context2.next = 5;
								return _promise2.default.all(fetched).then(function () {
									var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(originals) {
										var text, original, index, href, sheet, s;
										return _regenerator2.default.wrap(function _callee$(_context) {
											while (1) {
												switch (_context.prev = _context.next) {
													case 0:
														text = "";
														original = void 0, index = void 0;
														href = void 0, sheet = void 0;
														index = 0;

													case 4:
														if (!(index < originals.length)) {
															_context.next = 18;
															break;
														}

														original = originals[index];

														href = urls[index];

														sheet = new _sheet2.default(href, _this.hooks);

														_context.next = 10;
														return sheet.parse(original);

													case 10:

														_this.sheets.push(sheet);

														if (typeof sheet.width !== "undefined") {
															_this.width = sheet.width;
														}

														if (typeof sheet.height !== "undefined") {
															_this.height = sheet.height;
														}

														if (typeof sheet.orientation !== "undefined") {
															_this.orientation = sheet.orientation;
														}

														text += sheet.toString();

													case 15:
														index++;
														_context.next = 4;
														break;

													case 18:
														s = _this.insert(text);

														_this.inserted.push(s);
														// console.log(text);
														return _context.abrupt('return', text);

													case 21:
													case 'end':
														return _context.stop();
												}
											}
										}, _callee, _this);
									}));

									return function (_x) {
										return _ref2.apply(this, arguments);
									};
								}());

							case 5:
								return _context2.abrupt('return', _context2.sent);

							case 6:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function add() {
				return _ref.apply(this, arguments);
			}

			return add;
		}()
	}, {
		key: 'addBase',
		value: function addBase() {
			return this.insert(_base2.default);
		}
	}, {
		key: 'insert',
		value: function insert(text) {
			var head = document.querySelector("head");
			var style = document.createElement("style");
			style.type = "text/css";
			style.setAttribute("data-pagedjs-inserted-styles", "true");

			style.appendChild(document.createTextNode(text));

			head.appendChild(style);

			return style;
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this.styleEl.remove();
			this.inserted.forEach(function (s) {
				s.remove();
			});
			this.sheets = [];
		}
	}]);
	return Polisher;
}();

exports.default = Polisher;
},{"../utils/hook":297,"../utils/utils":298,"./base":290,"./sheet":292,"babel-runtime/core-js/promise":9,"babel-runtime/helpers/asyncToGenerator":13,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/typeof":19,"babel-runtime/regenerator":20}],292:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _cssTree = require("css-tree");

var _cssTree2 = _interopRequireDefault(_cssTree);

var _utils = require("../utils/utils");

var _hook = require("../utils/hook");

var _hook2 = _interopRequireDefault(_hook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sheet = function () {
	function Sheet(url, hooks) {
		(0, _classCallCheck3.default)(this, Sheet);


		if (hooks) {
			this.hooks = hooks;
		} else {
			this.hooks = {};
			this.hooks.onUrl = new _hook2.default(this);
			this.hooks.onAtPage = new _hook2.default(this);
			this.hooks.onAtMedia = new _hook2.default(this);
			this.hooks.onRule = new _hook2.default(this);
			this.hooks.onDeclaration = new _hook2.default(this);
			this.hooks.onContent = new _hook2.default(this);

			this.hooks.beforeTreeParse = new _hook2.default(this);
			this.hooks.beforeTreeWalk = new _hook2.default(this);
			this.hooks.afterTreeWalk = new _hook2.default(this);
		}

		try {
			this.url = new URL(url, window.location.href);
		} catch (e) {
			this.url = new URL(window.location.href);
		}
	}

	// parse


	(0, _createClass3.default)(Sheet, [{
		key: "parse",
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(text) {
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								this.text = text;

								_context.next = 3;
								return this.hooks.beforeTreeParse.trigger(this.text, this);

							case 3:

								// send to csstree
								this.ast = _cssTree2.default.parse(this._text);

								_context.next = 6;
								return this.hooks.beforeTreeWalk.trigger(this.ast);

							case 6:

								// Replace urls
								this.replaceUrls(this.ast);

								// Scope
								this.id = (0, _utils.UUID)();
								// this.addScope(this.ast, this.uuid);

								// Replace IDs with data-id
								this.replaceIds(this.ast);

								// Trigger Hooks
								this.urls(this.ast);
								this.rules(this.ast);
								this.atrules(this.ast);

								_context.next = 14;
								return this.hooks.afterTreeWalk.trigger(this.ast, this);

							case 14:
								return _context.abrupt("return", this.ast);

							case 15:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function parse(_x) {
				return _ref.apply(this, arguments);
			}

			return parse;
		}()
	}, {
		key: "insertRule",
		value: function insertRule(rule) {
			var _this = this;

			var inserted = this.ast.children.appendData(rule);
			inserted.forEach(function (item) {
				_this.declarations(item);
			});
		}
	}, {
		key: "urls",
		value: function urls(ast) {
			var _this2 = this;

			_cssTree2.default.walk(ast, {
				visit: 'Url',
				enter: function enter(node, item, list) {
					_this2.hooks.onUrl.trigger(node, item, list);
				}
			});
		}
	}, {
		key: "atrules",
		value: function atrules(ast) {
			var _this3 = this;

			_cssTree2.default.walk(ast, {
				visit: 'Atrule',
				enter: function enter(node, item, list) {
					var basename = _cssTree2.default.keyword(node.name).basename;

					if (basename === "page") {
						_this3.hooks.onAtPage.trigger(node, item, list);
						_this3.declarations(node, item, list);
					}

					if (basename === "media") {
						_this3.hooks.onAtMedia.trigger(node, item, list);
						_this3.declarations(node, item, list);
					}
				}
			});
		}
	}, {
		key: "rules",
		value: function rules(ast) {
			var _this4 = this;

			var parsed = {};
			_cssTree2.default.walk(ast, {
				visit: 'Rule',
				enter: function enter(ruleNode, ruleItem, rulelist) {
					// console.log("rule", ruleNode);

					_this4.hooks.onRule.trigger(ruleNode, ruleItem, rulelist);
					_this4.declarations(ruleNode, ruleItem, rulelist);
				}
			});
		}
	}, {
		key: "declarations",
		value: function declarations(ruleNode, ruleItem, rulelist) {
			var _this5 = this;

			_cssTree2.default.walk(ruleNode, {
				visit: 'Declaration',
				enter: function enter(declarationNode, dItem, dList) {
					// console.log(declarationNode);

					_this5.hooks.onDeclaration.trigger(declarationNode, dItem, dList, { ruleNode: ruleNode, ruleItem: ruleItem, rulelist: rulelist });

					if (declarationNode.property === "content") {
						_cssTree2.default.walk(declarationNode, {
							visit: 'Function',
							enter: function enter(funcNode, fItem, fList) {
								_this5.hooks.onContent.trigger(funcNode, fItem, fList, { declarationNode: declarationNode, dItem: dItem, dList: dList }, { ruleNode: ruleNode, ruleItem: ruleItem, rulelist: rulelist });
							}
						});
					}
				}
			});
		}
	}, {
		key: "replaceUrls",
		value: function replaceUrls(ast) {
			var _this6 = this;

			_cssTree2.default.walk(ast, {
				visit: 'Url',
				enter: function enter(node, item, list) {
					var href = node.value.value.replace(/["|']/g, '');
					var url = new URL(href, _this6.url);
					node.value.value = url.toString();
				}
			});
		}
	}, {
		key: "addScope",
		value: function addScope(ast, id) {
			// Get all selector lists
			// add an id
			_cssTree2.default.walk(ast, {
				visit: 'Selector',
				enter: function enter(node, item, list) {
					var children = node.children;
					children.prepend(children.createItem({
						type: 'WhiteSpace',
						value: " "
					}));
					children.prepend(children.createItem({
						type: 'IdSelector',
						name: id,
						loc: null,
						children: null
					}));
				}
			});
		}
	}, {
		key: "getNamedPageSelectors",
		value: function getNamedPageSelectors(ast) {
			var namedPageSelectors = {};
			_cssTree2.default.walk(ast, {
				visit: 'Rule',
				enter: function enter(node, item, list) {
					_cssTree2.default.walk(node, {
						visit: 'Declaration',
						enter: function enter(declaration, dItem, dList) {
							if (declaration.property === "page") {
								var value = declaration.value.children.first();
								var name = value.name;
								var selector = _cssTree2.default.generate(node.prelude);
								namedPageSelectors[name] = {
									name: name,
									selector: selector

									// dList.remove(dItem);

									// Add in page break
								};declaration.property = "break-before";
								value.type = "Identifier";
								value.name = "always";
							}
						}
					});
				}
			});
			return namedPageSelectors;
		}
	}, {
		key: "replaceIds",
		value: function replaceIds(ast) {
			_cssTree2.default.walk(ast, {
				visit: 'Rule',
				enter: function enter(node, item, list) {

					_cssTree2.default.walk(node, {
						visit: 'IdSelector',
						enter: function enter(idNode, idItem, idList) {
							var name = idNode.name;
							idNode.flags = null;
							idNode.matcher = "=";
							idNode.name = { type: "Identifier", loc: null, name: "data-id" };
							idNode.type = "AttributeSelector";
							idNode.value = { type: "String", loc: null, value: "\"" + name + "\"" };
						}
					});
				}
			});
		}
	}, {
		key: "toString",


		// generate string
		value: function toString(ast) {
			return _cssTree2.default.generate(ast || this.ast);
		}
	}, {
		key: "text",
		set: function set(t) {
			this._text = t;
		},
		get: function get() {
			return this._text;
		}
	}]);
	return Sheet;
}();

exports.default = Sheet;
},{"../utils/hook":297,"../utils/utils":298,"babel-runtime/helpers/asyncToGenerator":13,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/regenerator":20,"css-tree":130}],293:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
// https://www.w3.org/TR/css3-page/#page-size-prop

exports.default = {
	"A0": {
		width: {
			value: 841,
			unit: "mm"
		},
		height: {
			value: 1189,
			unit: "mm"
		}
	},
	"A1": {
		width: {
			value: 594,
			unit: "mm"
		},
		height: {
			value: 841,
			unit: "mm"
		}
	},
	"A2": {
		width: {
			value: 420,
			unit: "mm"
		},
		height: {
			value: 594,
			unit: "mm"
		}
	},
	"A3": {
		width: {
			value: 297,
			unit: "mm"
		},
		height: {
			value: 420,
			unit: "mm"
		}
	},
	"A4": {
		width: {
			value: 210,
			unit: "mm"
		},
		height: {
			value: 297,
			unit: "mm"
		}
	},
	"A5": {
		width: {
			value: 148,
			unit: "mm"
		},
		height: {
			value: 210,
			unit: "mm"
		}
	},
	"A6": {
		width: {
			value: 105,
			unit: "mm"
		},
		height: {
			value: 148,
			unit: "mm"
		}
	},
	"A7": {
		width: {
			value: 74,
			unit: "mm"
		},
		height: {
			value: 105,
			unit: "mm"
		}
	},
	"A8": {
		width: {
			value: 52,
			unit: "mm"
		},
		height: {
			value: 74,
			unit: "mm"
		}
	},
	"A9": {
		width: {
			value: 37,
			unit: "mm"
		},
		height: {
			value: 52,
			unit: "mm"
		}
	},
	"A10": {
		width: {
			value: 26,
			unit: "mm"
		},
		height: {
			value: 37,
			unit: "mm"
		}
	},
	"B4": {
		width: {
			value: 250,
			unit: "mm"
		},
		height: {
			value: 353,
			unit: "mm"
		}
	},
	"B5": {
		width: {
			value: 250,
			unit: "mm"
		},
		height: {
			value: 250,
			unit: "mm"
		}
	},
	"letter": {
		width: {
			value: 8.5,
			unit: "in"
		},
		height: {
			value: 11,
			unit: "in"
		}
	},
	"legal": {
		width: {
			value: 8.5,
			unit: "mm"
		},
		height: {
			value: 14,
			unit: "mm"
		}
	},
	"ledger": {
		width: {
			value: 11,
			unit: "mm"
		},
		height: {
			value: 17,
			unit: "mm"
		}
	}
};
},{}],294:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _eventEmitter = require("event-emitter");

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _hook = require("../utils/hook");

var _hook2 = _interopRequireDefault(_hook);

var _chunker = require("../chunker/chunker");

var _chunker2 = _interopRequireDefault(_chunker);

var _polisher2 = require("../polisher/polisher");

var _polisher3 = _interopRequireDefault(_polisher2);

var _handlers = require("../utils/handlers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Previewer = function () {
	function Previewer() {
		var _this = this;

		(0, _classCallCheck3.default)(this, Previewer);

		// this.preview = this.getParams("preview") !== "false";

		// Process styles
		this.polisher = new _polisher3.default(false);

		// Chunk contents
		this.chunker = new _chunker2.default();

		// Hooks
		this.hooks = {};
		this.hooks.beforePolishing = new _hook2.default(this);
		this.hooks.beforeChunking = new _hook2.default(this);

		// default size
		this.size = {
			width: {
				value: 8.5,
				unit: "in"
			},
			height: {
				value: 11,
				unit: "in"
			},
			format: undefined,
			orientation: undefined
		};

		var counter = 0;
		this.chunker.on("page", function (page) {
			counter += 1;
			_this.emit("page", page);
			if (typeof window.PuppeteerLogger !== "undefined") {
				window.PuppeteerLogger("page", counter);
			}
		});

		this.chunker.on("rendering", function () {
			_this.emit("rendering", _this.chunker);
		});
	}

	(0, _createClass3.default)(Previewer, [{
		key: "initializeHandlers",
		value: function initializeHandlers() {
			var _this2 = this;

			var handlers = (0, _handlers.initializeHandlers)(this.chunker, this.polisher, this);

			handlers.on("size", function (size) {
				_this2.size = size;
			});

			return handlers;
		}
	}, {
		key: "registerHandlers",
		value: function registerHandlers() {
			return _handlers.registerHandlers.apply(_handlers.registerHandlers, arguments);
		}
	}, {
		key: "getParams",
		value: function getParams(name) {
			var param = void 0;
			var url = new URL(window.location);
			var params = new URLSearchParams(url.search);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)(params.entries()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					if (pair[0] === name) {
						param = pair[1];
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return param;
		}
	}, {
		key: "wrapContent",
		value: function wrapContent() {
			// Wrap body in template tag
			var body = document.querySelector("body");

			// Check if a template exists
			var template = void 0;
			template = body.querySelector(":scope > template");

			if (!template) {
				// Otherwise create one
				template = document.createElement("template");
				template.innerHTML = body.innerHTML;
				body.innerHTML = '';
				body.appendChild(template);
			}

			return template.content;
		}
	}, {
		key: "removeStyles",
		value: function removeStyles() {
			// Get all stylesheets
			var stylesheets = (0, _from2.default)(document.querySelectorAll("link[rel='stylesheet']"));
			var hrefs = stylesheets.map(function (sheet) {
				sheet.remove();
				return sheet.href;
			});

			// Get inline styles
			var inlineStyles = (0, _from2.default)(document.querySelectorAll("style:not([data-pagedjs-inserted-styles])"));
			inlineStyles.forEach(function (inlineStyle) {
				var obj = {};
				obj[window.location.href] = inlineStyle.textContent;
				hrefs.push(obj);
				inlineStyle.remove();
			});

			return hrefs;
		}
	}, {
		key: "preview",
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(content, stylesheets, renderTo) {
				var _polisher;

				var handlers, styleText, startTime, flow, endTime, msg;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (!content) {
									content = this.wrapContent();
								}

								if (!stylesheets) {
									stylesheets = this.removeStyles();
								}

								this.polisher.setup();

								handlers = this.initializeHandlers();
								_context.next = 6;
								return (_polisher = this.polisher).add.apply(_polisher, (0, _toConsumableArray3.default)(stylesheets));

							case 6:
								styleText = _context.sent;
								startTime = performance.now();

								// Render flow

								_context.next = 10;
								return this.chunker.flow(content, renderTo);

							case 10:
								flow = _context.sent;
								endTime = performance.now();
								msg = "Rendering " + flow.total + " pages took " + (endTime - startTime) + " milliseconds.";


								this.emit("rendered", msg, this.size.width && this.size.width.value + this.size.width.unit, this.size.height && this.size.height.value + this.size.height.unit, this.size.orientation, this.size.format);
								if (typeof window.onPagesRendered !== "undefined") {
									window.onPagesRendered(msg, this.size.width && this.size.width.value + this.size.width.unit, this.size.height && this.size.height.value + this.size.height.unit, this.size.orientation, this.size.format);
								}

								return _context.abrupt("return", flow);

							case 16:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function preview(_x, _x2, _x3) {
				return _ref.apply(this, arguments);
			}

			return preview;
		}()
	}]);
	return Previewer;
}();

(0, _eventEmitter2.default)(Previewer.prototype);

exports.default = Previewer;
},{"../chunker/chunker":274,"../polisher/polisher":291,"../utils/handlers":296,"../utils/hook":297,"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/get-iterator":2,"babel-runtime/helpers/asyncToGenerator":13,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15,"babel-runtime/helpers/toConsumableArray":18,"babel-runtime/regenerator":20,"event-emitter":272}],295:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.isElement = isElement;
exports.isText = isText;
exports.walk = walk;
exports.nodeAfter = nodeAfter;
exports.nodeBefore = nodeBefore;
exports.elementAfter = elementAfter;
exports.elementBefore = elementBefore;
exports.stackChildren = stackChildren;
exports.rebuildAncestors = rebuildAncestors;
exports.needsBreakBefore = needsBreakBefore;
exports.needsBreakAfter = needsBreakAfter;
exports.needsPreviousBreakAfter = needsPreviousBreakAfter;
exports.needsPageBreak = needsPageBreak;
exports.words = words;
exports.letters = letters;
exports.isContainer = isContainer;
exports.cloneNode = cloneNode;
exports.findElement = findElement;
exports.findRef = findRef;
exports.validNode = validNode;
exports.prevValidNode = prevValidNode;
exports.nextValidNode = nextValidNode;
exports.indexOf = indexOf;
exports.child = child;
exports.isVisible = isVisible;

var _utils = require("../utils/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(walk),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(words),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(letters);

function isElement(node) {
	return node && node.nodeType === 1;
}

function isText(node) {
	return node && node.nodeType === 3;
}

function walk(start, limiter) {
	var node;
	return _regenerator2.default.wrap(function walk$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					node = start;

				case 1:
					if (!node) {
						_context.next = 27;
						break;
					}

					_context.next = 4;
					return node;

				case 4:
					if (!node.childNodes.length) {
						_context.next = 8;
						break;
					}

					node = node.firstChild;
					_context.next = 25;
					break;

				case 8:
					if (!node.nextSibling) {
						_context.next = 15;
						break;
					}

					if (!(limiter && node === limiter)) {
						_context.next = 12;
						break;
					}

					node = undefined;
					return _context.abrupt("break", 27);

				case 12:
					node = node.nextSibling;
					_context.next = 25;
					break;

				case 15:
					if (!node) {
						_context.next = 25;
						break;
					}

					node = node.parentNode;

					if (!(limiter && node === limiter)) {
						_context.next = 20;
						break;
					}

					node = undefined;
					return _context.abrupt("break", 25);

				case 20:
					if (!(node && node.nextSibling)) {
						_context.next = 23;
						break;
					}

					node = node.nextSibling;
					return _context.abrupt("break", 25);

				case 23:
					_context.next = 15;
					break;

				case 25:
					_context.next = 1;
					break;

				case 27:
				case "end":
					return _context.stop();
			}
		}
	}, _marked, this);
}

function nodeAfter(node, limiter) {
	var after = node;

	if (after.nextSibling) {
		if (limiter && node === limiter) {
			return;
		}
		after = after.nextSibling;
	} else {
		while (after) {
			after = after.parentNode;
			if (limiter && after === limiter) {
				after = undefined;
				break;
			}
			if (after && after.nextSibling) {
				after = after.nextSibling;
				break;
			}
		}
	}

	return after;
}

function nodeBefore(node, limiter) {
	var before = node;

	if (before.prevSibling) {
		if (limiter && node === limiter) {
			return;
		}
		before = before.prevSibling;
	} else {
		while (before) {
			before = before.parentNode;
			if (limiter && before === limiter) {
				before = undefined;
				break;
			}
			if (before && before.prevSibling) {
				before = prev.nextSibling;
				break;
			}
		}
	}

	return before;
}

function elementAfter(node, limiter) {
	var after = nodeAfter(node);

	while (after && after.nodeType !== 1) {
		after = nodeAfter(after);
	}

	return after;
}

function elementBefore(node, limiter) {
	var before = nodeAfter(node);

	while (before && before.nodeType !== 1) {
		before = nodeAfter(before);
	}

	return before;
}

function stackChildren(currentNode, stacked) {
	var stack = stacked || [];

	stack.unshift(currentNode);

	var children = currentNode.children;
	for (var i = 0, length = children.length; i < length; i++) {
		stackChildren(children[i], stack);
	}

	return stack;
}

function rebuildAncestors(node) {
	var parent = void 0,
	    ancestor = void 0;
	var ancestors = [];
	var added = [];

	var fragment = document.createDocumentFragment();

	// Gather all ancestors
	var element = node;
	while (element.parentNode && element.parentNode.nodeType === 1) {
		ancestors.unshift(element.parentNode);
		element = element.parentNode;
	}

	for (var i = 0; i < ancestors.length; i++) {
		ancestor = ancestors[i];
		parent = ancestor.cloneNode(false);

		parent.setAttribute("data-split-from", parent.getAttribute("data-ref"));
		// ancestor.setAttribute("data-split-to", parent.getAttribute("data-ref"));

		if (parent.hasAttribute("id")) {
			var dataID = parent.getAttribute("id");
			parent.setAttribute("data-id", dataID);
			parent.removeAttribute("id");
		}

		// This is handled by css :not, but also tidied up here
		if (parent.hasAttribute("data-break-before")) {
			parent.removeAttribute("data-break-before");
		}

		if (parent.hasAttribute("data-previous-break-after")) {
			parent.removeAttribute("data-previous-break-after");
		}

		if (added.length) {
			var container = added[added.length - 1];
			container.appendChild(parent);
		} else {
			fragment.appendChild(parent);
		}
		added.push(parent);
	}

	added = undefined;
	return fragment;
}

/*
export function split(bound, cutElement, breakAfter) {
		let needsRemoval = [];
		let index = indexOf(cutElement);

		if (!breakAfter && index === 0) {
			return;
		}

		if (breakAfter && index === (cutElement.parentNode.children.length - 1)) {
			return;
		}

		// Create a fragment with rebuilt ancestors
		let fragment = rebuildAncestors(cutElement);

		// Clone cut
		if (!breakAfter) {
			let clone = cutElement.cloneNode(true);
			let ref = cutElement.parentNode.getAttribute('data-ref');
			let parent = fragment.querySelector("[data-ref='" + ref + "']");
			parent.appendChild(clone);
			needsRemoval.push(cutElement);
		}

		// Remove all after cut
		let next = nodeAfter(cutElement, bound);
		while (next) {
			let clone = next.cloneNode(true);
			let ref = next.parentNode.getAttribute('data-ref');
			let parent = fragment.querySelector("[data-ref='" + ref + "']");
			parent.appendChild(clone);
			needsRemoval.push(next);
			next = nodeAfter(next, bound);
		}

		// Remove originals
		needsRemoval.forEach((node) => {
			if (node) {
				node.remove();
			}
		});

		// Insert after bounds
		bound.parentNode.insertBefore(fragment, bound.nextSibling);
		return [bound, bound.nextSibling];
}
*/

function needsBreakBefore(node) {
	if (typeof node !== "undefined" && typeof node.dataset !== "undefined" && typeof node.dataset.breakBefore !== "undefined" && (node.dataset.breakBefore === "always" || node.dataset.breakBefore === "page" || node.dataset.breakBefore === "left" || node.dataset.breakBefore === "right" || node.dataset.breakBefore === "recto" || node.dataset.breakBefore === "verso")) {
		return true;
	}

	return false;
}

function needsBreakAfter(node) {
	if (typeof node !== "undefined" && typeof node.dataset !== "undefined" && typeof node.dataset.breakAfter !== "undefined" && (node.dataset.breakAfter === "always" || node.dataset.breakAfter === "page" || node.dataset.breakAfter === "left" || node.dataset.breakAfter === "right" || node.dataset.breakAfter === "recto" || node.dataset.breakAfter === "verso")) {
		return true;
	}

	return false;
}

function needsPreviousBreakAfter(node) {
	if (typeof node !== "undefined" && typeof node.dataset !== "undefined" && typeof node.dataset.previousBreakAfter !== "undefined" && (node.dataset.previousBreakAfter === "always" || node.dataset.previousBreakAfter === "page" || node.dataset.previousBreakAfter === "left" || node.dataset.previousBreakAfter === "right" || node.dataset.previousBreakAfter === "recto" || node.dataset.previousBreakAfter === "verso")) {
		return true;
	}

	return false;
}

function needsPageBreak(node) {
	if (typeof node !== "undefined" && typeof node.dataset !== "undefined" && (node.dataset.page || node.dataset.afterPage)) {
		return true;
	}

	return false;
}

function words(node) {
	var currentText, max, currentOffset, currentLetter, range;
	return _regenerator2.default.wrap(function words$(_context2) {
		while (1) {
			switch (_context2.prev = _context2.next) {
				case 0:
					currentText = node.nodeValue;
					max = currentText.length;
					currentOffset = 0;
					currentLetter = void 0;
					range = void 0;

				case 5:
					if (!(currentOffset < max)) {
						_context2.next = 19;
						break;
					}

					currentLetter = currentText[currentOffset];

					if (!/^\S$/.test(currentLetter)) {
						_context2.next = 11;
						break;
					}

					if (!range) {
						range = document.createRange();
						range.setStart(node, currentOffset);
					}
					_context2.next = 16;
					break;

				case 11:
					if (!range) {
						_context2.next = 16;
						break;
					}

					range.setEnd(node, currentOffset);
					_context2.next = 15;
					return range;

				case 15:
					range = undefined;

				case 16:

					currentOffset += 1;
					_context2.next = 5;
					break;

				case 19:
					if (!range) {
						_context2.next = 24;
						break;
					}

					range.setEnd(node, currentOffset);
					_context2.next = 23;
					return range;

				case 23:
					range = undefined;

				case 24:
				case "end":
					return _context2.stop();
			}
		}
	}, _marked2, this);
}

function letters(wordRange) {
	var currentText, max, currentOffset, currentLetter, range;
	return _regenerator2.default.wrap(function letters$(_context3) {
		while (1) {
			switch (_context3.prev = _context3.next) {
				case 0:
					currentText = wordRange.startContainer;
					max = currentText.length;
					currentOffset = wordRange.startOffset;
					currentLetter = void 0;
					range = void 0;

				case 5:
					if (!(currentOffset < max)) {
						_context3.next = 15;
						break;
					}

					currentLetter = currentText[currentOffset];
					range = document.createRange();
					range.setStart(currentText, currentOffset);
					range.setEnd(currentText, currentOffset + 1);

					_context3.next = 12;
					return range;

				case 12:

					currentOffset += 1;
					_context3.next = 5;
					break;

				case 15:
				case "end":
					return _context3.stop();
			}
		}
	}, _marked3, this);
}

function isContainer(node) {
	var container = void 0;

	if (typeof node.tagName === "undefined") {
		return true;
	}

	if (node.style.display === "none") {
		return false;
	}

	switch (node.tagName) {
		// Inline
		case "A":
		case "ABBR":
		case "ACRONYM":
		case "B":
		case "BDO":
		case "BIG":
		case "BR":
		case "BUTTON":
		case "CITE":
		case "CODE":
		case "DFN":
		case "EM":
		case "I":
		case "IMG":
		case "INPUT":
		case "KBD":
		case "LABEL":
		case "MAP":
		case "OBJECT":
		case "Q":
		case "SAMP":
		case "SCRIPT":
		case "SELECT":
		case "SMALL":
		case "SPAN":
		case "STRONG":
		case "SUB":
		case "SUP":
		case "TEXTAREA":
		case "TIME":
		case "TT":
		case "VAR":
		// Content
		case "P":
		case "H1":
		case "H2":
		case "H3":
		case "H4":
		case "H5":
		case "H6":
		case "FIGCAPTION":
		case "BLOCKQUOTE":
		case "PRE":
		case "LI":
		case "TR":
		case "DT":
		case "DD":
		case "VIDEO":
		case "CANVAS":
			container = false;
			break;
		default:
			container = true;
	}

	return container;
}

function cloneNode(n) {
	var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	return n.cloneNode(deep);
}

function findElement(node, doc) {
	var ref = node.getAttribute("data-ref");
	return findRef(ref, doc);
}

function findRef(ref, doc) {
	return doc.querySelector("[data-ref='" + ref + "']");
}

function validNode(node) {
	if (isText(node)) {
		return true;
	}

	if (isElement(node) && node.dataset.ref) {
		return true;
	}

	return false;
}

function prevValidNode(node) {
	while (!validNode(node)) {
		if (node.previousSibling) {
			node = node.previousSibling;
		} else {
			node = node.parentNode;
		}

		if (!node) {
			break;
		}
	}

	return node;
}

function nextValidNode(node) {
	while (!validNode(node)) {
		if (node.nextSibling) {
			node = node.nextSibling;
		} else {
			node = node.parentNode.nextSibling;
		}

		if (!node) {
			break;
		}
	}

	return node;
}

function indexOf(node) {
	var parent = node.parentNode;
	if (!parent) {
		return 0;
	}
	return Array.prototype.indexOf.call(parent.childNodes, node);
}

function child(node, index) {
	return node.childNodes[index];
}

function isVisible(node) {
	if (isElement(node) && window.getComputedStyle(node).display !== "none") {
		return true;
	} else if (isText(node) && node.textContent.trim().length && window.getComputedStyle(node.parentNode).display !== "none") {
		return true;
	}
	return false;
}
},{"../utils/utils":298,"babel-runtime/regenerator":20}],296:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.registerHandlers = registerHandlers;
exports.initializeHandlers = initializeHandlers;

var _index = require('../modules/paged-media/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('../modules/generated-content/index');

var _index4 = _interopRequireDefault(_index3);

var _eventEmitter = require('event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _pipe = require('event-emitter/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registeredHandlers = [].concat((0, _toConsumableArray3.default)(_index2.default), (0, _toConsumableArray3.default)(_index4.default));

var Handlers = function Handlers(chunker, polisher, caller) {
	var _this = this;

	(0, _classCallCheck3.default)(this, Handlers);

	var handlers = [];

	registeredHandlers.forEach(function (Handler) {
		var handler = new Handler(chunker, polisher, caller);
		handlers.push(handler);
		(0, _pipe2.default)(handler, _this);
	});
};

(0, _eventEmitter2.default)(Handlers.prototype);

function registerHandlers() {
	for (var i = 0; i < arguments.length; i++) {
		registeredHandlers.push(arguments[i]);
	}
}

function initializeHandlers(chunker, polisher, caller) {
	var handlers = new Handlers(chunker, polisher, caller);
	return handlers;
}
},{"../modules/generated-content/index":279,"../modules/paged-media/index":287,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/toConsumableArray":18,"event-emitter":272,"event-emitter/pipe":273}],297:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Hooks allow for injecting functions that must all complete in order before finishing
 * They will execute in parallel but all must finish before continuing
 * Functions may return a promise if they are asycn.
 * From epubjs/src/utils/hooks
 * @param {any} context scope of this
 * @example this.content = new Hook(this);
 */
var Hook = function () {
	function Hook(context) {
		(0, _classCallCheck3.default)(this, Hook);

		this.context = context || this;
		this.hooks = [];
	}

	/**
  * Adds a function to be run before a hook completes
  * @example this.content.register(function(){...});
  */


	(0, _createClass3.default)(Hook, [{
		key: "register",
		value: function register() {
			for (var i = 0; i < arguments.length; ++i) {
				if (typeof arguments[i] === "function") {
					this.hooks.push(arguments[i]);
				} else {
					// unpack array
					for (var j = 0; j < arguments[i].length; ++j) {
						this.hooks.push(arguments[i][j]);
					}
				}
			}
		}

		/**
   * Triggers a hook to run all functions
   * @example this.content.trigger(args).then(function(){...});
   */

	}, {
		key: "trigger",
		value: function trigger() {
			var args = arguments;
			var context = this.context;
			var promises = [];

			this.hooks.forEach(function (task) {
				var executing = task.apply(context, args);

				if (executing && typeof executing["then"] === "function") {
					// Task is a function that returns a promise
					promises.push(executing);
				}
				// Otherwise Task resolves immediately, continue
			});

			return _promise2.default.all(promises);
		}

		// Adds a function to be run before a hook completes

	}, {
		key: "list",
		value: function list() {
			return this.hooks;
		}
	}, {
		key: "clear",
		value: function clear() {
			return this.hooks = [];
		}
	}]);
	return Hook;
}();

exports.default = Hook;
},{"babel-runtime/core-js/promise":9,"babel-runtime/helpers/classCallCheck":14,"babel-runtime/helpers/createClass":15}],298:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBoundingClientRect = getBoundingClientRect;
exports.UUID = UUID;
exports.positionInNodeList = positionInNodeList;
exports.findCssSelector = findCssSelector;
exports.attr = attr;
function getBoundingClientRect(element) {
  if (!element) {
    return;
  }
  var rect = void 0;
  if (typeof element.getBoundingClientRect !== "undefined") {
    rect = element.getBoundingClientRect();
  } else {
    var range = document.createRange();
    range.selectNode(element);
    rect = range.getBoundingClientRect();
  }
  return rect;
}

/**
 * Generates a UUID
 * based on: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 * @returns {string} uuid
 */
function UUID() {
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
}

// From: https://hg.mozilla.org/mozilla-central/file/tip/toolkit/modules/css-selector.js#l52

/**
 * Find the position of [element] in [nodeList].
 * @returns an index of the match, or -1 if there is no match
 */
function positionInNodeList(element, nodeList) {
  for (var i = 0; i < nodeList.length; i++) {
    if (element === nodeList[i]) {
      return i;
    }
  }
  return -1;
}

/**
 * Find a unique CSS selector for a given element
 * @returns a string such that ele.ownerDocument.querySelector(reply) === ele
 * and ele.ownerDocument.querySelectorAll(reply).length === 1
 */
function findCssSelector(ele) {
  var document = ele.ownerDocument;
  // Fred: commented out to allow for parsing in fragments
  // if (!document || !document.contains(ele)) {
  //   throw new Error("findCssSelector received element not inside document");
  // }

  var cssEscape = window.CSS.escape;

  // document.querySelectorAll("#id") returns multiple if elements share an ID
  if (ele.id && document.querySelectorAll("#" + cssEscape(ele.id)).length === 1) {
    return "#" + cssEscape(ele.id);
  }

  // Inherently unique by tag name
  var tagName = ele.localName;
  if (tagName === "html") {
    return "html";
  }
  if (tagName === "head") {
    return "head";
  }
  if (tagName === "body") {
    return "body";
  }

  // We might be able to find a unique class name
  var selector = void 0,
      index = void 0,
      matches = void 0;
  if (ele.classList.length > 0) {
    for (var i = 0; i < ele.classList.length; i++) {
      // Is this className unique by itself?
      selector = "." + cssEscape(ele.classList.item(i));
      matches = document.querySelectorAll(selector);
      if (matches.length === 1) {
        return selector;
      }
      // Maybe it's unique with a tag name?
      selector = cssEscape(tagName) + selector;
      matches = document.querySelectorAll(selector);
      if (matches.length === 1) {
        return selector;
      }
      // Maybe it's unique using a tag name and nth-child
      index = positionInNodeList(ele, ele.parentNode.children) + 1;
      selector = selector + ":nth-child(" + index + ")";
      matches = document.querySelectorAll(selector);
      if (matches.length === 1) {
        return selector;
      }
    }
  }

  // Not unique enough yet.  As long as it's not a child of the document,
  // continue recursing up until it is unique enough.
  if (ele.parentNode !== document && ele.parentNode.nodeType === 1) {
    index = positionInNodeList(ele, ele.parentNode.children) + 1;
    selector = findCssSelector(ele.parentNode) + " > " + cssEscape(tagName) + ":nth-child(" + index + ")";
  }

  return selector;
};

function attr(element, attributes) {
  for (var i = 0; i < attributes.length; i++) {
    if (element.hasAttribute(attributes[i])) {
      return element.getAttribute(attributes[i]);
    }
  }
}
},{}],299:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":300}],300:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],301:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;

},{"./util":310}],302:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = require('./base64');

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

},{"./base64":303}],303:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

},{}],304:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

},{}],305:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;

},{"./util":310}],306:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

},{}],307:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var binarySearch = require('./binary-search');
var ArraySet = require('./array-set').ArraySet;
var base64VLQ = require('./base64-vlq');
var quickSort = require('./quick-sort').quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

},{"./array-set":301,"./base64-vlq":302,"./binary-search":304,"./quick-sort":306,"./util":310}],308:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = require('./base64-vlq');
var util = require('./util');
var ArraySet = require('./array-set').ArraySet;
var MappingList = require('./mapping-list').MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
        throw new Error(
            'original.line and original.column are not numbers -- you probably meant to omit ' +
            'the original mapping entirely and only map the generated position. If so, pass ' +
            'null for the original mapping instead of an object with empty or null values.'
        );
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;

},{"./array-set":301,"./base64-vlq":302,"./mapping-list":305,"./util":310}],309:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
var util = require('./util');

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;

},{"./source-map-generator":308,"./util":310}],310:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

},{}],311:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./lib/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./lib/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./lib/source-node').SourceNode;

},{"./lib/source-map-consumer":307,"./lib/source-map-generator":308,"./lib/source-node":309}],312:[function(require,module,exports){
window.Previewer = require('pagedjs/lib').Previewer;
},{"pagedjs/lib":278}]},{},[312]);
