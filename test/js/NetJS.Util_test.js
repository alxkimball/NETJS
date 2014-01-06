/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function ($) {

    /*
     ======== A Handy Little QUnit Reference ========
     http://docs.jquery.com/QUnit

     Test methods:
     expect(numAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     raises(block, [expected], [message])
     */

    /*
     (function () {'use strict';} ());
     */

    module('netjs.util', {
        setup: function () {

        }
    });

    test('netjs namespace exists', function () {
        equal(_.isUndefined(netjs), false, 'The netjs namespace exists.');
    });

    test('netjs.Util namespace exists', function () {
        equal(_.isUndefined(netjs.Util), false, 'The netjs.Util namespace exists.');
    });

    test('can create a unique id', function () {
        ok(_.isFunction(netjs.Util.uid), 'netjs.Util.uid is a defined function');
        var id = netjs.Util.uid();
        ok(!_.isUndefined(id) && _.isString(id), 'netjs.Util.uid() returned an string');
    });

    test('can determine if a string starts with another string', function () {
        ok(_.isFunction(String.prototype.startsWith), 'String.prototype.startsWith is a defined function');
        var eval = '_DoIt'.startsWith('_');
        equal(eval, true, 'String.prototype.startsWith returned the correct evaluation');

        eval = 'p_DoIt'.startsWith('_');
        equal(eval, false, 'String.prototype.startsWith returned the correct evaluation');
    });

    test('can create a proxy method', function () {
        ok(_.isFunction(netjs.Util.proxyMethod), 'netjs.Util.proxyMethod is a defined function');
        var objA, objB;
        objA = {
            x: 9,
            getX: function getX() {
                return this.x;
            }
        };

        objB = {
            x: 36
        };

        ok(_.isUndefined(objB.getX) && _.isObject(objB), 'proxy method does not exist prior to proxyMethod call.');

        objB.getX = netjs.Util.proxyMethod(objA.getX, objA);

        ok(!_.isUndefined(objB.getX) && _.isObject(objB), 'proxy method does exist after proxyMethod call.');

        equal(objB.getX(), '9', 'proxy method returns correct value.')

    });

    test('can create a proxy object', function () {
        ok(_.isFunction(netjs.Util.proxy), 'netjs.Util.proxy is a defined function');
        var objA, objB, objC;
        objA = {
            x: 9,
            _doNotInclude: function doNotInclude() {
                this.x *= this.x;
            },
            p_includeByDefault: function() {
                return this.x + 5;
            },
            getX: function getX() {
                this._doNotInclude();
                return this.x;
            }
        };

        ok(_.isUndefined(objB), 'proxy object does not exist prior to proxy call.');

        objB = netjs.Util.proxy(objA);

        ok(!_.isUndefined(objB.getX) && _.isObject(objB), 'proxy method does exist after proxy call.');
        ok(!_.isUndefined(objB.p_includeByDefault) && _.isObject(objB), 'proxy method does exist after proxy call.');

        equal(objB.getX(), '81', 'proxy method returns correct value.');
        equal(objB.p_includeByDefault(), '86', 'proxy method returns correct value.');

        ok(_.isUndefined(objB._doNotInclude) && _.isObject(objB),
            'method with default prefix does not exist after proxy call.');

        objC = netjs.Util.proxy(objA, ['_', 'p_']);
        ok(!_.isUndefined(objC.getX) && _.isObject(objC), 'proxy method does exist after proxy call.');
        ok(_.isUndefined(objC.p_includeByDefault) && _.isObject(objC),
            'method with specified prefix does not exist after proxy call.');
        ok(_.isUndefined(objC._doNotInclude) && _.isObject(objC),
            'method with default prefix does not exist after proxy call.');
    });

    test('can create a proxy object with only specified methods', function () {
        ok(_.isFunction(netjs.Util.proxyForMethods), 'netjs.Util.proxyForMethods is a defined function');
        var objA, objB;
        objA = {
            x: 9,
            _doNotInclude: function doNotInclude() {
                this.x *= this.x;
            },
            p_includeByDefault: function() {
                return this.x + 5;
            },
            getX: function getX() {
                this._doNotInclude();
                return this.x;
            }
        };

        ok(_.isUndefined(objB), 'proxy object does not exist prior to proxy call.');

        objB = netjs.Util.proxyForMethods(objA, ['_doNotInclude', 'p_includeByDefault']);

        ok(_.isUndefined(objB.getX) && _.isObject(objB), 'unspecified proxy method does not exist after proxy call.');
        ok(!_.isUndefined(objB._doNotInclude) && _.isObject(objB), 'specified proxy method does exist after proxy call.');
        ok(!_.isUndefined(objB.p_includeByDefault) && _.isObject(objB), 'specified proxy method does exist after proxy call.');
    });

    test('can check if an object is undefined', function () {
        equal(netjs.Util.isUndefined(undefined), true, 'undefined is undefined');
        var obj;
        equal(netjs.Util.isUndefined(obj), true, 'an uninitalized object is undefined');
        obj = null;
        equal(netjs.Util.isUndefined(obj), false, 'null is not undefined');
    });

    test('can check if an object is a function', function () {
        equal(netjs.Util.isFunction(String.prototype.indexOf), true, 'a function defined in ECMAScript is a function');
        var obj = {
            a: function () {},
            b: undefined,
            c: null,
            d: 'function'
        };

        var func = function func() {};
        equal(netjs.Util.isFunction(obj.a), true, 'a function defined in a local obj is a function');
        equal(netjs.Util.isFunction(func), true, 'a function defined in a local scope is a function');
        equal(netjs.Util.isFunction(new Function()), true, 'a Function defined in a local scope is a function');
        equal(netjs.Util.isFunction(obj.b), false, 'undefined is not a function');
        equal(netjs.Util.isFunction(obj.c), false, 'null is not a function');
        equal(netjs.Util.isFunction(obj.d), false, 'a non-function property is not a function');
    });

    test('can check if an object is an object', function () {
        equal(netjs.Util.isObject({}), true, 'an empty dynamic object is an object');
        equal(netjs.Util.isObject({a: 123, f: function(){}}), true, 'an defined dynamic object is an object');
        var obj = {};
        equal(netjs.Util.isObject(obj), true, 'a reference object is an object');
        equal(netjs.Util.isObject(new Object()), true, 'a constructed object is an object');
        equal(netjs.Util.isObject('string'), false, 'a string is not an object');
        equal(netjs.Util.isObject(123), false, 'a number is not an object');
        equal(netjs.Util.isObject(true), false, 'a boolean is not an object');
        equal(netjs.Util.isObject(new Date()), true, 'a Date is an object, but is a special Object of type Date');
        equal(netjs.Util.isObject(new Number()), true, 'a Number is an object, but is a special Object of type Number');
        equal(netjs.Util.isObject(new Boolean()), true, 'a Boolean is an object, but is a special Object of type Boolean');
    });

    test('can check if an object is an string', function () {
        equal(netjs.Util.isString('static'), true, 'a static string is a string');
        equal(netjs.Util.isString(new String('static')), true, 'a String is a string');
    });

    test('can check if an object is an number', function () {
        equal(netjs.Util.isNumber(123), true, 'a static number is a number');
        equal(netjs.Util.isNumber(new Number(123)), true, 'a Number is a number');
    });

    test('can check if an object is an Date', function () {
        equal(netjs.Util.isDate('10/01/1965'), false, 'a date string is not a Date');
        equal(netjs.Util.isDate(new Date('10/01/1965')), true, 'a Date is a Date');
    });

} (jQuery));
