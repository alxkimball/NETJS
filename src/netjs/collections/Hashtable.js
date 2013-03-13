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