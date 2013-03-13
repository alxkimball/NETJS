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

    module('netjs', {
        setup: function () {
            
        }
    });

    test('netjs namespace exists', function () {
        equal(_.isUndefined(netjs), false, 'The netjs namespace exists.');
    });
	
	test('netjs.Util namespace exists', function () {
        equal(_.isUndefined(netjs.Util), false, 'The netjs.Util namespace exists.');
    });
	
	test('can instantiate netjs.Class', function () {
        ok(_.isFunction(netjs.Class), 'netjs.Class is a constructor function');
		var c = new netjs.Class();
		ok(!_.isUndefined(c) && _.isObject(c), 'netjs.Class constructor returned an object');
		equal(c.type, c.toString(), 'netjs.Class has defualt implementation of toString()');
    });
	
	test('can instantiate netjs.Interface', function () {
        ok(_.isFunction(netjs.Interface), 'netjs.Interface is a constructor function');
		var i = new netjs.Interface('ITestInterface', ['foo', 'bar', 'baz', 'bop']);
		ok(!_.isUndefined(i) && _.isObject(i), 'netjs.Interface constructor returned an object');
		var comp = _.isEqual(i.methods, ['foo', 'bar', 'baz', 'bop']);
		equal(comp, true, 'netjs.Interface has correct methods');
    });
	
	test('netjs.Abstract.abstractMethod exists', function () {
        equal(_.isUndefined(netjs.Abstract.abstractMethod), false, 'The netjs.Abstract.abstractMethod exists.');
		raises(function () {
			var m = new netjs.Abstract.abstractMethod();
		}, Error, "Attempting to call a netjs.abstractMethod raises an error");
    });

} (jQuery));
