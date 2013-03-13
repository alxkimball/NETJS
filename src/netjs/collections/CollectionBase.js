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