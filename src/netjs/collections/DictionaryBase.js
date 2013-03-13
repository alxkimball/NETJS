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