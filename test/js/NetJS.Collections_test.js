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

    module('netjs.collections', {
        setup: function () {
            
        }
    });
	
	test('netjs.collections namespace exists', function () {
        equal(_.isUndefined(netjs.collections), false, 'The netjs.Collection namespace exists.');
    });
	
	test('netjs.collections Interfaces exists', function () {
        equal(_.isUndefined(netjs.collections.IComparer), false, 'The netjs.collections.IComparer interface exists.');
		equal(_.isUndefined(netjs.collections.IEqualityComparer), false, 'The netjs.collections.IEqualityComparer interface exists.');
		equal(_.isUndefined(netjs.collections.IEnumerator), false, 'The netjs.collections.IEnumerator interface exists.');
		equal(_.isUndefined(netjs.collections.ICollection), false, 'The netjs.collections.ICollection interface exists.');
		equal(_.isUndefined(netjs.collections.IList), false, 'The netjs.collections.IList interface exists.');
		equal(_.isUndefined(netjs.collections.IDictionary), false, 'The netjs.collections.IDictionary interface exists.');
		equal(_.isUndefined(netjs.collections.IDictionaryEnumerator), false, 'The netjs.collections.IDictionaryEnumerator interface exists.');
    });
	
	test('netjs.collections Base classes exists', function () {
        equal(_.isUndefined(netjs.collections.Comparer), false, 'The netjs.collections.Comparer class exists.');
        equal(_.isUndefined(netjs.collections.CollectionBase), false, 'The netjs.collections.CollectionBase class exists.');
    });

} (jQuery));
