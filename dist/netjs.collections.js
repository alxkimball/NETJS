/**
 * netjs JavaScript Implementation of .NET's Linq to Objects v0.0.3
 * Copyright (c) 2014, Alex Kimball
 * Licensed: MIT, GPL
 * Date: 2014-01-06
 */
netjs.collections = (function () {
	'use strict';
	
	var collections = netjs.collections || {};
	
	return collections;
} ());
netjs.collections.IComparer = (function (netjs) {
	'use strict';
	
	var IComparer = new netjs.Interface('IComparer', ['compare']);
	
	return IComparer;
} (netjs));
netjs.collections.IEqualityComparer = (function (netjs) {
	'use strict';
	
	var IEqualityComparer = new netjs.Interface('IEqualityComparer',['equals', 'getHashCode']);
	
	return IEqualityComparer;
} (netjs));
netjs.collections.IEnumerator = (function (netjs) {
	'use strict';
	/**
	* Intended behavior:
	* obj current()
	* bool next()
	* void reset()
	* 
	* After an enumerator is created or after the reset() method is called, the next() method must
	* be called to advance the enumerator to the first element of the collection before reading the
	* value of the current property; otherwise, current() is undefined.	current() also throws an 
	* exception if the last call to next returned false, which indicates the end of the collection.
	*
	* current does not move the position of the enumerator, and consecutive calls to current return 
	* the same object until either next or reset is called.
	*/
	var IEnumerator = new netjs.Interface('IEnumerator', ['current', 'next', 'reset']);
	
	return IEnumerator
} (netjs));
netjs.collections.IEnumerable = (function (netjs) {
	'use strict';
	
	var IEnumerable =  new netjs.Interface('IEnumerable', ['enumerator']);
	
	return IEnumerable;
} (netjs));
netjs.collections.ICollection = (function (netjs) {
	'use strict';
	
	var ICollection = new netjs.Interface('ICollection', ['copyTo', 'count']);
	//ICollection extends IEnumerable
	ICollection = netjs.Interface.extendInterface(ICollection, netjs.collections.IEnumerable);
	
	return ICollection;
	
} (netjs));
netjs.collections.IList = (function (netjs) {
	'use strict';
	
	/**
	* insert - 
	* If index equals the number of items in the IList, then value is appended to the end.
	* In collections of contiguous elements, such as lists, the elements that follow the
	* insertion point move down to accommodate the new element. If the collection is indexed,
	* the indexes of the elements that are moved are also updated.
	*/
	
	/**
	* removeAt -
	* In collections of contiguous elements, such as lists, the elements that follow the 
	* removed element move up to occupy the vacated spot. If the collection is indexed,
	* the indexes of the elements that are moved are also updated. 
	*/
	var IList = new netjs.Interface('IList', ['add', 'clear', 'contains', 'getItem', 'indexOf', 'insert', 'remove', 'removeAt', 'setItem']);
	//IList extends ICollection, IEnumerable
	IList = netjs.Interface.extendInterface(IList, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return IList;
} (netjs));
netjs.collections.IDictionary = (function (netjs) {
	'use strict';
	
	var IDictionary = new netjs.Interface('IDictionary', ['keys', 'values', 'getItem', 'setItem', 'add', 'clear', 'contains', 'remove']);
	//IDictionary extends ICollection, IEnumerable
	IDictionary = netjs.Interface.extendInterface(IDictionary, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return IDictionary;
} (netjs));
netjs.collections.IDictionaryEnumerator = (function (netjs) {
	'use strict';
	var IDictionaryEnumerator = new netjs.Interface('IDictionaryEnumerator', ['entry', 'key', 'value']);
	//IDictionaryEnumerator extends the IEnumerator interface
	IDictionaryEnumerator = netjs.Interface.extendInterface(IDictionaryEnumerator, netjs.collections.IEnumerator);
	
	return IDictionaryEnumerator
} (netjs));
netjs.collections.ArrayEnumerator = (function (netjs) {
	'use strict';
	
	var ArrayEnumerator = function ArrayEnumerator(source) {
		this.source = source;
		this.index = -1;
	};

	ArrayEnumerator.prototype.current = function () {
		var self = this;
		if(self.index === -1) {
			return window.missingVariable;
		} else if(self.index >= self.source.length) {
			throw new Error("InvalidEnumeratorPosistion");
		}
		return self.source[self.index];
	};
	
	ArrayEnumerator.prototype.next = function () {
		var self = this;
		self.index += 1;
		return (self.index > -1 && self.index < self.source.length);
	};
	
	ArrayEnumerator.prototype.reset = function () {
		var self = this;
		self.index = -1;
	};
	
	ArrayEnumerator.ensureImplements(netjs.collections.IEnumerator);
	
	return ArrayEnumerator;
} (netjs));
netjs.collections.Comparer = (function (_, netjs) {
	'use strict';
	
	var Comparer = function Comparer(){
		
	};
	
	/**
	* Performs a case-sensitive comparison of two objects of the same type and returns a value 
	* indicating whether one is less than, equal to, or greater than the other.
	*/
	Comparer.prototype.compare = function (a, b) {
		
		//default string compare
		if(_.isString(a) && _.isString(b)){
			return a.localeCompare(b);
		}
		
		//default number compare
		if(_.isNumber(a) && _.isNumber(b)){
			return a - b;
		}
		
		//default bool compare
		if(_.isBoolean(a) && _.isBoolean(b)){
			if(a === b) {
				return 0;
			} else if (a && !b) {
				return 1;
			} else {
				return -1;
			}
		}
		
		//default date compare
		if(_.isDate(a) && _.isDate(b)){
			return a - b; //returns the date difference in milliseconds 1 day = 86400000
		}
		
		//default object compare
		if(_.isObject(a) && _.isObject(b)){
			netjs.Interface.ensureImplements(a, netjs.IComparable);
			return a.compareTo(b);
		}
		
		throw new Error('Objects can not be compared');
	};
	
	Comparer.isType('Comparer');
	
	Comparer.ensureImplements(netjs.collections.IComparer);
	
	var _default = new Comparer();
	
	Comparer.Default = _default;
	
	return Comparer;
} (_, netjs));
netjs.collections.EqualityComparer = (function (netjs) {
	'use strict'
	var EqualityComparer = function () {};
		
		EqualityComparer.prototype.hashEquals = function (x, y) {
			var self = this;
			return self.getHashCode(x) === self.getHasCode(y);
		};
		
		EqualityComparer.prototype.equals = function (x, y) {
			var self = this;
			if(netjs.Util.isObject(x)){
				if(!netjs.Util.isUndefined(x.equals)){
					return x.equals(y);
				}
			}
			return netjs.Class.prototype.isEqual.call(x, y);
		};
		
		EqualityComparer.prototype.getHashCode = function (x) {
			//default string hasher
			if(netjs.Util.isString(x)){
				var sum = 0;
				for(var charIdx = 0; charIdx < x.length; ++charIdx){
					sum += x.charCodeAt(charIdx);
				}
				return sum;
			}
			
			//default number hasher
			if(netjs.Util.isNumber(x)){
				return Math.round(x);
			}
			
			//default bool hasher
			if(netjs.Util.isBoolean(x)){
				return x ? 1 : 0;
			}
			
			//default date hasher
			if(netjs.Util.isDate(x)){
				return x.getTime();
			}
			
			//default object hasher
			if(netjs.Util.isObject(x)){
				if(!_.isUndefined(x.getHashCode)) {
					return x.getHashCode();
				}
			}
			
			throw new Error('Cannot get hash code for object');
		};
		
		EqualityComparer.ensureImplements(netjs.collections.IEqualityComparer);
		
		var _default = new EqualityComparer();
	
		EqualityComparer.Default = _default;
		
		return EqualityComparer;
} (netjs));
netjs.collections.CollectionBase = (function (netjs, ListEnumerator) {
	'use strict';
	
	var CollectionBase = function CollectionBase() {
		// use _isBase to determine if this constructor is being invoked via chain or new
		if(!CollectionBase._isBase){
			throw new Error("Can't instantiate abstract classes");
		} else {
			/**
			* Call the parent constructor
			*/
			var _args = Array.prototype.slice.call(arguments);
			CollectionBase._parent.constructor.apply(this, _args);
			
			this._list = new netjs.collections.ArrayList();
		}
		
		if(!CollectionBase._isBase){
			return netjs.Util.proxy(this);
		} else {
			return this;
		}
	};
	
	CollectionBase.inheritsFrom(netjs.Class).isType('CollectionBase');
	
	/**
	* Implementation of IEnumerable
	* 'enumerator'
	*/
	CollectionBase.prototype.enumerator = function (){
		var self = this;
		return self._list.enumerator();
	};
	
	/**
	* Implementation of ICollection
	* 'copyTo', 'count'
	*/
	CollectionBase.prototype.copyTo = function (array, index) {
		var self = this;
		self._list.copyTo(array, index);
	};
	
	CollectionBase.prototype.count = function () {
		var self = this;
		return self._list.count();
	};
	
	/**
	* Implementation of IList
	* 'add', 'clear', 'contains', 'get', 'indexOf', 'insert', 'remove', 'removeAt', 'set'
	*/
	CollectionBase.prototype.add = function (value) {
		var self = this, index = self.count();
		self.insert(index, value);
		return index;
	};
	
	CollectionBase.prototype.clear = function () {
		var self = this;
		self.onClear();
		self._list.clear();
		self.onClearComplete();
	};
	
	CollectionBase.prototype.contains = function (value) {
		var self = this;
		return self._list.contains(value);
	};	
	
	CollectionBase.prototype.getItem = function (index) {
		var self = this;
		return self._list.getItem(index);
	};
	
	CollectionBase.prototype.indexOf = function (value) {
		var self = this;
		return self._list.indexOf(value);
	};
	
	CollectionBase.prototype.insert = function (index, value) {
		var self = this;
		self.onValidate(value);
		self.onInsert(index, value);
		self._list.insert(index, value);
		self.onInsertComplete(index, value);
	};	
	
	CollectionBase.prototype.remove = function (value) {
		var self = this, index;
		index = self.indexOf(value);
		self.onValidate(value);
		self.onRemove(index, value);
		self._list.remove(value);
		self.onRemoveComplete(index, value);
	};
	
	CollectionBase.prototype.removeAt = function (index) {
		var self = this, value;
		value = self.getItem(index);
		self.onValidate(value);
		self.onRemove(index, value);
		self._list.removeAt(index);
		self.onRemoveComplete(index, value);
	};
	
	CollectionBase.prototype.setItem = function (index, value) {
		var self = this, oldValue;
		oldValue = self.getItem(index);
		self.onValidate(value);
		self.onSet(index, oldValue, value);
		self._list.setItem(index, value);
		self.onSetComplete(index, oldValue, value);
	};
	
	CollectionBase.prototype.onClear = function () {};
	
	CollectionBase.prototype.onClearComplete = function () {};
	
	CollectionBase.prototype.onInsert = function (index, value) {};
	
	CollectionBase.prototype.onInsertComplete = function (index, value) {};
	
	CollectionBase.prototype.onRemove = function (index, value) {};
	
	CollectionBase.prototype.onRemoveComplete = function (index, value) {};
	
	CollectionBase.prototype.onSet = function (index, oldValue, newValue) {};
	
	CollectionBase.prototype.onSetComplete = function (index, oldValue, newValue) {};
	
	CollectionBase.prototype.onValidate = function (value) {};
	
	CollectionBase.ensureImplements(netjs.collections.IList, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return CollectionBase;
} (netjs));
netjs.collections.ArrayList = (function (_, netjs, DefaultEqualityComparer) {
	'use strict';
	
	var ArrayList = function ArrayList(startingArray) {
		var _args;

		/**
        * Call the parent constructor
        */
        _args = Array.prototype.slice.call(arguments);
        ArrayList._parent.constructor.apply(this, _args);
		
		this._list = startingArray || [];
		
		this._equalityComparer = DefaultEqualityComparer;
		
		if(!ArrayList._isBase){
			return netjs.Util.proxy(this);
		} else {
			return this;
		}
	};
	
	ArrayList.inheritsFrom(netjs.Class).isType('ArrayList');
	
	/**
	* Implementation of IEnumerable
	* 'enumerator'
	*/
	ArrayList.prototype.enumerator = function () {
		var self = this;
		return new netjs.collections.ArrayEnumerator(self._list);
	};
	
	/**
	* Implementation of ICollection
	* 'copyTo', 'count'
	*/
	ArrayList.prototype.copyTo = function (array, index) {
		var self = this;
		if(_.isUndefined(index)){index = 0;}
		for(var j = 0; j < self._list.length; ++j){
			array[index + j] = self._list[j];
		}
	};
	
	ArrayList.prototype.count = function () {
		var self = this;
		return self._list.length;
	};
	
	/**
	* Implementation of IList
	* 'add', 'clear', 'contains', 'count', 'getItem', 'indexOf', 'insert', 'remove', 'removeAt', 'setItem'
	*/
	ArrayList.prototype.add = function (value) {
		var self = this;
		self._list.push(value);
	}
	
	ArrayList.prototype.clear = function () {
		var self = this;
		delete self._list;
		self._list = [];
	};
	
	ArrayList.prototype.contains = function (value) {
		var self = this;
		return self.indexOf(value) > -1;
	};
	
	ArrayList.prototype.getItem = function (index) {
		var self = this;
		if(index > -1 && index < self.count()) {
			return self._list[index];
		}
		throw new Error("ArgumentOutOfRangeException");
	};
	
	ArrayList.prototype.indexOf = function (value) {
		var self = this,
			enumerator;
		if(self.count() > 0){
			enumerator = self.enumerator();
			//check that we have a valid enumerator
			if(!_.isUndefined(enumerator)) {
				netjs.Interface.ensureImplements(enumerator, netjs.collections.IEnumerator);
				if(_.isNull(value)){
					while(enumerator.next()){
						if(_.isNull(enumerator.current())){
							return enumerator.index;
						}
					}				
				} else {
					while(enumerator.next()){
						if(self._equalityComparer.equals(enumerator.current(), value)){
							return enumerator.index;
						}
					}
				}
			}
		}
		
		return -1;
	};
	
	ArrayList.prototype.insert = function (index, value) {
		var self = this;
		if(index === self.count()){
			self._list.push(value);
		} else if(index > -1 && index < self.count()) {
			var prefix = self._list.slice(0, index);
			var middle = [value];
			var suffix = self._list.slice(index);
			self._list = prefix.concat(middle).concat(suffix);
		} else {
			throw new Error("ArgumentOutOfRangeException");
		}				
	};
	
	ArrayList.prototype.remove = function (value) {
		var self = this, index;
		index = self.indexOf(value);
		if(index > -1 && index < self.count()) {
			self.removeAt(index);
		} else {
			throw new Error("ArgumentException");
		}
	};
	
	ArrayList.prototype.removeAt = function (index) {
		var self = this;
		if(index > -1 && index < self.count()) {
			self._list.splice(index, 1);
		} else {
			throw new Error("ArgumentOutOfRangeException");
		}				
	};
	
	ArrayList.prototype.setItem = function (index, value) {
		var self = this;
		if(index > -1 && index < self.count()) {
			self._list[index] = value;
		}
		else {
			throw new Error("ArgumentOutOfRangeException");
		}
	};
	
	
	/******************************************************************************************
	* ArrayList API
	* 'addRange', 'binarySearch', 'equals'(Override of Class), 'getRange', 'indexOf'(Overloads),
	* 'insertRange', 'removeRange', 'repeat', 'reverse', 'sort', 'toArray', 'toString'(Override of Class)
	******************************************************************************************/
	
	/**
	* The implementation of getRange.
	* Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
	*/
	ArrayList.prototype.getRange = function (fromIndex, toIndex) {
		var self = this;
		if(fromIndex > -1 && toIndex < self.count()) {
			var source = self._list.slice(fromIndex, toIndex);
			return new ArrayList(source);
		}
		throw new Error("ArgumentOutOfRangeException");
	};
	
	ArrayList.prototype.toArray = function () {
		var self = this;
		return self._list;
	};
	
	ArrayList.ensureImplements(netjs.collections.IList, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return ArrayList;
}(_, netjs, netjs.collections.EqualityComparer.Default));
netjs.collections.Hashtable = (function (_, netjs, DefaultEqualityComparer, HashtableEnumerator) {
	'use strict';
	var Hashtable = function Hashtable(iEqualityComparer) {
		var _args;

		/**
        * Call the parent constructor
        */
        _args = Array.prototype.slice.call(arguments);
        Hashtable._parent.constructor.apply(this, _args);
	
		this._equalityComparer = _.isUndefined(iEqualityComparer) ? DefaultEqualityComparer : iEqualityComparer;
		this._hashlist = {};
		this._keys = [];
		this._values = [];
		this._cnt = 0;
		
		if(!Hashtable._isBase){
			return netjs.Util.proxy(this);
		} else {
			return this;
		}
	};
	
	Hashtable.inheritsFrom(netjs.Class).isType('Hashtable');
	
	/**
	* Implementation of IEnumerable
	* 'enumerator'
	*/
	Hashtable.prototype.enumerator = function () {
		var self = this;
		return new HashtableEnumerator(self);
	};
	
	/**
	* Implementation of ICollection
	* 'copyTo', 'count'
	*/
	Hashtable.prototype.copyTo = function (array, index) {
		var self = this;
		if(_.isUndefined(array)) {throw new TypeError('target array is undefined for copyTo');}
		if(_.isUndefined(index)) { index = 0;}
		if(index > array.length) { index = array.length;}
		var etr = self.enumerator();
		while(etr.next()){
			if(index === array.length){
				array.push(etr.current());
			} else {
				array[index] = etr.current();
			}
			index++;
		}
	};
	
	Hashtable.prototype.count = function () {
		var self = this;
		return self._cnt;
	};
	
	/**
	* Implementation of IDictionary
	* 'keys', 'values', 'getItem', 'setItem', 'add', 'clear', 'contains', 'remove'
	*/
	Hashtable.prototype.keys = function () {
		var self = this, coll;
		coll = new netjs.collections.ArrayList(self._keys);
		return netjs.Util.proxyForMethods(coll, netjs.collections.ICollection.methods);
	};
	
	Hashtable.prototype.values = function () {
		var self = this, coll;
		coll = new netjs.collections.ArrayList(self._values);
		return netjs.Util.proxyForMethods(coll, netjs.collections.ICollection.methods);
	};
	
	Hashtable.prototype.getItem = function (key) {
		var self = this, hash;
		hash = self._equalityComparer.getHashCode(key);
		if(self.contains(key)){
			return self._values[self._hashlist[hash]];
		} else {
			return null;
		}
	};
	
	Hashtable.prototype.setItem = function (key, value){
		var self = this, hash;
		hash = self._equalityComparer.getHashCode(key);
		if(self.contains(key)){
			self._values[self._hashlist[hash]] = value;
		} else {
			self.add(key, value);
		}
	};
	
	Hashtable.prototype.add = function (key, value) {
		var self = this, hash;
		hash = self._equalityComparer.getHashCode(key);
		if(self.contains(key)){
			self.set(key, value);
		} else {
			self._hashlist[hash] = self._values.length;
			self._keys.push(key);
			self._values.push(value);
			self._cnt += 1;
		}
	};
	
	Hashtable.prototype.clear = function () {
		var self = this;
		self._hashlist = {};
		self._keys = [];
		self._values = [];
		self._cnt = 0;
	};
	
	Hashtable.prototype.contains = function (key) {
		var self = this, hash;
		hash = self._equalityComparer.getHashCode(key);
		return !_.isUndefined(self._hashlist[hash]);
	};
	
	Hashtable.prototype.remove = function (key) {
		var self = this, hash;
		hash = self._equalityComparer.getHashCode(key);
		if(self.contains(key)){
			var idx = self._hashlist[hash];
			self._keys.splice(idx, 1);
			self._values.splice(idx, 1);
			delete self._hashlist[hash];
			self._cnt -= 1;
		}	
	};
	
	Hashtable.ensureImplements(netjs.collections.IDictionary, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return Hashtable;
} (_, netjs, netjs.collections.EqualityComparer.Default, (function (netjs) {	
	
	var HashtableEnumerator = (function () {
		var HashtableEnumerator = function (source) {
			this.source = source;
			this.index = -1;
		};
		
		HashtableEnumerator.prototype.current = function () {
			var self = this;
			if(self.index > -1 && self.index < self.source.count()){
				return new netjs.collections.DictionaryEntry(
					self.source._keys[self.index],
					self.source._values[self.index]);
			} else if (self.index === -1) {
				return window.missingVariable;
			} else {
				throw new Error("InvalidEnumeratorPosistion");
			}
		};
		
		HashtableEnumerator.prototype.next = function () {
			var self = this;
			self.index += 1;
			return (self.index > -1 && self.index < self.source.count());
		};
		
		HashtableEnumerator.prototype.reset = function () {
			var self = this;
			self.index = -1;
		};
		
		HashtableEnumerator.prototype.entry = function () {
			var self = this;
			return self.current();
		};
		
		HashtableEnumerator.prototype.key = function () {
			var self = this;
			return self.current().key();
		};
		
		HashtableEnumerator.prototype.value = function () {
			var self = this;
			return self.current().value();
		};
			
		HashtableEnumerator.ensureImplements(netjs.collections.IDictionaryEnumerator);
		
		return HashtableEnumerator;
	} ());
	
	return HashtableEnumerator;
} (netjs))));
netjs.collections.DictionaryEntry = (function (netjs) {
	'use strict';
	
	var DictionaryEntry = function DictionaryEntry(key, value) {
		this.key = key;
		this.value = value;
	};
	
	DictionaryEntry.prototype.key = function () {
		var self = this;
		return self.key;
	};
	
	DictionaryEntry.prototype.value = function () {
		var self = this;
		return self.value;
	};
	
	return DictionaryEntry;	
} (netjs));
netjs.collections.DictionaryBase = (function (_, netjs) {
	'use strict';
	
	var DictionaryBase = function DictionaryBase() {
		// use _isBase to determine if this constructor is being invoked via chain or new
		if(!DictionaryBase._isBase){
			throw new Error("Can't instantiate abstract classes");
		} else {
			/**
			* Call the parent constructor
			*/
			var _args = Array.prototype.slice.call(arguments);
			DictionaryBase._parent.constructor.apply(this, _args);
			
			this._dictionary = new netjs.collections.Hashtable();
		}

		if(!DictionaryBase._isBase){
			return netjs.Util.proxy(this);
		} else {
			return this;
		}
	};
	
	DictionaryBase.inheritsFrom(netjs.Class).isType('DictionaryBase');
	
	/**
	* Implementation of IEnumerable
	* 'enumerator'
	*/
	DictionaryBase.prototype.enumerator = function (){
		var self = this;
		return self._dictionary.enumerator();
	};
	
	/**
	* Implementation of ICollection
	* 'copyTo', 'count'
	*/
	DictionaryBase.prototype.copyTo = function (array, index) {
		var self = this;
		self._dictionary.copyTo(array, index);
	};
	
	DictionaryBase.prototype.count = function () {
		var self = this;
		return self._dictionary.count();
	};
	
	/**
	* Implementation of IDictionary
	* 'keys', 'values', 'getItem', 'setItem', 'add', 'clear', 'contains', 'remove'
	*/
	DictionaryBase.prototype.keys = function () {
		var self = this;
		return self._dictionary.keys();
	};
	
	DictionaryBase.prototype.values = function () {
		var self = this;
		return self._dictionary.values();
	};
	
	DictionaryBase.prototype.getItem = function (key) {
		var self = this, currentValue;
		self.onGet(key);
		currentValue =  self._dictionary.getItem(key);
		self.onGet(key, currentValue);
		return currentValue;
	};
	
	DictionaryBase.prototype.setItem = function (key, value) {
		var self = this;
		self.onValidate(key, value);
		self.onSet(key, value);
		self._dictionary.setItem(key, value);
		self.onSetComplete(key, value);
	};
	
	DictionaryBase.prototype.add = function (key, value) {
		var self = this;
		self.onValidate(key, value);
		self.onInsert(key, value);
		self._dictionary.add(key, value);
		self.onInsertComplete(key, value);
	};
	
	DictionaryBase.prototype.clear = function () {
		var self = this;
		self.onClear();
		self._dictionary.clear();
		self.onClearComplete();
	};
	
	DictionaryBase.prototype.contains = function (key) {
		var self = this;
		return self._dictionary.contains(key);
	};
	
	DictionaryBase.prototype.remove = function (key) {
		var self = this, value;
		value =  self._dictionary.getItem(key);
		self.onValidate(key, value);
		self.onRemove(key, value);
		self._dictionary.remove(key);
		self.onRemoveComplete(key, value);
	};
	
	/**
	* The DictionaryBase API
	*/
	DictionaryBase.prototype.Dictionary = function () {
		var self = this;
		return netjs.Util.proxyForMethods(self._dictionary, netjs.collections.IDictionary.methods);
	};
	
	DictionaryBase.prototype.onClear = function () {};
	
	DictionaryBase.prototype.onClearComplete = function () {};
	
	DictionaryBase.prototype.onGet = function (key, currentValue) {};
	
	DictionaryBase.prototype.onInsert = function (key, value) {};
	
	DictionaryBase.prototype.onInsertComplete = function (key, value) {};
	
	DictionaryBase.prototype.onRemove = function (key, value) {};
	
	DictionaryBase.prototype.onRemoveComplete = function (key, value) {};
	
	DictionaryBase.prototype.onSet = function (key, value) {};
	
	DictionaryBase.prototype.onSetComplete = function (key, value) {};
	
	DictionaryBase.prototype.onValidate = function (key, value) {};
	
	DictionaryBase.ensureImplements(netjs.collections.IDictionary, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return DictionaryBase;
} (_, netjs));