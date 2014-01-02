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

} (jQuery));
