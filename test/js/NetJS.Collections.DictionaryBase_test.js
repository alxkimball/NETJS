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
	* The netjs.collections.DictionaryBase is an AbstractClass and is ment
	* to be a base class for a concrete implementation of a Dictionary. 
	* So this suite of tests will demonstrate the extension and then run
	* tests on instances of the extension.
	*/	
	var PhoneNumberDictionary = (function () {
		'use strict';
		
		//the constructor
		var PhoneNumberDictionary = function PhoneNumberDictionary() {
			var _args;

			/**
			* Call the parent constructor
			*/
			_args = Array.prototype.slice.call(arguments);
			PhoneNumberDictionary._parent.constructor.apply(this, _args);
			
			//do any implementation specific setup here
			this._notificationQueue = [];
			
			//proxy for protection of private members(prefixed with _)
			if(!PhoneNumberDictionary._isBase){
				return netjs.Util.proxy(this);
			} else {
				return this;
			}
		};
		
		//declare the extension and set the type of this class
		PhoneNumberDictionary.inheritsFrom(netjs.collections.DictionaryBase).isType('PhoneNumberDictionary');
		
		//though not recommended, one could override the IDictionary, ICollection, and IEnumerable methods here
		
		//it is recommended that the on* methods be overriden for type checking and logic handling
		PhoneNumberDictionary.prototype.onClear = function () {
			var self = this;
			self._notificationQueue.push({
				event: 'Clear',
				time: new Date()
			});
		};
		
		PhoneNumberDictionary.prototype.onClearComplete = function () {
			var self = this;
			self._notificationQueue.push({
				event: 'ClearComplete',
				time: new Date()
			});
		};
		
		PhoneNumberDictionary.prototype.onGet = function (key, currentValue) {
			var self = this;
			self._notificationQueue.push({
				event: 'Get',
				time: new Date(),
				key: key,
				value: currentValue
			});
		};
		
		//define any implementation specific API
		PhoneNumberDictionary.prototype.notifications = function () {
			var self = this;
			return self._notificationQueue;
		};
		
		//export the class
		return PhoneNumberDictionary;
	} ());
	var _referenceArray = [];
    module('netjs.collections.DictionaryBase', {		
        setup: function () {
			var self = this;
            self.blackBook = new PhoneNumberDictionary();
			
			_referenceArray = [{key:'April',value:'555-1234'},
			{key:'May',value:'555-5678'},
			{key:'June',value:'555-9012'}];
			
			for(var j = 0; j < _referenceArray.length; ++j){
				self.blackBook.add(_referenceArray[j].key, _referenceArray[j].value);
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
        equal(pointsProcessed, _referenceArray.length, 'Dictionary enumeratorated successfully.');
    });	
	
	test('can copyTo an array', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		var array = [];
		self.blackBook.copyTo(array);
		var comp = _.isEqual(_referenceArray, array);
    });
	
	test('can check the count of a Dictionary', function () {
		var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
    });
	
	test('can get the keys collection', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		var bb_keys = self.blackBook.keys();
		var keys = []; 
		bb_keys.copyTo(keys);
		var comp = _.isEqual(keys, ['April', 'May', 'June']);
		equal(comp, true, 'Dictionary.keys produced the correct collection');
    });
	
	test('can get the values collection', function () {
		var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		var bb_values = self.blackBook.values();
		var values = []; 
		bb_values.copyTo(values);
		var comp = _.isEqual(values, ['555-1234', '555-5678', '555-9012']);
		equal(comp, true, 'Dictionary.values produced the correct collection');
	});
	
	test('can get the value for the specified key', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		var val = self.blackBook.getItem('May');
		var comp = _.isEqual(val, '555-5678');
		equal(comp, true, 'Dictionary returned the correct value for the specified key.');
    });
	
	test('can set the value for the specified key', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		var newNumber = '444-4444';
		self.blackBook.setItem('May', newNumber);
		var val = self.blackBook.getItem('May');
		var comp = _.isEqual(val, newNumber);
		equal(comp, true, 'Dictionary returned the correct value for the specified key.');
    });
	
	test('can add', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		var bb_values = self.blackBook.values();
		var values = []; 
		bb_values.copyTo(values);
		var comp = _.isEqual(values, ['555-1234', '555-5678', '555-9012']);
		equal(comp, true, 'Dictionary.values produced the correct collection');
    });
	
	test('can clear', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		self.blackBook.clear();
		equal(self.blackBook.count(), 0, 'Dictionary.clear updated the count correctly');
		equal(self.blackBook.keys().count(), 0, 'Dictionary.clear updated the keys correctly');
		equal(self.blackBook.values().count(), 0, 'Dictionary.clear updated the values correctly');
		var pointsProcessed = 0, enumerator = self.blackBook.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, 0, 'Dictionary.clear updated the enumerator.');
		var notifications = self.blackBook.notifications();
		notifications.toString();
    });
	
	test('can check if the Dictionary contains the specified key', function () {
		var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		equal(self.blackBook.contains('May'), true, 'Dictionary.contains evaluted correctly.');
		equal(self.blackBook.contains('October'), false, 'Dictionary.contains evaluted correctly.');
    });
	
	test('can remove an element by the specified key', function () {
        var self = this;
        equal(self.blackBook.count(), _referenceArray.length, 'Dictionary.count evaluated correctly.');
		self.blackBook.remove('May');
		equal(self.blackBook.contains('May'), false, 'Dictionary.remove removed the element.');
		var item = self.blackBook.getItem('May');
		equal(item, undefined, 'Could not get the removed item by key.');
		equal(self.blackBook.count(), _referenceArray.length -1, 'Dictionary.remove updated the count correctly');
		equal(self.blackBook.keys().count(), _referenceArray.length -1, 'Dictionary.remove updated the keys correctly');
		equal(self.blackBook.values().count(), _referenceArray.length -1, 'Dictionary.remove updated the values correctly');
		var pointsProcessed = 0, enumerator = self.blackBook.enumerator();
		while(enumerator.next()){
			pointsProcessed++;
		}
        equal(pointsProcessed, _referenceArray.length -1, 'Dictionary.remove updated the enumerator.');		
    });
	
} (jQuery, netjs));
