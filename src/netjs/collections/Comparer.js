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