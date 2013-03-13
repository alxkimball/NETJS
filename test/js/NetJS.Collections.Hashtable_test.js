/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function ($, netjs) {

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

	var _size = 10;
	var _referenceArray = [];
	//a test class for creating test objects
	var Point = (function () {
				var Point = function (i){
					this.id = i,
					this.x = i,
					this.y = Math.pow(this.x, 2) + this.x + 1;
				};
				Point.inheritsFrom(netjs.Class).isType('Point');
				
				Point.prototype.compareTo = function(other) {
					var self = this;
				
					if(other.constructor === Point) {
						return self.id - other.id;
					}
					
					throw new TypeError('Incomparable Types');
				};				
				
				return Point;
			} ());
			
    module('netjs.collection.Hashtable', {		
        setup: function () {
			var self = this;
            self.hashtable = new netjs.collections.Hashtable();			
			for(var i = 0; i < _size; ++i){
				var point = new Point(i);				
				self.hashtable.add(i, point);
				_referenceArray.push(point);
			}
        }, 
		teardown: function() {
			var self = this;
			self.hashtable.clear();
			_referenceArray = [];
		}
    });

    test('can enumerate', function () {
        var pointsProcessed = 0, enumerator = this.hashtable.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _size, 'Hashtable enumerated successfully.');
    });
	
	test('can copyTo', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		var array = [];
		this.hashtable.copyTo(array);
		var comp = _.isEqual(_referenceArray, array);
    });
	
	test('can count', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
    });
	
	test('can get the keys collection', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		var ht_keys = this.hashtable.keys();
		var keys = []; 
		ht_keys.copyTo(keys);
		var comp = _.isEqual(keys, [0,1,2,3,4,5,6,7,8,9]);
		equal(comp, true, 'Hashtable.keys produced the correct collection');
    });
	
	test('can get the values collection', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		var ht_values = this.hashtable.values();
		var values = []; 
		ht_values.copyTo(values);
		var comp = _.isEqual(values, _referenceArray);
		equal(comp, true, 'Hashtable.values produced the correct collection');
    });
	
	test('can get the value for the specified key', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		var val = this.hashtable.getItem(2);
		var comp = _.isEqual(val, new Point(2));
		equal(comp, true, 'Hashtable returned the correct value for the specified key.');
    });
	
	test('can set the value for the specified key', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		var item = new Point(_size + 5);
		this.hashtable.setItem(2, item);
		var val = this.hashtable.getItem(2);
		var comp = _.isEqual(val, item);
		equal(comp, true, 'Hashtable returned the correct value for the specified key.');
    });
	
	test('can add', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		var ht_values = this.hashtable.values();
		var values = []; 
		ht_values.copyTo(values);
		var comp = _.isEqual(values, _referenceArray);
		equal(comp, true, 'Hashtable.values produced the correct collection');
    });
	
	test('can clear', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		this.hashtable.clear();
		equal(this.hashtable.count(), 0, 'Hashtable.clear updated the count correctly');
		equal(this.hashtable.keys().count(), 0, 'Hashtable.clear updated the keys correctly');
		equal(this.hashtable.values().count(), 0, 'Hashtable.clear updated the values correctly');
		var pointsProcessed = 0, enumerator = this.hashtable.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, 0, 'Hashtable.clear updated the enumerator.');
    });
	
	test('can check if the Hashtable contains the specified key', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		equal(this.hashtable.contains(_size -1), true, 'Hashtable.contains evaluted correctly.');
		equal(this.hashtable.contains(_size + 5), false, 'Hashtable.contains evaluted correctly.');
    });
	
	test('can remove an element by the specified key', function () {
        equal(this.hashtable.count(), _size, 'Hashtable.count evaluated correctly.');
		this.hashtable.remove(_size -1);
		equal(this.hashtable.contains(_size -1), false, 'Hashtable.remove removed the element.');
		var item = this.hashtable.getItem(_size -1);
		equal(item, undefined, 'Could not get the reomved item by key.');
		equal(this.hashtable.count(), _size -1, 'Hashtable.remove updated the count correctly');
		equal(this.hashtable.keys().count(), _size -1, 'Hashtable.remove updated the keys correctly');
		equal(this.hashtable.values().count(), _size -1, 'Hashtable.remove updated the values correctly');
		var pointsProcessed = 0, enumerator = this.hashtable.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _size -1, 'Hashtable.remove updated the enumerator.');		
    });
	
} (jQuery, netjs));
