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

	/**
	* The netjs.collections.CollectionBase is an AbstractClass and is ment
	* to be a base class for a concrete implementation of a Collection. 
	* So this suite of tests will demonstrate the extension and then run
	* tests on instances of the extension.
	*/	
	var PhoneNumberCollection = (function () {
		'use strict';
		
		//the constructor
		var PhoneNumberCollection = function PhoneNumberCollection() {
			var _args;

			/**
			* Call the parent constructor
			*/
			_args = Array.prototype.slice.call(arguments);
			PhoneNumberCollection._parent.constructor.apply(this, _args);
			
			//do any implementation specific setup here
			this._notificationQueue = [];
			
			//proxy for protection of private members(prefixed with _)
			if(!PhoneNumberCollection._isBase){
				return netjs.Util.proxy(this);
			} else {
				return this;
			}
		};
		
		//declare the extension and set the type of this class
		PhoneNumberCollection.inheritsFrom(netjs.collections.CollectionBase).isType('PhoneNumberCollection');
		
		//though not recommended, one could override the IList, ICollection, and IEnumerable methods here
		
		//it is recommended that the on* methods be overriden for type checking and logic handling
		PhoneNumberCollection.prototype.onClear = function () {
			var self = this;
			self._notificationQueue.push({
				event: 'Clear',
				time: new Date()
			});
		};
		
		PhoneNumberCollection.prototype.onClearComplete = function () {
			var self = this;
			self._notificationQueue.push({
				event: 'ClearComplete',
				time: new Date()
			});
		};
		
		PhoneNumberCollection.prototype.onGet = function (key, currentValue) {
			var self = this;
			self._notificationQueue.push({
				event: 'Get',
				time: new Date(),
				key: key,
				value: currentValue
			});
		};
		
		//define any implementation specific API
		PhoneNumberCollection.prototype.notifications = function () {
			var self = this;
			return self._notificationQueue;
		};
		
		//export the class
		return PhoneNumberCollection;
	} ());
	var _referenceArray = [];
    module('netjs.collections.CollectionBase', {		
        setup: function () {
			var self = this;
            self.blackBook = new PhoneNumberCollection();
			
			_referenceArray = [
				{key:'April',value:'555-1234'},
			{key:'May',value:'555-5678'},
			{key:'June',value:'555-9012'}];
			
			for(var j = 0; j < _referenceArray.length; ++j){
				self.blackBook.add(_referenceArray[j]);
			}
        }, 
		teardown: function() {
			var self = this;
			self.blackBook.clear();
			_referenceArray = [];
		}
    });

    test('can enumerate', function () {
		var self = this;
        var pointsProcessed = 0, enumerator = self.blackBook.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _referenceArray.length, 'Collection enumeratorated successfully.');
    });	
	
	test('can copyTo an array', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		var array = [];
		self.blackBook.copyTo(array);
		var comp = _.isEqual(_referenceArray, array);
    });
	
	test('can check the count of a Collection', function () {
		var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
    });
	
	test('can get the value for the specified index', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		var val = self.blackBook.getItem(1);
		var comp = _.isEqual(val, {key:'May',value:'555-5678'});
		equal(comp, true, 'Collection returned the correct value for the specified key.');
    });
	
	test('can set the value for the specified index', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		var newNumber = {key:'May',value:'444-4444'};
		self.blackBook.setItem(1, newNumber);
		var val = self.blackBook.getItem(1);
		var comp = _.isEqual(val, newNumber);
		equal(comp, true, 'Collection returned the correct value for the specified key.');
    });
	
	test('can add', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		var values = []; 
		self.blackBook.copyTo(values);
		var comp = _.isEqual(values, _referenceArray);
		equal(comp, true, 'Collection.values produced the correct collection');
    });
	
	test('can clear', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		self.blackBook.clear();
		equal(self.blackBook.count(), 0, 'Collection.clear updated the count correctly');
		var pointsProcessed = 0, enumerator = self.blackBook.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, 0, 'Collection.clear updated the enumerator.');
		var notifications = self.blackBook.notifications();
		notifications.toString();
    });
	
	test('can check if the Collection contains the specified value', function () {
		var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		equal(self.blackBook.contains({key:'May',value:'555-5678'}), true, 'Collection.contains evaluted correctly.');
		equal(self.blackBook.contains({key:'July',value:'444-4444'}), false, 'Collection.contains evaluted correctly.');
    });
	
	test('can remove an element from the Collection', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		self.blackBook.remove({key:'May',value:'555-5678'});
		equal(self.blackBook.contains({key:'May',value:'555-5678'}), false, 'Collection.remove removed the element.');
		var index = self.blackBook.indexOf({key:'May',value:'555-5678'});
		equal(index, -1, 'Could not get the indexOf the removed item.');
		equal(self.blackBook.count(), _referenceArray.length -1, 'Collection.remove updated the count correctly');
		var pointsProcessed = 0, enumerator = self.blackBook.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _referenceArray.length -1, 'Collection.remove updated the enumerator.');		
    });
	
	test('can remove an element at the specified index from the Collection', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Collection.count evaluated correctly.');
		self.blackBook.removeAt(1);
		equal(self.blackBook.contains({key:'May',value:'555-5678'}), false, 'Collection.remove removed the element.');
		var index = self.blackBook.indexOf({key:'May',value:'555-5678'});
		equal(index, -1, 'Could not get the indexOf the removed item.');
		equal(self.blackBook.count(), _referenceArray.length -1, 'Collection.remove updated the count correctly');
		var pointsProcessed = 0, enumerator = self.blackBook.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _referenceArray.length -1, 'Collection.remove updated the enumerator.');		
    });
	
} (jQuery, netjs));
