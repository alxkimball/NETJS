(function () {
	'use strict';
    /**
    * This is required for support of bind in browsers who do not fully
    * support the ECMA 5(JavaScript 1.8.5) standard, ie. Safari(a.k.a. Stupid safari)
    */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                //closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNop = function () { },
                fBound = function () {
                    return fToBind.apply(this instanceof FNop ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            FNop.prototype = this.prototype;
            fBound.prototype = new FNop();
            return fBound;
        };
    }
} ());