netjs.collections.ext = (function () {
	'use strict';
	
	var ext = netjs.collections.ext || {};
	
	return ext;
} ());
netjs.collections.ext.IEnumerable = (function (netjs) {
	'use strict';
	var IEnumerable = new netjs.Interface('IEnumerable', ['aggregate', 'all', 'any', 'average',
	'concat', 'count', 'distinct', 'each', 'except', 'first', 'firstOrDefault', 'groupBy', 'intersect', 'join', 
	'last', 'lastOrDefault', 'max', 'min', 'orderBy', 'orderByDesc', 'reverse', 'select', 'selectMany', 
	'sequenceEqual', 'single', 'singleOrDefault', 'skip', 'skipWhile', 'sum', 'take', 'takeWhile', 'toArray',
	'toList', 'toLookup', 'union', 'where', 'zip']); 
	
	IEnumerable = netjs.Interface.extendInterface(IEnumerable, netjs.collections.IEnumerable);
	
	return IEnumerable;
} (netjs));
netjs.linq = (function () {
	'use strict';
	
	var linq = netjs.linq || {};
	
	return linq;
} ());
netjs.linq.IGrouping = (function (netjs) {
	'use strict';
	//sequence of elements with a key
	var IGrouping = new netjs.Interface('IGrouping', ['getKey', 'getElements']);
	IGrouping = netjs.Interface.extendInterface(IGrouping, netjs.collections.ext.IEnumerable);
	
	return IGrouping;
} (netjs));
netjs.linq.ILookup = (function (netjs) {
	'use strict';
	//a sequence of IGrouping
	var ILookup = new netjs.Interface('ILookup', ['contains', 'count', 'getItem']);
	ILookup = netjs.Interface.extendInterface(ILookup, netjs.collections.IEnumerable);
	
	return ILookup;
} (netjs));
netjs.linq.IOrderedEnumerable = (function (netjs) {
	'use strict';
	var IOrderedEnumerable = new netjs.Interface('IOrderedEnumerable', ['createOrderedEnumerable', 'thenBy', 'thenByDesc']);
	IOrderedEnumerable = netjs.Interface.extendInterface(IOrderedEnumerable, netjs.collections.ext.IEnumerable);
	
	return IOrderedEnumerable;
} (netjs));
netjs.linq.Enumerable = (function (_, netjs, enumerables) {
	'use strict';
	var _isEnumerable = function (testObj) {
		var itr;
		//check that the enumerator method exists and returns a proper enumerator
		netjs.Interface.ensureImplements(testObj, netjs.collections.IEnumerable);		
		itr = testObj.enumerator();
		netjs.Interface.ensureImplements(itr, netjs.collections.IEnumerator);
		return itr;
	};
	
	//TODO more argument checking throw TypeError 
	//TODO do documentation for return types of methods
	//TODO
	//  repeat, toDictionary
	//	#groupJoin #- return IEnumerable<IGroup<key, value>>
	/**
	* Provides a set of static methods for querying objects that implement netjs.collections.ext.IEnumerable. It
	* assumes that the object it extends implements netjs.IEnumerable, if not then function will
	* throw exceptions.
	*/
	var Enumerable = function Enumerable(){ throw new Error("Can't instantiate abstract classes"); };
	
	/**
	* Applies an accumulator(function(element, currentSum){ return newSum}) function over a sequence.
	* Overloaded. Applies an accumulator function over a sequence. The specified seed value is used 
	* as the initial accumulator value.
	*/
	Enumerable.prototype.aggregate = function (accumulator, seed) {		
		var self = this, itr, currentSum = !_.isUndefined(seed) ? seed : window.missingVariable;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		while(itr.next()){
			currentSum = accumulator(itr.current(), currentSum);
		}
		return currentSum;
	};

	/**
	* Determines whether all elements of a sequence satisfy a condition.
	* Or false if the sequence is empty.
	*/
	Enumerable.prototype.all = function (condition) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt = self.count();
		if(cnt !== 0) {
			return self.count(condition) === cnt;
		} else {
			return false;
		}
	};
	
	/**
	* Determines whether a sequence contains any elements. 
	* Overloaded. Determines whether any element of a sequence satisfies a condition. 
	* @usage queryable.any() or queryable.any(function (element) {... return bool}).
	* @returns bool whether the sequence contains any elements or and elements satisfy the condition.
	*/
	Enumerable.prototype.any = function (condition) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt = self.count();
		if(cnt !== 0) {
			return self.count(condition) > 0;
		} else {
			return false;
		}
	};
	
	/**
	* Computes the average of a sequence of values or undefined if the sequence is empty.
	* Overloaded. Computes the average of a sequence of values that are obtained by 
	* invoking a transform function on each element of the input sequence.
	*/
	Enumerable.prototype.average = function (transform) {
		var self = this, itr, cnt = 0, sum, agg, t;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt = self.count();
		if(cnt > 0){		
			sum = self.sum(transform);
			return sum / cnt;
		}
		return window.missingVariable;
	};
	
	/**
	* Concatenates two sequences.
	* @returns the IEnumerable concatenation of the two sequences.
	*/
	Enumerable.prototype.concat = function (second) {
		var self = this, cat;
		//create a netjs.collections.IEnumerable object that implements enumerator that 
		//enumerates the self sequence then the second sequence
		cat = new enumerables.ConcatenatedEnumerable(self, second);
		return cat;
	};
	
	/**
	* Returns the number of elements in a sequence.
	* Overloaded. Returns a number that represents how many elements in the specified sequence satisfy a condition.
	*/
	Enumerable.prototype.count = function (condition) {
		var self = this, itr, cnt = 0;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		if(!_.isUndefined(condition) && _.isFunction(condition)){
			while(itr.next()){
				if(condition(itr.current())){
					cnt += 1;
				}
			}
		} else {
			while(itr.next()){			
				cnt += 1;
			}
		}
		return cnt;
	};
	
	Enumerable.prototype.contains = function (element, equalityComparer) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);
		if(_.isUndefined(equalityComparer)){
			equalityComparer = netjs.collections.EqualityComparer.Default;
		}
		//proceed with enumerator based processing		
		cnt = self.count();
		if(cnt > 0){
			while(itr.next()){
				if(equalityComparer.equals(itr.current(), element)){
					return true;
				}
			}
			return false;
		} else {
			return false;
		}
	}
	
	/**
	* Returns distinct elements from a sequence by using the default equality comparer to compare values.
	* Returns distinct elements from a sequence by using a specified compare function to compare values. 
	*/
	Enumerable.prototype.distinct = function (comparer) {
		var self = this, itr;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		return new enumerables.DistinctEnumerable(self, comparer);
	};
	
	/**
	* Applies a void function(function(element){ ... }) over a sequence. 
	*/
	Enumerable.prototype.each = function (func) {
		var self = this, itr, n, c;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		while(itr.next()){
			func(itr.current());
		}
	};
	
	Enumerable.prototype.empty = function () {
		return new enumerables.EmptyEnumerable();
	};
	
	/**
	* Produces the set difference of two sequences by using the default equality comparer to compare values.
	* Overloaded. Produces the set difference of two sequences by using the specified equality comparer.
	*
	* This method returns those elements in first that do not appear in second. 
	* It does not also return those elements in second that do not appear in first.
	*/
	Enumerable.prototype.except = function (source2, comparer) {
		var self = this, itr, cnt1, cnt2;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt1 = self.count();
		cnt2 = source2.count();
		//if either sequence is empty yield an empty enumerable
		if(cnt1 < 1 || cnt2 < 1) {
			return new enumerables.EmptyEnumerable();
		}
		return new enumerables.ExceptEnumerable(self, source2, comparer);
	};
		
	Enumerable.prototype.first = function (predicate) {
		var self = this, itr;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		if(!_.isUndefined(predicate)){
			while(itr.next()){
				if(predicate(itr.current())){
					return itr.current();
				}
			}
			throw new Error('InvalidOperationException: predicate did not yield a matching element');
		} else {
			itr.next();
			return itr.current();
		}
	};
	
	Enumerable.prototype.firstOrDefault = function (predicate) {
		var self = this, itr;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		if(!_.isUndefined(predicate)){
			while(itr.next()){
				if(predicate(itr.current())){
					return itr.current();
				}
			}
			return null;
		} else {
			itr.next();
			return itr.current();
		}
	};
	
	Enumerable.prototype.groupBy = function(keySelector, elementSelector, resultSelector, equalityComparer){
		var self = this, itr, cnt, lookUp;
		if(!_.isUndefined(resultSelector)){ 
			var group = self.groupBy(keySelector, elementSelector, equalityComparer);
			return group.select(function (group) { 
				return resultSelector(group.getKey(), group)
			});
		}
		itr = _isEnumerable(self);
		if(_.isUndefined(keySelector)){ throw new Error("ArgumentNullException: " + 'keySelector');}
		if(_.isUndefined(elementSelector)){ throw new Error("ArgumentNullException: " + 'elementSelector');}
		//proceed with enumerator based processing		
		cnt = self.count();
		if(cnt > 0){
			lookUp = getLookup(itr, keySelector, elementSelector, equalityComparer);
			return netjs.Util.proxyForMethods(lookUp.select(function (x) {return x;}), netjs.collections.ext.IEnumerable.methods);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	}
	
	/**
	* Produces the set intersection of two sequences by using the default equality comparer to compare values.
	* Overloaded. Produces the set intersection of two sequences by using the specified equality comparer. 
	*/
	Enumerable.prototype.intersect = function (source2, comparer) {
		var self = this, itr, cnt1, cnt2;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt1 = self.count();
		cnt2 = source2.count();
		//if either sequence is empty yield an empty enumerable
		if(cnt1 < 1 || cnt2 < 1) {
			return new enumerables.EmptyEnumerable();
		}
		return new enumerables.IntersectEnumerable(self, source2, comparer);
	};
	
	Enumerable.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, equalityComparer){
		var outer = this, itr, cnt, lookUp, key, element;
		itr = _isEnumerable(outer);
		if(_.isUndefined(outerKeySelector)){ throw new Error("ArgumentNullException: " + 'outerKeySelector');}
		if(_.isUndefined(innerKeySelector)){ throw new Error("ArgumentNullException: " + 'innerKeySelector');}
		if(_.isUndefined(resultSelector)){ throw new Error("ArgumentNullException: " + 'resultSelector');}
		//proceed with enumerator based processing		
		cnt = outer.count();
		if(cnt > 0){
			var lookup = inner.toLookup(innerKeySelector, function (x) {return x;}, equalityComparer);
			var results = outer.selectMany(function lookupOuter(outerElement) { return lookup.getItem(outerKeySelector(outerElement)); }, resultSelector);
			return results;
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	}
	
	Enumerable.prototype.last = function (predicate) {
		var self = this, itr, last;
		itr = _isEnumerable(self);
		itr = new enumerables.ReverseEnumerable(self).enumerator();
		//proceed with enumerator based processing
		if(!_.isUndefined(predicate)){
			while(itr.next()){
				if(predicate(itr.current())){
					return itr.current();
				}
			}
			throw new Error('InvalidOperationException: predicate did not yield a matching element');
		} else {
			itr.next();
			return itr.current();
		}
	};
	
	Enumerable.prototype.lastOrDefault = function (predicate) {
		var self = this, itr, last;
		itr = _isEnumerable(self);
		itr = new enumerables.ReverseEnumerable(self).enumerator();
		//proceed with enumerator based processing
		if(!_.isUndefined(predicate)){
			while(itr.next()){
				if(predicate(itr.current())){
					return itr.current();
				}
			}
			return null;
		} else {
			itr.next();
			return itr.current();
		}
	};
	
	/**
	* Returns the maximum element in list. Greater than (a > b) is used by default. 
	* If criterion is passed, it will be used on each value to generate the value rank.
	* If two elements are equally the max then the first is returned.
	* @Usage: queryable.max() or queryable.max(function(element) { return element.comparableValue; })
	*/
	Enumerable.prototype.max = function (criterion) {
		var self = this, itr, max;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		max = itr.current(); //an empty collection return undefined for max
		while(itr.next()){
			if(!_.isUndefined(criterion) && _.isFunction(criterion)){
				if(criterion(itr.current()) > criterion(max)) {
					max = itr.current();
				}
			} else {
				if(itr.current() > max) {
					max = itr.current();
				}
			}
		}
		return max;
	};
	
	/**
	* Returns the minimum element in list. Less than (a < b) is used by default. 
	* If criterion is passed, it will be used on each value to generate the value rank.
	* If two elements are equally the min then the first is returned.
	* @Usage: queryable.min() or queryable.min(function(element) { return element.comparableValue; })
	*/
	Enumerable.prototype.min = function (criterion) {
		var self = this, itr, min;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		min = itr.current(); //an empty collection return undefined for min
		while(itr.next()){
			if(!_.isUndefined(criterion) && _.isFunction(criterion)){
				if(criterion(itr.current()) < criterion(min)) {
					min = itr.current();
				}
			} else {
				if(itr.current() < min) {
					min = itr.current();
				}
			}
		}
		return min;
	};
	
	/**
	* Sorts the elements of a sequence in ascending order according to a key.
	* Overloaded. Sorts the elements of a sequence in ascending order by using a specified comparer. 
	*/
	Enumerable.prototype.orderBy = function (keySelector, comparer) {
		var self = this, itr;
		//itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		return new enumerables.OrderedEnumerable(self, 
			new enumerables.ProjectionComparer(keySelector, comparer));
	};
	
	/**
	* Sorts the elements of a sequence in descending order according to a key. 
	* Overloaded. Sorts the elements of a sequence in descending order by using a specified comparer. 
	*/
	Enumerable.prototype.orderByDesc = function (keySelector, comparer) {
		var self = this, itr, sourceComparer;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		sourceComparer = new enumerables.ProjectionComparer(keySelector, comparer);
		sourceComparer = new enumerables.ReverseComparer(sourceComparer);
		return new enumerables.OrderedEnumerable(self, sourceComparer);
	};
	
	/*STATIC
	* Generates a sequence of integral numbers within a specified range.
	*/
	Enumerable.range = function (start, count) {
		var arr = [], i, src;
		if(_.isUndefined(start)){ throw new Error('ArgumentException: start is undefined');}
		if(_.isUndefined(count)){ throw new Error('ArgumentException: count is undefined');}
		if(count < 0){ throw new Error('ArgumentOutOfRangeException: count is less than zero');}
		
		for(i = 0; i < count; i++){
			arr.push(start + i);
		}
		
		src = new netjs.collections.ext.ArrayList(arr);
		return  netjs.Util.proxyForMethods(src, netjs.collections.ext.IEnumerable.methods);
	};

	Enumerable.repeat = function (element, count){
		var arr = [], i, src, out;
		if(_.isUndefined(element)){ throw new Error('ArgumentException: element is undefined');}
		if(_.isUndefined(count)){ throw new Error('ArgumentException: count is undefined');}
		if(count < 0){ throw new Error('ArgumentOutOfRangeException: count is less than zero');}
		
		src = new netjs.collections.ext.ArrayList(arr);
		return netjs.Util.proxyForMethods(src, netjs.collections.ext.IEnumerable.methods);
	};
	
	/**
	* Inverts the order of the elements in a sequence.
	*/
	Enumerable.prototype.reverse = function () {
		var self = this, itr;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		return new enumerables.ReverseEnumerable(self);
	};
	
	/**
	* Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
	* Overloaded. Determines whether two sequences are equal by using a specified equality comparer.
	*/
	Enumerable.prototype.sequenceEqual = function (source2, comparer) {
		var self = this, itr, itr2, cnt, cnt2, comp;
		itr = _isEnumerable(self);	
		itr2 = _isEnumerable(source2);
		comp = comparer || function (a,b) { return _.isEqual(a,b);};
		//proceed with enumerator based processing
		cnt = self.count();
		cnt2 = source2.count();
		if(cnt === cnt2) {
			while(itr.next() && itr2.next()){
				if(!comp(itr.current(), itr2.current())){
					return false;
				}
			}
			return true;
		}
		return false;
	};
	
	/**
	* Projects each element of a sequence into a new form.
	*/
	Enumerable.prototype.select = function(selector) {
		var self = this, itr;
		itr = _isEnumerable(self);
		if(_.isUndefined(selector) || _.isNull(selector)){ throw new Error("ArgumentNullException: " + 'selector');}
		//proceed with enumerator based processing
		return new enumerables.ProjectionEnumerable(self, selector);
	};
	
	Enumerable.prototype.selectMany = function (selector, resultSelector) {
		var self = this, itr;
		itr = _isEnumerable(self);
		if(_.isUndefined(selector) || _.isNull(selector)){ throw new Error("ArgumentNullException: " + 'selector');}
		//if the resultSelector is defined then the selector is assumed to be a collection selector
		if(_.isUndefined(resultSelector)){
			//do default
			return new enumerables.CompoundProjectionEnumerable(self, selector);
		} else {
			return new enumerables.CompoundProjectionEnumerable(self, selector, resultSelector);
		}
	}
	
	Enumerable.prototype.sequenceEqual = function (source2, equalityComparer){
		var self = this, itr, itr2, cnt, lookUp;
		itr = _isEnumerable(self);
		itr2 = _isEnumerable(source2);
		if(_.isUndefined(equalityComparer)){
			equalityComparer = netjs.collections.EqualityComparer.Default;
		}
		//proceed with enumerator based processing		
		cnt = self.count();
		if(cnt > 0 && cnt === source2.count()){
			while(itr.next()){
				if(!itr2.next()){
					return false;
				}
				if(!equalityComparer.equals(itr.current(), itr2.current())){
					return false;
				}
			}
			return true;
		} else {
			return cnt === source2.count() && cnt === 0;
		}
	};
	
	Enumerable.prototype.single = function (predicate) {
		var self = this, itr, sin = null;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		if(!_.isUndefined(predicate)){
			while(itr.next()){
				if(predicate(itr.current())){
					if(_.isNull(sin)){
						sin = itr.current();
					} else {
						throw new Error('InvalidOperationException: predicate yielded more than one matching element');
					}
				}
			}
			if(_.isNull(sin)){
				throw new Error('InvalidOperationException: predicate did not yield a matching element');
			} else {
				return sin;
			}
		} else {
			itr.next();
			sin = itr.current();
			if(itr.next()){
				throw new Error('InvalidOperationException: sequence contains more than one element');
			} else {
				return sin;
			}
		}
	};
	
	Enumerable.prototype.singleOrDefault = function (predicate) {
		var self = this, itr, sin = null;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		if(!_.isUndefined(predicate)){
			while(itr.next()){
				if(predicate(itr.current())){
					if(_.isNull(sin)){
						sin = itr.current();
					} else {
						throw new Error('InvalidOperationException: predicate yielded more than one matching element');
					}
				}
			}
			if(_.isNull(sin)){
				return null;
			} else {
				return sin;
			}
		} else {
			itr.next();
			sin = itr.current();
			if(itr.next()){
				throw new Error('InvalidOperationException: sequence contains more than one element');
			} else {
				return sin;
			}
		}
	};
	
	/**
	*  Bypasses a specified number of elements in a sequence and then returns the remaining elements.
	* @returns the IEnumerable sequence of the specified number of contiguous elements after the bypased elements of a sequence.
	*/
	Enumerable.prototype.skip = function (count) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		//enumerates source and yields elements until count elements have been yielded or source 
		//contains no more elements.		
		cnt = self.count();
		if(cnt > 0){
			return new enumerables.RangeEnumerable(self,
				function(steps){
					return steps === count;
				},
				function(steps){
					return false;
				}
			);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	};
	
	/**
	* Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
	* @returns the IEnumerable sequence of the remaining elements.
	*/
	Enumerable.prototype.skipWhile = function (condition) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		//enumerates source and yields elements until count elements have been yielded or source 
		//contains no more elements.		
		cnt = self.count();
		if(cnt > 0){
			return new enumerables.RangeEnumerable(self,
				function(steps, element){
					return !condition(element);
				},
				function(steps){
					return false;
				}
			);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	};
	
	/**
	*  Computes the sum of the sequence or undefined for an empty sequence.
	*  Overloaded. Computes the sum of the sequence whose values are obtained by invoking a transform function on each element of the input sequence.
	*/
	Enumerable.prototype.sum = function (transform) {
		var self = this, itr, cnt = 0, sum, agg, t;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt = self.count();
		if(cnt > 0){
			if(!_.isUndefined(transform) && _.isFunction(transform)){
				agg = function(element, currentSum){
					t = transform(element);
					if(!_.isNaN(t) && !isNaN(t)){
						currentSum += t;						
					} else {
						throw new Error('The transform yielded NaN for an element .');
					}
					return currentSum;
				};
				sum = self.aggregate(agg, 0);
			} else {
				agg = function(element, currentSum){
					t = element;
					if(!_.isNaN(t) && !isNaN(t)){
						currentSum += t;						
					} else {
						throw new Error('The sequence yielded NaN for an element .');
					}
					return currentSum;
				};
				sum = self.aggregate(agg, 0);
			}
			return sum;
		}
		return window.missingVariable;
	};
	
	/**
	* Returns a specified number of contiguous elements from the start of a sequence.
	* @returns the IEnumerable sequence of the specified number of contiguous elements from the start of a sequence.
	*/
	Enumerable.prototype.take = function (count) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		//enumerates source and yields elements until count elements have been yielded or source 
		//contains no more elements.		
		cnt = self.count();
		if(cnt > 0){
			return new enumerables.RangeEnumerable(self,
				function(steps){
					return steps === 0;
				},
				function(steps){
					return steps === count - 1;
				}
			);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	};
	
	/**
	*  Returns elements from a sequence as long as a specified condition is true. 
	* @returns the IEnumerable sequence of elements from a sequence as long as a specified condition is true. 
	*/
	Enumerable.prototype.takeWhile = function (condition) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		//enumerates source and yields elements until the condition fails or source 
		//contains no more elements.		
		cnt = self.count();
		if(cnt > 0){
			return new enumerables.RangeEnumerable(self,
				function(steps){
					return steps === 0;
				},
				function(steps, element){
					return steps === cnt || !condition(element);
				}
			);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	};
	
	/**
	* Creates an array from an IEnumerable
	*/
	Enumerable.prototype.toArray = function () {
		var self = this, itr, cnt, arr = [];
		itr = _isEnumerable(self);
		cnt = self.count();
		if(cnt > 0) {
			while(itr.next()){
				arr.push(itr.current());
			}
		}
		return arr;
	};
	
	/*
	* Creates a IList from an IEnumerable.
	*/
	Enumerable.prototype.toList = function () {
		var self = this, itr, cnt, arr = [];
		itr = _isEnumerable(self);
		cnt = self.count();
		if(cnt > 0) {
			while(itr.next()){
				arr.push(itr.current());
			}			
		}
		return new netjs.collections.ext.ArrayList(arr);
	}
	
	/**
	* Creates an ILookup from an IEnumerable according to a specified key selector function.
	* Overloaded Creates an ILookup from an IEnumerable according to a specified key selector and key comparer functions.
	*/
	Enumerable.prototype.toLookup = function (keySelector, elementSelector, equalityComparer) {
		var self = this, itr, cnt, lookUp;
		itr = _isEnumerable(self);
		if(_.isUndefined(keySelector)){ throw new Error("ArgumentNullException: " + 'keySelector');}
		if(_.isUndefined(elementSelector)){
			elementSelector = function(x) { 
				return x;
			};
		}
		if(_.isUndefined(equalityComparer)){
			equalityComparer = netjs.collections.EqualityComparer.Default;
		}
		//proceed with enumerator based processing		
		cnt = self.count();
		if(cnt > 0){
			lookUp = getLookup(itr, keySelector, elementSelector, equalityComparer);
			return netjs.Util.proxyForMethods(lookUp, netjs.linq.ILookup.methods);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			//TODO return an empty ILookup(contains() always returns false)
			return new enumerables.EmptyEnumerable();
		}
	};
	
	var getLookup = function (enumerator, keySelector, elementSelector, equalityComparer){
		var lookUp = new enumerables.LookUp(equalityComparer), key, element;
		while(enumerator.next()){
			key = keySelector(enumerator.current());
			element = elementSelector(enumerator.current());
			lookUp.add(key, element);
		}
		return lookUp;
	}
	
	/**
	* Produces the set union of two sequences by using the default equality comparer.
	* Overloaded. Produces the set union of two sequences by using a specified equality comparer.
	*/
	Enumerable.prototype.union = function (source2, comparer) {
		var self = this, itr, cnt1, cnt2;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt1 = self.count();
		cnt2 = source2.count();
		//if the source enumerable is empty return the second source enumerable
		if(cnt1 > 0){
			//if the second is empty return the first
			if(cnt2 === 0) {
				return self;
			}
			//return the union
			return self.concat(source2).distinct(comparer);
		}
		return source2;
	};
	
	/**
	* Filters a sequence of values based on a predicate.
	*/
	Enumerable.prototype.where = function (predicate) {
		var self = this, itr, cnt;
		itr = _isEnumerable(self);		
		//proceed with enumerator based processing
		cnt = self.count();
		if(cnt > 0){
			return new enumerables.ConditionalEnumerable(self, predicate);
		} else {
			//If count is less than or equal to zero, source is not enumerated and an empty IEnumerable is returned.
			return new enumerables.EmptyEnumerable();
		}
	};
	
	/**
	* Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
	*
	* If the input sequences do not have the same number of elements, the method combines elements until it reaches 
	* the end of one of the sequences. For example, if one sequence has three elements and the other one has four, 
	* the result sequence has only three elements.
	*/
	Enumerable.prototype.zip = function (source2, resultSelector) {
		var self = this, itr, cnt1, cnt2;
		itr = _isEnumerable(self);
		if(_.isUndefined(resultSelector) || !_.isFunction(resultSelector)){
			throw new TypeError('resultSelector is not a function');
		}
		//proceed with enumerator based processing
		cnt1 = self.count();
		cnt2 = source2.count();
		//if either sequence is empty yield an empty enumerable
		if(cnt1 < 1 || cnt2 < 1) {
			return new enumerables.EmptyEnumerable();
		}
		return new enumerables.ZipEnumerable(self, source2, resultSelector);
	};
	
	/**
	* Create an netjs.collections.ext.IEnumerable from the passed netjs.collections.IEnumerable
	*/
	Enumerable.makeEnumerable = function (enumerable) {
		var queryable;
		//check that the passed object is an IEnumerable
		enumerable.ensureImplements(netjs.collections.IEnumerable);
		//mixin the functions from Enumerable
		//TODO find a way to tdo this in core that doesn't expose implementation.
		queryable = _.extend(enumerable.prototype, Enumerable.prototype);
		enumerable.ensureImplements(netjs.collections.ext.IEnumerable);
	};
	
	Enumerable.makeEnumerable(enumerables.EmptyEnumerable);
	Enumerable.makeEnumerable(enumerables.ConcatenatedEnumerable);
	Enumerable.makeEnumerable(enumerables.RangeEnumerable);
	Enumerable.makeEnumerable(enumerables.ConditionalEnumerable);
	Enumerable.makeEnumerable(enumerables.DistinctEnumerable);
	Enumerable.makeEnumerable(enumerables.ReverseEnumerable);
	Enumerable.makeEnumerable(enumerables.ProjectionEnumerable);
	Enumerable.makeEnumerable(enumerables.IntersectEnumerable);
	Enumerable.makeEnumerable(enumerables.ExceptEnumerable);
	Enumerable.makeEnumerable(enumerables.ZipEnumerable);
	Enumerable.makeEnumerable(enumerables.OrderedEnumerable);
	Enumerable.makeEnumerable(enumerables.LookUp);
	Enumerable.makeEnumerable(enumerables.CompoundProjectionEnumerable);
	enumerables.OrderedEnumerable.ensureImplements(netjs.linq.IOrderedEnumerable);
	
	return Enumerable;
}(_, netjs, (function (_, netjs) {
	'use strict';
	var _isEnumerable = function (testObj) {
		var itr;
		//check that the enumerator method exists and returns a proper enumerator
		netjs.Interface.ensureImplements(testObj, netjs.collections.IEnumerable);		
		itr = testObj.enumerator();
		netjs.Interface.ensureImplements(itr, netjs.collections.IEnumerator);
		return itr;
	};
	
	/**
	* EmptyEnumerable
	*/
	var EmptyEnumerable = (function () {
		var EmptyEnumerator = function () {};
	
		EmptyEnumerator.prototype.current = function () {
			return window.missingVariable;
		};
		
		EmptyEnumerator.prototype.next = function () {
			return false;
		};
		
		EmptyEnumerator.prototype.reset = function () {};
		
		EmptyEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		/**
		* Private class for creating an empty enumerable
		*/
		var EmptyEnumerable = function () {};
		
		EmptyEnumerable.prototype.enumerator = function () {
			return new EmptyEnumerator();
		};
		
		EmptyEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return EmptyEnumerable;
	} ());
	
	/**
	* ConcatenatedEnumerable
	*/
	var ConcatenatedEnumerable = (function () {
		var ConcatentatedEnumerator = function (first, second) {
			var self = this;
			self.firstEnumerator = first;
			self.secondEnumerator = second;
			//-1 not started, 
			//0 enumerating first sequence, 
			//1 enumerating second sequence, 
			//2 finished enumerating both sequences
			self.state = -1;
			self.reset();
		};
	
		ConcatentatedEnumerator.prototype.current = function () {
			var self = this;
			switch(self.state) {
				case -1:
					return window.missingVariable;
				case 0:
					return self.firstEnumerator.current();
				case 1:
					return self.secondEnumerator.current();
				default:
					throw new Error("InvalidEnumeratorPosistion");
			}
		};
		
		ConcatentatedEnumerator.prototype.next = function () {
			var self = this;
			switch(self.state) {
				case -1:
				case 0:
					var fn = self.firstEnumerator.next();
					if(!fn) {
						var sn = self.secondEnumerator.next();
						if(!sn) {
							self.state = 2;
							return false;
						}
						self.state = 1;
						return sn;
					}
					self.state = 0;
					return fn;
				case 1:
					var sn = self.secondEnumerator.next();
					if(!sn) {
						self.state = 2;
						return false;
					}
					self.state = 1;
					return sn;
				default:
					throw new Error("InvalidEnumeratorPosistion");
			}
		};
		
		ConcatentatedEnumerator.prototype.reset = function () {
			var self = this;
			self.firstEnumerator.reset();
			self.secondEnumerator.reset();
			self.state = -1;
		};
		
		ConcatentatedEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		var ConcatenatedEnumerable = function (first, second) {
			var self = this;
			self.firstEnumerable = first;
			self.secondEnumerable = second;		
		};
		
		ConcatenatedEnumerable.prototype.enumerator = function () {
			var self = this, fitr, sitr;
			fitr = _isEnumerable(self.firstEnumerable);
			sitr = _isEnumerable(self.secondEnumerable);
			return new ConcatentatedEnumerator(fitr, sitr);
		};
		
		ConcatenatedEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return ConcatenatedEnumerable;
	} ());
	
	/**
	* RangeEnumerable
	*/
	var RangeEnumerable = (function () {
		/**
		* Private class for creating ranged enumerables
		* @param origEnum is the enumerator of the underlying sequence.
		* @param funcStart is the function that determines when the range should begin on the underlying sequence.
		* @param funcEnd is the function that dertermines when the range should end on the underlying sequence.
		* Fucntion take the signature of:
		*	function(steps, currentElement){ .... return bool;}
		*	where steps is the number of times next has been called and currentElement
		*	is the current element of the underlying sequence.
		*/
		var RangeEnumerator = function (origEnum, funcStart, funcEnd) {
			this.origEnum = origEnum;
			this.funcStart = funcStart;
			this.funcEnd = funcEnd;
			this.steps = 0;
			this.reset();
		};
		
		RangeEnumerator.prototype.current = function () {
			var self = this;
			return self.origEnum.current();
		};
		
		RangeEnumerator.prototype.next = function () {
			var self = this;
			if(_.isUndefined(self.origEnum.current())){
				//advance the original enumerator until the start condition is met or end of sequence
				while(self.origEnum.next()){			
					if(self.funcStart(self.steps, self.origEnum.current())){					
						return true;
					} else {
						self.steps += 1;
					}				
				}
			} else {
				//advance the original enumerator
				if(self.origEnum.next()){
					//if the current item fails the end test then advance to end of origEnum
					if(self.funcEnd(self.steps, self.origEnum.current())){
						while(self.origEnum.next()){}
						return false;
					}
					self.steps += 1;
					return true;
				}
				return false;
			}		
		};
		
		RangeEnumerator.prototype.reset = function () {
			var self = this;
			self.steps = 0;
			//reset the original enumerator
			self.origEnum.reset();		
		};
		
		RangeEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		/**
		* Private class for creating ranged enumerables
		* @param origEnum is the underlying enumerable over which the range is created.
		* @param funcStart is the step function that dertermines when the range should begin on the underlying enumerable.
		* @param funcEnd is the step function that dertermines when the range should end on the underlying enumerable.
		*/
		var RangeEnumerable = function (origEnum, funcStart, funcEnd){
			this.origEnum = origEnum;
			this.funcStart = funcStart;
			this.funcEnd = funcEnd;
		};
		
		RangeEnumerable.prototype.enumerator = function () {
			var self = this;
			return new RangeEnumerator(self.origEnum.enumerator(), self.funcStart, self.funcEnd);
		};
		
		RangeEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return RangeEnumerable;

	} ());
	
	/**
	* ConditionalEnumerable
	*/
	var ConditionalEnumerable = (function () {
		var ConditionalEnumerator = function (origEnum, condition)
		{
			this.origEnum = origEnum;
			this.condition = condition;
		};
		
		ConditionalEnumerator.prototype.current = function () {
			var self = this;
			return self.origEnum.current();
		};
		
		ConditionalEnumerator.prototype.next = function () {
			var self = this;
			//enumerate the orgiginal enumerator until contion(origEnum.current()) 
			//is true or till the end of the sequence
			while(self.origEnum.next()){
				if(self.condition(self.origEnum.current())){
					return true;
				}
			}
			return false;
		};
		
		ConditionalEnumerator.prototype.reset = function () {
			var self = this;
			self.origEnum.reset();
		};
		
		ConditionalEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		var ConditionalEnumerable = function (origEnum, condition) {
			this.origEnum = origEnum;
			this.condition = condition;
		};
		
		ConditionalEnumerable.prototype.enumerator = function () {
			var self = this;
			return new ConditionalEnumerator(self.origEnum.enumerator(), self.condition);
		};
		
		ConditionalEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return ConditionalEnumerable;

	} ());
	
	/**
	* DistinctEnumerable
	* TODO Build distinct array and return array enumerator
	*/
	var DistinctEnumerable = (function () {
		var DistinctEnumerator = function (origEnum, comparator) {
			this.origEnum = origEnum;
			this.seen = [];
			if(_.isUndefined(comparator)){
				this.comparator = function (a, b) { 
					return _.isEqual(a, b);
				};
			} else {
				this.comparator = comparator;
			}
		};
		
		DistinctEnumerator.prototype.current = function () {
			var self = this;
			return self.origEnum.current();
		};
		
		DistinctEnumerator.prototype.next = function () {
			var self = this;
			//enumerate the original enumerator until an element is unseen
			//or till the end of the sequence
			while(self.origEnum.next()){
				if(!self.isSeen(self.origEnum.current())){
					return true;
				}
			}		
			return false;
		};
		
		DistinctEnumerator.prototype.isSeen = function (element) {
			var self = this, found;
			found = _.find(self.seen, function (seenElement) {
				return self.comparator(seenElement, element);
			});
			if(_.isUndefined(found)){
				self.seen.push(element);
				return false;
			}
			return true;
		};
		
		DistinctEnumerator.prototype.reset = function () {
			var self = this;
			self.seen = [];
			self.origEnum.reset();
		};
		
		DistinctEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		var DistinctEnumerable = function (origEnum, comparator){
			this.origEnum = origEnum;
			this.comparator = comparator;
		};
		
		DistinctEnumerable.prototype.enumerator = function (){
			var self = this;		
			return new DistinctEnumerator(self.origEnum.enumerator(), self.comparator);
		};
		
		DistinctEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return DistinctEnumerable;
	} ());
	
	/**
	* ReverseEnumerable
	*/
	var ReverseEnumerable = (function () {
		var ReverseEnumerator = function (origEnum) {
			this.origEnum = origEnum;
			this.stack = [];
			while(this.origEnum.next()){
				this.stack.push(this.origEnum.current());
			}
			this.index = this.stack.length;
		};
		
		ReverseEnumerator.prototype.current = function () {
			var self = this;
			if(self.index === self.stack.length){
				return window.missingVariable;
			}
			if(self.index > - 1 && self.index < self.stack.length) {
				return self.stack[self.index];
			}
			throw new Error("InvalidEnumeratorPosistion");
		};
		
		ReverseEnumerator.prototype.next = function () {
			var self = this;
			self.index -= 1;
			return self.index > - 1 && self.index < self.stack.length;
		};
		
		ReverseEnumerator.prototype.reset = function () {
			var self = this;
			self.index = self.stack.length;		
		};
		
		ReverseEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		var ReverseEnumerable = function (origEnum) {
			this.origEnum = origEnum;
		};
		
		ReverseEnumerable.prototype.enumerator = function () {
			var self = this;
			return new ReverseEnumerator(self.origEnum.enumerator());
		};
		
		ReverseEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return ReverseEnumerable;

	} ());
	
	var ProjectionEnumerator = (function () {
		var ProjectionEnumerator = function (origEnum, selector) {
			this.origEnum = origEnum;
			this.selector = selector;
		};
		
		ProjectionEnumerator.prototype.current = function () {
			var self = this, curr;
			curr = self.origEnum.current();
			if(_.isUndefined(curr)){
				return window.missingVariable;
			}
			return self.selector(curr);
		};
		
		ProjectionEnumerator.prototype.next = function () {
			var self = this;
			return self.origEnum.next();
		};
		
		ProjectionEnumerator.prototype.reset = function () {
			var self = this;
			self.origEnum.reset();
		};
		
		ProjectionEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		return ProjectionEnumerator;
	} ());
	
	/**
	* ProjectionEnumerable
	*/
	var ProjectionEnumerable = (function () {		
		var ProjectionEnumerable = function (origEnum, selector){
			this.origEnum = origEnum;
			this.selector = selector;		
		};
		
		ProjectionEnumerable.prototype.enumerator = function  () {
			var self = this;
			return new ProjectionEnumerator(self.origEnum.enumerator(), self.selector);
		};
		
		ProjectionEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return ProjectionEnumerable;

	} ());
	
	var CompoundProjectionEnumerable = (function () {
		var _flatten = function (source, projector, optResultSelector){
			var result = [], sourceSequence = source.enumerator(), resultSelector;
			if(_.isUndefined(optResultSelector) || _.isNull(optResultSelector)){
				resultSelector = function (x) { return (x); };
			} else {
				resultSelector = optResultSelector;
			}
			
			while(sourceSequence.next()){				
				var x = sourceSequence.current();
				var projection = projector(x);
				var projectionSequence;
				if(_.isArray(projection)){
					projectionSequence = new netjs.collections.ArrayEnumerator(projection);
				} else if(netjs.Interface.objectImplements(projection, netjs.collections.IEnumerable)) {
					projectionSequence = projection.enumerator();
				} else if(netjs.Interface.objectImplements(projection, netjs.collections.IEnumerator)) {
					projectionSequence = projection;
				} else {
					projectionSequence = new netjs.collections.ArrayEnumerator([projection]);
				}
				while(projectionSequence.next()){
					var y = projectionSequence.current();
					result.push(resultSelector(x, y));
				}
			}
			return result;
		}
	
		var CompoundProjectionEnumerable = function (origEnum, projector, resultSelector){
			this.origEnum = origEnum;
			this.projector = projector;
			this.resultSelector = resultSelector;
		};
		
		CompoundProjectionEnumerable.prototype.enumerator = function (){
			var self = this;			
			//flatten the projected sequence
			var flat = _flatten(self.origEnum, self.projector, self.resultSelector);
			return new netjs.collections.ArrayEnumerator(flat);
		};
		
		CompoundProjectionEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return CompoundProjectionEnumerable;
	} ());
	
	/**
	* IntersectEnumerable
	* TODO build intersection array and return array enumerator
	*/
	var IntersectEnumerable = (function () {
		var IntersectEnumerator = function (source1, source2, comparator) {
			var self = this;
			self.source1 = source1;
			self.source2 = source2;
			if(_.isUndefined(comparator)){
				self.comparator = function (a, b) { 
					return _.isEqual(a, b);
				};
			} else {
				self.comparator = comparator;
			}
			//clear the collection of intersecting elements		
			self.both = [];		
			self.index = -1;
			//rebuild the intersecting elements collection
			for(var i = 0; i < self.source2.length; i++){
				var r = self.source2[i];
				var found = _.find(self.source1, function (x) { return self.comparator(x,r);});
				if(!_.isUndefined(found)){
					self.both.push(found);
				}
			}
		};
		
		IntersectEnumerator.prototype.current = function () {
			var self = this;
			if(self.index === -1){
				return window.missingVariable;
			}
			if(self.index > - 1 && self.index < self.both.length) {
				return self.both[self.index];
			}
			throw new Error("InvalidEnumeratorPosistion");
		};
		
		IntersectEnumerator.prototype.next = function () {
			var self = this;
			self.index += 1;
			return self.index > - 1 && self.index < self.both.length;
		};
		
		IntersectEnumerator.prototype.reset = function () {
			var self = this;
			self.index = -1;
		};
		
		IntersectEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		var IntersectEnumerable = function (source1, source2, comparer) {
			this.source1 = source1.distinct(comparer);
			this.source2 = source2.distinct(comparer);
			this.comparer = comparer;		
		};
		
		IntersectEnumerable.prototype.enumerator = function() {
			var self = this;
			return new IntersectEnumerator(self.source1.toArray(), self.source2.toArray(), self.comparer);
		};
		
		IntersectEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return IntersectEnumerable;
	} ());
	
	/**
	* ExceptEnumerable
	* TODO build diff array and return array enumerator
	*/
	var ExceptEnumerable = (function () {
		var ExceptEnumerator = function (source1, source2, comparator) {
			var self = this;
			self.source1 = source1;
			self.source2 = source2;
			if(_.isUndefined(comparator)){
				self.comparator = function (a, b) { 
					return _.isEqual(a, b);
				};
			} else {
				self.comparator = comparator;
			}
			//clear the collection of intersecting elements		
			self.diff = [];		
			self.index = -1;
			//rebuild the set difference elements collection
			for(var i = 0; i < self.source1.length; i++){
				var r = self.source1[i];
				var found = _.find(self.source2, function (x) { return self.comparator(x,r);});
				if(_.isUndefined(found)){
					self.diff.push(r);
				}
			}
		};
		
		ExceptEnumerator.prototype.current = function () {
			var self = this;
			if(self.index === -1){
				return window.missingVariable;
			}
			if(self.index > - 1 && self.index < self.diff.length) {
				return self.diff[self.index];
			}
			throw new Error("InvalidEnumeratorPosistion");
		};
		
		ExceptEnumerator.prototype.next = function () {
			var self = this;
			self.index += 1;
			return self.index > - 1 && self.index < self.diff.length;
		};
		
		ExceptEnumerator.prototype.reset = function () {
			var self = this;
			self.index = -1;
		};
		
		ExceptEnumerator.ensureImplements(netjs.collections.IEnumerator);
		
		var ExceptEnumerable = function (source1, source2, comparer) {
			this.source1 = source1.distinct(comparer);
			this.source2 = source2.distinct(comparer);
			this.comparer = comparer;
		};
		
		ExceptEnumerable.prototype.enumerator = function() {
			var self = this;
			return new ExceptEnumerator(self.source1.toArray(), self.source2.toArray(), self.comparer);
		};
		
		ExceptEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return ExceptEnumerable;
	} ());
	
	/**
	* ZipEnumerable
	*/
	var ZipEnumerable = (function () {
		var ZipEnumerable = function ZipEnumerable(source1, source2, resultSelector){
			this.source1 = source1.enumerator();
			this.source2 = source2.enumerator();
			this.resultSelector = resultSelector;
			this.resultSequence = [];
			//build the resultSequence
			while(this.source1.next() && this.source2.next()){
				var r = resultSelector(this.source1.current(), this.source2.current());
				this.resultSequence.push(r);
			}
		};
		
		ZipEnumerable.prototype.enumerator = function () {
			var self = this;
			return new netjs.collections.ArrayEnumerator(self.resultSequence);
		};
		
		ZipEnumerable.ensureImplements(netjs.collections.IEnumerable);
		
		return ZipEnumerable;
	} ());
	
	/**
	* ProjectionComparer
	*/
	var ProjectionComparer = function ProjectionComparer(keySelector, comparer) {
		var self = this;
		self.keySelector = keySelector;
		self.comparer = comparer || 
			function (a, b) { 
				if(typeof a === 'string') {
					return a.localeCompare(b);
				} else {
					return a - b;
				}
			};
		
		//this function is declared inside of the constructor to 
		//retain the definition of self in a closure since 
		//the function is passed to a closure where this is redefined
		self.compare = function (a, b) {
			var keyA, keyB;
			keyA = self.keySelector(a);
			keyB = self.keySelector(b);
			return self.comparer(keyA, keyB);
		};
	};
	
	/**
	* ReverseComparer
	*/
	var ReverseComparer = function ReverseComparer(forwardComparer) {
		var self = this;
		self.forwardComparer = forwardComparer;
		
		//this function is declared inside of the constructor to 
		//retain the definition of self in a closure since 
		//the function is passed to a closure where this is redefined
		self.compare = function (a, b) {
			return self.forwardComparer.compare(b, a);
		};
	};
	
	/**
	* CompoundComparer
	*/
	var CompoundComparer = function CompoundComparer(primaryComparer, secondaryComparer) {
		var self = this;
		self.primaryComparer = primaryComparer;
		self.secondaryComparer = secondaryComparer;
		
		//this function is declared inside of the constructor to 
		//retain the definition of self in a closure since 
		//the function is passed to a closure where this is redefined
		self.compare = function (a, b) {
			var primaryResult;
			primaryResult = self.primaryComparer.compare(a, b);
			if(primaryResult !== 0) {
				return primaryResult;
			}
			return self.secondaryComparer.compare(a, b);
		};
	};	
	
	/**
	* OrderedEnumerable
	*/
	var OrderedEnumerable = (function () {
		var OrderedEnumerable = function OrderedEnumerable(origEnum, comparer) {
			this.origEnum = origEnum;
			this.comparer = comparer;		
		};	
		
		OrderedEnumerable.prototype.createOrderedEnumerable = function (keySelector, comparer, desc) {
			var self = this, secondaryComparer;
			if(_.isUndefined(keySelector) || _.isNull(keySelector)){
				throw new TypeError('keySelector');
			}
			secondaryComparer = new ProjectionComparer(keySelector, comparer);
			if(desc) {
				secondaryComparer = new ReverseComparer(secondaryComparer);
			}
			return new OrderedEnumerable(self, 
				new CompoundComparer(self.comparer, secondaryComparer));
		};
		
		OrderedEnumerable.prototype.enumerator = function () {
			var self = this, buffer;
			// Perform the actual sorting here: basically load
			// self.origEnum into an array, and then use a stable
			// sort algorithm with self.comparer to compare
			// any two elements
			buffer = self.origEnum.toArray();
			buffer = buffer.sort(self.comparer.compare);
			return new netjs.collections.ArrayEnumerator(buffer);
		};
		
		OrderedEnumerable.prototype.thenBy = function (keySelector, comparer) {
			var self = this;
			return self.createOrderedEnumerable(keySelector, comparer, false);		
		};
		
		OrderedEnumerable.prototype.thenByDesc = function (keySelector, comparer) {
			var self = this;
			return self.createOrderedEnumerable(keySelector, comparer, true);
		};
		
		//broken due to declaration order, will fix on refactor to modules
		//OrderedEnumerable.ensureImplements(netjs.IOrderedEnumerable);
		
		return OrderedEnumerable;
	} ());
	
	/**
	* sequence of elements with a key
	* netjs.IGrouping = new netjs.Interface('IGrouping', ['getKey', 'getElements']);
	* netjs.IGrouping = netjs.Interface.extendInterface(netjs.IGrouping, netjs.collections.IEnumerable);
	*/
	var Grouping = (function () {
		//elements is IEnumerable
		var Grouping = function Grouping(key, elements) {
			if(_.isUndefined(key)){
				throw new TypeError('key was not defined');
			}
			if(_.isUndefined(elements)){
				throw new TypeError('elements was not defined');
			} else {
				netjs.Interface.ensureImplements(elements, netjs.collections.IEnumerable);
			}
			this.key = key;
			this.elements = elements;
		};
		
		Grouping.prototype.getKey = function () {
			var self = this;
			return self.key;
		};
		
		Grouping.prototype.getElements = function () {
			var self = this;
			return self.elements;
		};
		
		Grouping.prototype.enumerator = function () {
			var self = this;
			return self.elements.enumerator();
		};
		
		//Grouping.ensureImplements(netjs.IGrouping);
		
		return Grouping;	
	} ());
	
	/**
	* a sequence of IGrouping
	* netjs.ILookup = new netjs.Interface('ILookup', ['count', 'enumerableForKey', 'contains']);
	* netjs.ILookup = netjs.Interface.extendInterface(netjs.ILookup, netjs.collections.IEnumerable);
	*/
	var LookUp = (function () {
		
		var LookUp = function LookUp(equalityComparer) {
			this.keys = new netjs.collections.ext.ArrayList();
			this.map = new netjs.collections.Hashtable(equalityComparer);
		};
		
		/**
		* Add an element to the IGrouping based on key
		*/
		LookUp.prototype.add = function (key, element) {
			var self = this, list;
			//check if the grouping exists
			//in the map
			if(!self.map.contains(key)){
				list = new netjs.collections.ext.ArrayList();
				self.map.setItem(key, list);
				self.keys.add(key);
			} else {
				list = self.map.getItem(key);
			}
			list.add(element);
		};
		
		LookUp.prototype.count = function () {
			var self = this;
			return self.map.count();
		};		
		
		LookUp.prototype.getItem = function (key) {
			var self = this, list;
			if(self.map.contains(key)){
				list = self.map.getItem(key);
				var enumerable = list.select(function (x) { return x; });
				return netjs.Util.proxyForMethods(enumerable, netjs.collections.ext.IEnumerable.methods);
			} else {
				return new EmptyEnumerable();
			}
		};
		
		LookUp.prototype.contains = function (key) {
			var self = this;
			return self.map.contains(key);
		};
		
		LookUp.prototype.enumerator = function () {
			var self = this;
			return self.keys.select(function(key){
				return new Grouping(key, self.map.getItem(key));
			}).enumerator();
		};
		
		LookUp.ensureImplements(netjs.linq.ILookup);
		
		return LookUp;
	} ());

	var RepeatEnumerator = (function () {
		var RepeatEnumerator = function(element, count){
			var self = this, element, count;
			self.element = element;
			self.count = count;
			self.cnt = 0;
		};

		RepeatEnumerator.prototype.current = function () {
			var self = this;
			return self.element;
		};

		RepeatEnumerator.prototype.next = function () {
			var self = this;
			if(self.cnt < count){
				cnt++;
				return true;				
			} else {
				return false;
			}
		};

		RepeatEnumerator.prototype.reset = function () {
			var self = this;
			self.cnt = 0;
		};
	} ());
	
	//export the protected namespace
	return {
		EmptyEnumerable: EmptyEnumerable,
		ConcatenatedEnumerable: ConcatenatedEnumerable,
		RangeEnumerable: RangeEnumerable,
		ConditionalEnumerable: ConditionalEnumerable,
		DistinctEnumerable: DistinctEnumerable,
		ReverseEnumerable: ReverseEnumerable,
		ProjectionEnumerable: ProjectionEnumerable,
		IntersectEnumerable: IntersectEnumerable,
		ExceptEnumerable: ExceptEnumerable,
		ZipEnumerable: ZipEnumerable,
		OrderedEnumerable: OrderedEnumerable,
		ProjectionComparer: ProjectionComparer,
		ReverseComparer: ReverseComparer,
		LookUp: LookUp,
		CompoundProjectionEnumerable: CompoundProjectionEnumerable,
	};
}(_, netjs))));
netjs.collections.ext.ArrayList = (function (netjs) {
	'use strict'
	
	var ArrayList = function ArrayList() {
		var _args;

		/**
        * Call the parent constructor
        */
        _args = Array.prototype.slice.call(arguments);
        ArrayList._parent.constructor.apply(this, _args);

		if(!ArrayList._isBase){
			return netjs.Util.proxy(this);
		} else {
			return this;
		}
	};
	
	ArrayList.inheritsFrom(netjs.collections.ArrayList).isType('Ext.ArrayList');
	
	netjs.linq.Enumerable.makeEnumerable(ArrayList);
	
	ArrayList.ensureImplements(netjs.collections.IList, netjs.collections.ICollection, netjs.collections.IEnumerable, netjs.collections.ext.IEnumerable);
	
	return ArrayList;
} (netjs));