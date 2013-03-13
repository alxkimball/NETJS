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
			
    module('netjs.collection.ArrayList', {		
        setup: function () {
			var self = this;
            self.list = new netjs.collections.ArrayList();			
			for(var i = 0; i < _size; ++i){
				var point = new Point(i);				
				self.list.add(point);
				_referenceArray.push(point);
			}
        }, 
		teardown: function() {
			var self = this;
			self.list.clear();
		}
    });

    test('can enumerate', function () {
        var pointsProcessed = 0, enumerator = this.list.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _size, 'ArrayList enumeratorated successfully.');
    });
	
	test('can add', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
    });
	
	test('can clear', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
		this.list.clear();
		equal(this.list.count(), 0, 'ArrayList cleared successfully.');
    });
	
	test('can check if an ArrayList contains an object', function () {
        var testObj = new Point(_size - 1);
		equal(this.list.contains(testObj), true, 'ArrayList.contains evaluated correctly');
    });
	
	test('can remove an element from an ArrayList', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
		var testObj = new Point(_size - 1);
		equal(this.list.contains(testObj), true, 'ArrayList.contains evaluated correctly');
		this.list.remove(testObj);
		equal(this.list.count(), _size -1, 'ArrayList.remove updated the size correctly.');
		equal(this.list.contains(testObj), false, 'ArrayList no longer contains removed element');
    });
	
	test('can check the size of an ArrayList', function () {
        equal(this.list.count(), _size, 'ArrayList.size evaluated correctly.');
    });
	
	test('can convert an ArrayList toArray', function () {
		var master = [];
		this.list.clear();
		for(var i = 0; i < _size; ++i){
			master.push(i);
			this.list.add(i);
		}
		var productArray = this.list.toArray();
		var comp = _.isEqual(productArray, master);
        equal(comp, true, 'ArrayList.toArray produced the correct array.');
    });
	
	test('can get an element at a specified index from an ArrayList', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
		var testObj = new Point(_size - 1);
		equal(this.list.contains(testObj), true, 'ArrayList.contains evaluated correctly.');
		equal(this.list.indexOf(testObj), _size -1, 'ArrayList.indexOf evaluated correctly.');
		var tp = this.list.getItem(_size -1);
		var comp = _.isEqual(tp, testObj);
		equal(comp, true, 'ArrayList returned the correct element from the specified index.');
    });
	
	test('can insert an element at a specified index to an ArrayList', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
		var testObj = new Point(_size + 1);
		equal(this.list.contains(testObj), false, 'ArrayList.contains evaluated correctly.');
		this.list.insert(2, testObj);
		equal(this.list.indexOf(testObj), 2, 'ArrayList.indexOf evaluated correctly.');
		var tp = this.list.getItem(2);
		var comp = _.isEqual(tp, testObj);
		equal(comp, true, 'ArrayList returned the correct element from the specified index.');
		equal(this.list.count(), _size + 1, 'ArrayList.insert updated the size correctly.');
    });
	
	test('can remove an element at a specified index from an ArrayList', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
		var testObj = new Point(_size - 1);
		equal(this.list.indexOf(testObj), _size - 1, 'ArrayList.indexOf evaluated correctly.');
		this.list.removeAt(_size -1);
		equal(this.list.indexOf(testObj), -1, 'ArrayList.indexOf evaluated correctly.');
		equal(this.list.contains(testObj), false, 'ArrayList.contains evaluated correctly.');
		equal(this.list.count(), _size - 1, 'ArrayList.removeAt updated the size correctly.');
    });
	
	test('can set an element at a specified index from an ArrayList', function () {
        equal(this.list.count(), _size, 'ArrayList added successfully.');
		var testObj = new Point(_size - 1);
		equal(this.list.contains(testObj), true, 'ArrayList.contains evaluated correctly.');
		equal(this.list.indexOf(testObj), _size -1, 'ArrayList.indexOf evaluated correctly.');
		var tp = this.list.getItem(_size -1);
		var comp = _.isEqual(tp, testObj);
		testObj = new Point(_size + 1);
		this.list.setItem(_size - 1, testObj);
		equal(this.list.contains(testObj), true, 'ArrayList.contains evaluated correctly.');
		equal(this.list.indexOf(testObj), _size -1, 'ArrayList.indexOf evaluated correctly.');
		equal(comp, true, 'ArrayList returned the correct element from the specified index.');
    });
	
	test('can getRange from an ArrayList', function () {
		equal(this.list.count(), _size, 'ArrayList added successfully.');
		var fromIdx = 0, toIdx = 3;
		var subList = this.list.getRange(fromIdx, toIdx);
		for(var j = fromIdx; j < toIdx; ++j) {
			var subE = subList.getItem(j), origE = this.list.getItem(j);
			var comp = _.isEqual(subE, origE);
			equal(comp, true, 'getRange item: ' + j + ' was equal to the original list.');			
		}	
	});
} (jQuery, netjs));
