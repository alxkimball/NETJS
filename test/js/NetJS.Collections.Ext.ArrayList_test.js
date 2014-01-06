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

	var _size = 10; //min 10
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

                Point.prototype.equals = function (point) {
                    var self = this;
                    return netjs.Class.prototype.isEqual.call(self, point);
                };
				
				return Point;
			} ());
			
    module('netjs.collection.ext.ArrayList', {		
        setup: function () {
			var self = this;
            self.list = new netjs.collections.ext.ArrayList();			
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
	
	test('can perform an aggregate query', function () {        
        var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggSum = this.list.aggregate(aggFunc);
		equal(aggSum, _size - 1, 'List with elements aggregated successfully.');
		aggSum = this.list.aggregate(aggFunc, 3);
		equal(aggSum, _size + 3, 'List with elements and initial seed value aggregated successfully.');
		this.list.clear();
		aggSum = this.list.aggregate(aggFunc);
		equal(aggSum, window.missingVariable, 'List without elements aggregated successfully.');
    });
	
	test('can query average', function () {
		var transform = function(element){
			return element.y;
		};
		var sum = this.list.sum(transform);
		var count = this.list.count();
		var expectedAvg = sum / count;
		var actualAvg = this.list.average(transform);
		equal(expectedAvg, actualAvg, 'List with elements averaged successfully.');
	});
	
	test('can query all', function () {        
        var condition = function (element) {
			return element.y === Math.pow(element.x, 2) + element.x + 1;
		};
		var allGood = this.list.all(condition);
		equal(allGood, true, 'List.all() returned the correct value.');
		this.list.clear();
		allGood = this.list.all(condition);
		equal(allGood, false, 'List.all() on an empty list returned the correct value.');
    });
	
	test('can query any', function () {        
        equal(this.list.any(), true, 'List.any() returned true.');
    });
	
	test('can concatentate lists', function () {
		var cat = this.list.concat(this.list);
		equal(cat.count(), _size * 2, 'List.concat returned return the correct sized list.');
		var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggSum = cat.aggregate(aggFunc);
		equal(aggSum, (_size * 2) -1, 'concatenated List with elements aggregated successfully.');
	});
	
	test('can query count', function () {        
        equal(this.list.count(), _size, 'List.count() returned the correct count.');
    });
	
	test('can query first', function () {
		var first = this.list.first();
		//reference equals
		equal(first, this.list.getItem(0), 'List.first() returned the reference to the correct element.');
		//deep equal
		var deepEqual = _.isEqual(first, this.list.getItem(0));
		equal(deepEqual, true, 'List.first() returned the correct element.');
    });
	
	test('can query last', function () {
		var last = this.list.last();
		//reference equals
		equal(last, this.list.getItem(_size - 1), 'List.last() returned the reference to the correct element.');
		//deep equal
		var deepEqual = _.isEqual(last, this.list.getItem(_size - 1));
		equal(deepEqual, true, 'List.last() returned the correct element.');
    });
	
	test('can take elements from the begining of the list', function () {
		//take the first three elements
		var take = this.list.take(3);
		equal(take.count(), 3, 'List.take(n) returned n elements.');
		var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggSum = take.aggregate(aggFunc);
		equal(aggSum, 2, 'List.take(n) with elements returned the first n elements.');
    });
	
	test('can take elements from the begining of the list conditionally', function () {
		//take the first three elements conditionally
		var take = this.list.takeWhile(function(element){ return element.id < 3});
		equal(take.count(), 3, 'List.take(n) returned n elements.');
		var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggSum = take.aggregate(aggFunc);
		equal(aggSum, 2, 'List.take(n) with elements returned the first n elements.');
    });
	
	test('can skip a certain number of elements', function () {
		//skip the first three elements
		var skip = this.list.skip(3);
		equal(skip.count(), _size - 3, 'List.skip(n) returned count - n elements.');
		var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggSum = skip.aggregate(aggFunc);
		equal(aggSum, _size - 4, 'List.take(n) with elements returned the first n elements.');
    });
	
	test('can skip a certain number of elements conditionally', function () {
		//skip the first three elements conditionally
		var skip = this.list.skipWhile(function(element){ 
			return element.id < 3;
		});
		equal(skip.count(), _size - 3, 'List.skip(n) returned count - n elements.');
		var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggSum = skip.aggregate(aggFunc);
		equal(aggSum, _size - 4, 'List.take(n) with elements returned the first n elements.');
    });
	
	test('can do where query on List', function () {
		var evenQuery = function (element) {
			return element.id % 2 === 0;
		};
		var evenElements = this.list.where(evenQuery);
		equal(evenElements.count(), Math.round(_size / 2), 'List.where returned the correct number of elements.');
		var aggFunc = function (element, currentSum) {
			if(_.isUndefined(currentSum)){
				currentSum = 0;
			} else {
				currentSum += 1;
			}
			return currentSum;
		};
		var aggVal = this.list.where(evenQuery).aggregate(aggFunc);
		equal(aggVal, Math.round((_size / 2) - 1), 'List.where returned the correct elements.');
    });
	
	test('can get distinct elements of a List', function () {
		var list = new netjs.collections.ext.ArrayList([1, 2, 2, 3, 4, 5, 5, 6, 7, 7, 7, 8, 9]);
		var dstnct = list.distinct().toArray();
		equal(dstnct.length, 9, 'List.distinct returned the correct number of elements.');
		var comp = _.isEqual(dstnct, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
		equal(comp, true, 'List.distinct returned the correct elements.');
		//TODO test the override passing the comparater
	});
	
	test('can get reverse the order of a List', function () {
		var list = new netjs.collections.ext.ArrayList(['a','p','p','l','e']);
		var reverse = list.reverse().toArray();
		var comp = _.isEqual(reverse, ['e','l','p','p','a']);
		equal(comp, true, 'List.reverse returned the correct elements.');
	});
	
	test('can do select projection of a List', function () {
		var projection = this.list.take(10).select(function(x) { return x.id;}).toArray();
		var comp = _.isEqual(projection, [0,1,2,3,4,5,6,7,8,9]);
		equal(comp, true, 'List.select returned the correct elements.');
	});
	
	test('can do select projection and flatten(selectMany) of a List', function () {
		var list2 = new netjs.collections.ext.ArrayList([{a:"bob", b:["bob jr", "joe bob"]}, {a:"sally", b:["sally jr", "sally joe"]}, {a:"frank", b:["frank jr"]}]);
		var project = function(x) {
			return x.b;
		};
		var flatten = function (x, y){
			return y;
		}
		var selectMany = list2.selectMany(project, flatten).toArray();
		var comp = _.isEqual(selectMany, ["bob jr", "joe bob", "sally jr", "sally joe", "frank jr"]);
		equal(comp, true, 'List.select returned the correct elements.');
	});
	
	test('can do a union of two Lists', function () {
		var list1 = new netjs.collections.ext.ArrayList([5, 3, 9, 7, 5, 9, 3, 7]);
		var list2 = new netjs.collections.ext.ArrayList([8, 3, 6, 4, 4, 9, 1, 0]);
		var uni = list1.union(list2).toArray();
		var comp = _.isEqual(uni, [5, 3, 9, 7, 8, 6, 4, 1, 0]);
		equal(comp, true, 'List.union returned the correct elements.');
	});
	
	test('can do a intersect of two Lists', function () {
		var list1 = new netjs.collections.ext.ArrayList([5, 3, 9, 7, 5, 9, 3, 7]);
		var list2 = new netjs.collections.ext.ArrayList([8, 3, 6, 4, 4, 9, 1, 0]);
		var uni = list1.intersect(list2).toArray();
		var comp = _.isEqual(uni, [3, 9]);
		equal(comp, true, 'List.intersect returned the correct elements.');
	});
	
	test('can do a set difference(except) of two Lists', function () {
		var list1 = new netjs.collections.ext.ArrayList([5, 3, 9, 7, 5, 9, 3, 7]);
		var list2 = new netjs.collections.ext.ArrayList([8, 3, 6, 4, 4, 9, 1, 0]);
		var uni = list1.except(list2).toArray();
		var comp = _.isEqual(uni, [5, 7]);
		equal(comp, true, 'List.except returned the correct elements.');
	});
	
	test('can zip two Lists', function () {
		var list1 = new netjs.collections.ext.ArrayList([5, 3, 9, 7, 5, 9, 3, 7]);
		var list2 = new netjs.collections.ext.ArrayList([8, 3, 6, 4, 4, 9, 1, 0]);
		var uni = list1.zip(list2, 
			function(x, y){ 
				return x + y;
			}).toArray();
		var comp = _.isEqual(uni, [13, 6, 15, 11, 9, 18, 4, 7]);
		equal(comp, true, 'List.zip returned the correct elements.');
	});
	
	test('can determine if two lists are equal', function () {
		var list1 = new netjs.collections.ext.ArrayList([1,2,3,4,5]);
		var list2 = new netjs.collections.ext.ArrayList([1,2,3,4,5]);
		var comp = list1.sequenceEqual(list2);		
		equal(comp, true, 'List.sequenceEqual returned the correct evaluation for equal lists.');
		list2 = new netjs.collections.ext.ArrayList([1,2,3,5,4]);
		comp = list1.sequenceEqual(list2);
		equal(comp, false, 'List.sequenceEqual returned the correct evaluation for unequal lists.');
	});
	
	test('can order a List ascending', function () {
		var list2 = new netjs.collections.ext.ArrayList([8, 3, 6, 4, 4, 9, 1, 0]);
		var orderedList = list2.orderBy(function (x) {return x;}).toArray();
		var comp = _.isEqual(orderedList, [0, 1, 3, 4, 4, 6, 8, 9]);
		equal(comp, true, 'List.orderBy returned the correct elements.');
	});
	
	test('can order a List descending', function () {
		var list2 = new netjs.collections.ext.ArrayList([8, 3, 6, 4, 4, 9, 1, 0]);
		var orderedList = list2.orderByDesc(function (x) {return x;}).toArray();
		var comp = _.isEqual(orderedList, [9, 8, 6, 4, 4, 3, 1, 0]);
		equal(comp, true, 'List.orderByDesc returned the correct elements.');
	});
	
	test('can chain(thenBy) order a List ascending', function () {
		var list2 = new netjs.collections.ext.ArrayList([{a:"bob", b:7}, {a:"sally", b:5}, {a:"frank", b:5}]);
		var x_b = function x_b (x) {
			return x.b;
		};
		var x_a = function x_a (x) { 
			return x.a;};
		var orderedList = list2.orderBy(x_b).thenBy(x_a).toArray();
		var comp = _.isEqual(orderedList, [{a:"frank", b:5}, {a:"sally", b:5}, {a:"bob", b:7}]);
		equal(comp, true, 'List.orderBy.thenBy returned the correct elements.');
	});
	
	test('can chain(thenByDesc) order a List descending', function () {
		var list2 = new netjs.collections.ext.ArrayList([{a:"bob", b:7}, {a:"sally", b:5}, {a:"frank", b:5}]);
		var x_b = function x_b (x) {
			return x.b;
		};
		var x_a = function x_a (x) { 
			return x.a;};
		var orderedList = list2.orderBy(x_b).thenByDesc(x_a).toArray();
		var comp = _.isEqual(orderedList, [{a:"sally", b:5}, {a:"frank", b:5}, {a:"bob", b:7}]);
		equal(comp, true, 'List.orderBy.thenBy returned the correct elements.');
	});
	
	test('can get a LookUp from a List', function () {
		var list2 = new netjs.collections.ext.ArrayList([{a:"bob", b:"phillips"}, 
		{a:"sally", b:"cavenaugh"}, {a:"frank", b:"phillips"}, {a:"jessie", b:"cavenaugh"}]);
		var x_b = function x_b (x) {
			return x.b;
		};
		var x_a = function x_a (x) { 
			return x.a;};
		var lookUp = list2.toLookup(x_b, x_a);
		var phillipsFamily = lookUp.getItem("phillips").toArray();
		var cavenaughFamily = lookUp.getItem("cavenaugh").toArray();
		var comp = _.isEqual(phillipsFamily, ["bob","frank"]);
		equal(comp, true, 'List.toLookup returned the correct elements.');
		comp = _.isEqual(cavenaughFamily, ["sally","jessie"]);
		equal(comp, true, 'List.toLookup returned the correct elements.');
	});
	
	test('can join two Lists', function () {
		var list2 = new netjs.collections.ext.ArrayList([{a:"bob", b:7}, {a:"sally", b:5}, {a:"frank", b:5}]);
		var list3 = new netjs.collections.ext.ArrayList([{c:"bob", d:["a", "b"]}, {c:"bob", d:["c", "d"]}, {c:"frank", d:["e", "f"]}]);
		
		//select list2.a + ":" + list3.d.toString() from list2 join list3 on list2.a === list2.c
		var from2 = function from2(x) { return x.a; }
		var from3 = function from3(y) { return y.c; }
		var select = function select(x, y) { return x.a + ":" + y.d;}
		var joinResult = list2.join(list3, from2, from3, select).toArray();
		var comp = _.isEqual(joinResult, ["bob:a,b", "bob:c,d", "frank:e,f"]);
		equal(comp, true, 'List.Join returned the correct result.');
	});
	
	test('can group items in a List', function () {
		var list2 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there", "four"]);
		var keySelector = function keySelector(x) {
			return x.length;
		};
		var elemSelector = function elemSelector(x) {
			return x[0];
		};
		var resultSelector = function resultSelector(key, values) {
			var vals = "", enumerator;
			if(!_.isUndefined(values)){
				enumerator = values.enumerator();
				while(enumerator.next()){
					vals += enumerator.current()+",";
				}
			}
			return key + ":" + vals;
		};
		var groups = list2.groupBy(keySelector, elemSelector, resultSelector).toArray();
		var comp = _.isEqual(groups, ["3:a,d,","5:h,t,","4:f,"]);
		equal(comp, true, 'List.groupBy returned the correct grouping');
	});
	
	test('can convert a collection to an IList', function () {
		var list2 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there", "four"]);
		var collection = list2.select(function (elem){
			return elem.substring(0, 1);
		}).toList();
		var doesImplement = netjs.Interface.objectImplements(collection, netjs.collections.IList);
		equal(doesImplement, true, 'toList returned a proper IList');
	});
	
	test('can test if two lists are equal', function () {
		var list2 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there", "four"]);
		var list3 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there", "four"]);
		var list4 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "four", "there"]);
		var list5 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there"]);
		equal(list2.sequenceEqual(list3), true, 'sequenceEqual correctly compared two equal lists');
		equal(list2.sequenceEqual(list4), false, 'sequenceEqual correctly compared two non equal lists');
		equal(list2.sequenceEqual(list5), false, 'sequenceEqual correctly compared two non equal lists');
	});
	
	test('can do single operations on a list', function () {
		var list2 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there", "four"]);
		var list3 = new netjs.collections.ext.ArrayList(["abc"]);
		raises(function () {
			list2.single();
		}, 'single on non single list throws an exception');
		equal(list3.single(), 'abc', 'single on single element list returns the only element in the list');
		equal(list3.single(
			function (element) {
				return _.isEqual(element, 'abc');
			}
		), 'abc', 'single w/ predicate on multi element list returns the element that satisfies the predicate from the list');
		equal(list3.singleOrDefault(
			function (element) {
				return _.isEqual(element, 'non');
			}
		), null, 'singleOrDefault w/ predicate on multi element list returns null');
	});
	
	test('can test if a list contains an element', function () {
		var list2 = new netjs.collections.ext.ArrayList(["abc", "hello", "def", "there", "four"]);
		equal(list2.contains('hello'), true, 'contains returns true if a list contains the specified element');
		equal(list2.contains('goodBye'), false, 'contains returns false if a list does not contain the specified element');
	});
	
	test('can produce a range of integers', function () {
		var squares = netjs.linq.Enumerable.range(1, 10).select(function(x){ return x*x;}).toArray();
		var comp = _.isEqual(squares, [1,4,9,16,25,36, 49,64,81,100]);
		equal(comp, true, 'range produced the correct sequence of integers');
	});
	
} (jQuery, netjs));
