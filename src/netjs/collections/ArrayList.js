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