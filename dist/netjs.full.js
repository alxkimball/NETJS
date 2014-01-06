/**
 * netjs JavaScript Implementation of .NET's Linq to Objects v0.0.3
 * Copyright (c) 2014, Alex Kimball
 * Licensed: MIT, GPL
 * Date: 2014-01-06
 */
(function () {
	'use strict';
    /**
    * This is required for support of bind in browsers who do not fully
    * support the ECMA 5(JavaScript 1.8.5) standard, ie. Safari(a.k.a. Stupid safari)
    */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                //closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                FNop = function () { },
                fBound = function () {
                    return fToBind.apply(this instanceof FNop ? this : oThis || window, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            FNop.prototype = this.prototype;
            fBound.prototype = new FNop();
            return fBound;
        };
    }
} ());
var netjs = (function () {
	'use strict';
    
    //define the the netjs namespace root if not defined 
    var netjs = netjs || {};

    return netjs;
}());
netjs.Util = (function () {
	'use strict';

    /**
     * define the the netjs.Util if not defined
     */
    var util = netjs.Util || {};

    /**
     * Create a relatively unique base-16(0-ffffffff) id
     * @returns {string} The generated unique id
     */
	util.uid = function () {
        return Math.floor(Math.random() * 4294967296).toString(16);
    };

    /**
     * Determine if a string begins with a specified substring
     * TODO Move this to a String Util file
     */
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str, 0) === 0;
        };
    }

    /**
     * Create a proxy method
     * @param method The method
     * @param instance The context(this) in which to execute the method
     */
    util.proxyMethod = function (method, instance) {
        if (typeof method === 'function') {
            return method.bind(instance);
        } else
            throw 'Cannot proxy a non-method';
    };

    /**
     * Create a proxy object by removing functions or
     * properties that begin with chars in the prefix list.
     * @param instance The hard instance
     * @param prefixes The prefixes to exclude, Default list is ['_'](single underscore).
     * @returns {{}} A proxy object
     */
    util.proxy = function (instance, prefixes) {
        var pre = prefixes || ['_'],
			proxy = {},
			reserved = ['constructor', 'prototype'],
			prop,
            _isPre = function(prop, prefixes) {
                for (var i = 0; i < prefixes.length; i += 1) {
                    if (prop.startsWith(prefixes[i])) {
                        return true;
                    }
                }
                return false;
            },
			_makeProp = function (prop) {
				var pax = prop;
				Object.defineProperty(proxy, prop, {
					enumerable: true,
					configurable: false,
					get: function () {
						return instance[pax];
					},
					set: function (value) {
						instance[pax] = value;
					}
				});
			};
        for (prop in instance) {
            if (reserved.indexOf(prop) < 0) {
                if (!_isPre(prop, pre)) {
                    if (typeof instance[prop] === 'object') {
                        proxy[prop] = _proxy(instance[prop]);
                    } else if (typeof instance[prop] === 'function') {
                        proxy[prop] = util.proxyMethod(instance[prop], instance);
                    } else {
                        _makeProp(prop);
                    }
                }
            }
        }

        return proxy;
    };

    /**
     * Create a proxy object with ONLY the functions defined in the methods array.
     * @param instance The hard instance
     * @param methods The string array of method names for which to included in the proxy
     * @returns {{}} A proxy object
     */
    util.proxyForMethods = function (instance, methods) {
        var proxy = {},
			reserved = ['constructor', 'prototype'],
			prop;
        for (prop in instance) {
            if (reserved.indexOf(prop) < 0) {
                if (typeof instance[prop] === 'function') {
					if(methods && methods.length > 0){
						if(methods.indexOf(prop) > -1){
							proxy[prop] = util.proxyMethod(instance[prop], instance);
						}
					}
				}
            }
        }

        return proxy;
    };

    /**
     * Determine if an object is undefined
     * @param obj
     * @returns {boolean}
     */
    util.isUndefined = function(obj) {
        return (obj === undefined || typeof obj === 'undefined');
    };

    /**
     * Determine if an object is a function
     * @param func
     * @returns {boolean}
     */
    util.isFunction = function (func) {
        return util.isUndefined(func) ? false :  (typeof func === 'function' || func instanceof Function);
    };

    /**
     * Determine if an object is an object
     * @param obj
     * @returns {boolean}
     */
    util.isObject = function (obj) {
        return util.isUndefined(obj) ? false : (typeof obj === 'object' || obj instanceof Object);
    };

    /**
     * Determine if an object is a number
     * @param num
     * @returns {boolean}
     */
    util.isNumber = function (num) {
        return util.isUndefined(num) ? false : (typeof num === 'number' || num instanceof Number);
    };

    /**
     * Determine if an object is a boolean
     * @param bool
     * @returns {boolean}
     */
    util.isBoolean = function (bool) {
        return util.isUndefined(bool) ? false : (typeof bool === 'boolean' || bool instanceof Boolean);
    };

    /**
     * Determine if an object is a Date
     * @param date
     * @returns {boolean}
     */
    util.isDate = function (date) {
        return util.isUndefined(date) ? false : date instanceof Date;
    };

    /**
     * Determine if an object is a string
     * @param str
     * @returns {boolean}
     */
    util.isString = function (str) {
        return util.isUndefined(str) ? false : (typeof str === 'string' || str instanceof String);
    }

    return util;
} ());
netjs.Interface = (function(_) {
    'use strict';
	
	/**
    * Constructor that creates a new Interface object for checking a function implements the required methods.
    * @param objectName | String | the instance name of the Interface
    * @param methods | Array | methods that should be implemented by the relevant function
    */
    var Interface = function Interface(objectName, methods) {

        // Check that the right amount of arguments are provided
        if (arguments.length !== 2) {

            throw new Error("Interface constructor called with " + arguments.length + " arguments, but expected exactly 2.");

        }

        // Create the public properties
        this.name = objectName;

        this.methods = [];

        // Loop through provided arguments and add them to the 'methods' array
        for (var i = 0, len = methods.length; i < len; i++) {

            // Check the method name provided is written as a String
            if (typeof methods[i] !== 'string') {

                throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
            }

            // If all is as required then add the provided method name to the method array
            this.methods.push(methods[i]);

        }
    };

    /**
    * Adds a static method to the 'Interface' constructor
    * @param object | Object Literal | an object literal containing methods that should be implemented
    */
    Interface.ensureImplements = function (object) {

        // Check that the right amount of arguments are provided
        if (arguments.length < 2) {
            throw new Error("Interface.ensureImplements was called with " + arguments.length + "arguments, but expected at least 2.");

        }

        // Loop through provided arguments (notice the loop starts at the second argument)
        // We start with the second argument on purpose so we miss the data object (whose methods we are checking exist)
        for (var i = 1, len = arguments.length; i < len; i++) {

            // Check the object provided as an argument is an instance of the 'Interface' class
            var inter = arguments[i];
            if (inter.constructor !== Interface) {

                throw new Error("Interface.ensureImplements expects the second argument to be an instance of the 'Interface' constructor.");
            }

            // Otherwise if the provided argument IS an instance of the Interface class then

            // loop through provided arguments (object) and check they implement the required methods
            for (var j = 0, methodsLen = inter.methods.length; j < methodsLen; j++) {

                var method = inter.methods[j];

                // Check method name exists and that it is a function (e.g. test[getTheDate]) 

                // if false is returned from either check then throw an error
                if (!object[method] || typeof object[method] !== 'function') {

                    throw new Error("This Class does not implement the '" + inter.name + "' interface correctly. The method '" + method + "' was not found.");

                }
            }
        }
    };
	
	Interface.objectImplements = function (object) {
		try {
			Interface.ensureImplements.apply(this, arguments);
		} catch (e) {
			return false;
		}
		return true;
	};
	
	/**
    * Adds a static method to the 'Interface' constructor
	* Extend the targetInterface with the methods in the sourceInterfaces and return the composite interface
    * @param targetInterface | Object Literal | an interface containing methods that should be implemented
	* @param sourceInterfaces | Object Literal(s) | an interface containing methods that should be implemented in addition to the base
	* @returns the composite interface
    */
    Interface.extendInterface = function (targetInterface /* *sourceInterfaces */) {
        // Check that the right amount of arguments are provided
        if (arguments.length < 2) {
            throw new Error("Interface.extendInterface was called with " + arguments.length + "arguments, but expected at least 2.");
        }
		if(!_.isEqual(Interface, targetInterface.constructor )){
			throw new Error("InvalidArgument - targetInterface: targetInterface is not an Interface");
		}
		//create the composite interace
		for (var i = 1, len = arguments.length; i < len; i++) {
			if(!_.isEqual(Interface, arguments[i].constructor )){
				throw new Error("InvalidArgument - sourceInterface: sourceInterface is not an Interface");
			}
			var extMethods = arguments[i].methods;
			//create a list of unique method names
			targetInterface.methods = _.uniq(targetInterface.methods.concat(extMethods));
		}
		//return the composite interface
		return targetInterface;
	};
	
	return Interface;
}(_));

(function (netjs) {
	'use strict';
	/**
    * Adds a static method to the Function prototype
    */
	if (!Function.prototype.ensureImplements){
	
		Function.prototype.ensureImplements = function (/*Implemented Interface List*/) {
		
		// Check that the right amount of arguments are provided
        if (arguments.length < 1) {
            throw new Error("Function.ensureImplements was called with " + arguments.length + "arguments, but expected at least 1.");
        }

			// Loop through interface arguments.
			for (var i = 0, len = arguments.length; i < len; i++) {

				// Check the object provided as an argument is an instance of the 'Interface' class
				var inter = arguments[i];
				if (inter.constructor !== netjs.Interface) {

					throw new Error("Interface.ensureImplements expects the second argument to be an instance of the 'Interface' constructor.");
				}

				// Otherwise if the provided argument IS an instance of the Interface class then

				// loop through the _proto_ and check they implement the required methods
				for (var j = 0, methodsLen = inter.methods.length; j < methodsLen; j++) {

					var method = inter.methods[j];

					// Check method name exists and that it is a function (e.g. test[getTheDate]) 

					// if false is returned from either check then throw an error
					if (!this.prototype[method] || typeof this.prototype[method] !== 'function') {

						throw new Error("This Function's prototype does not implement the '" + inter.name + "' interface correctly. The method '" + method + "' was not found.");

					}
				}
			}
		};
	}
} (netjs));

netjs.IComparable = (function (netjs) {
	'use strict';
	
	/**
	* Compares the current instance with another object of the same type and returns an integer
	* that indicates whether the current instance precedes, follows, or occurs in the same
	* position in the sort order as the other object.
	*
	* Less than zero - The current instance precedes the object specified by the CompareTo method in the sort order.
	* Zero - This current instance occurs in the same position in the sort order as the object specified by the CompareTo method.
	* Greater than zero - This current instance follows the object specified by the CompareTo method in the sort order. 
	*/
	var IComparable = new netjs.Interface('IComparable', ['compareTo']);
	
	return IComparable;
} (netjs));
netjs.IDisposable = (function (netjs){
    'use strict';

    var IDisposable = new netjs.Interface('IDisposable', ['dispose']);

    return IDisposable;
}(netjs));

netjs.Abstract = (function () {
	'use strict';
    
    //define the the netjs.Abstract namespace if not defined 
    var abstractNS = netjs.Abstract || {};
	
	// A convenient function that can be used for any abstract method
	abstractNS.abstractMethod = function () { throw new Error("cannot invoke abstract method"); };

	return abstractNS;
}());
(function () {
    'use strict';
    Function.prototype.inheritsFrom = function (parent) {
        if (parent.constructor === Function) {
            //Normal Inheritance
            parent._isBase = true;
            this._isBase = false;
            var F = function () {
            };
            F.prototype = parent.prototype;
            this.prototype = new F();
            this.prototype.constructor = this;
            this._parent = parent.prototype;
        } else {
            //Pure Virtual Inheritance 
            this.prototype = parent;
            this.prototype.constructor = this;
            this.prototype._parent = parent;
        }
        return this; //always return this at end of function prototype extensions
    };
}());

(function () {
    'use strict';
    Function.prototype.isType = function (type) {
        var _type = type;
        if (typeof this.type === 'undefined') {
            //Public Read-Only Property for type
            Object.defineProperty(this.prototype, 'type', {
                enumerable: true,
                configurable: false,
                get: function () {
                    return _type;
                }
            });
        }
        return this; //always return this at end of function prototype extensions
    };
}());


/**
 * Requires netjs.util
 */
netjs.Class = (function (netjs) {
    'use strict';

    var Class = function Class() {
        var self = this, _args, _instanceToken;

        /**
         * Call the parent Constructor
         */
        _args = Array.prototype.slice.call(arguments);
        Class._parent.constructor.apply(this, _args);

        /**
         * Private instance variables and functions. These may only be accessed by the
         * functions of defined in this closure.
         */
        _instanceToken = netjs.Util.uid();
        //Public Read-Only Property for instanceToken
        if (typeof this.instanceToken === "undefined") {
            Object.defineProperty(this, 'instanceToken', {
                enumerable: true,
                configurable: false,
                get: function () {
                    return _instanceToken;
                }
            });
        }

        /**
         * Public instance variables and functions. Functions will be copied to
         * instance objects which is a memory hog. So if the method doesn't change
         * then you can use the prototype method to access the properties
         * of the this reference.
         */
        //this.prop = 'value';
        //this.func = function () {
        //    window.log(this.prop);
        //};
    };

    //define type, inheritance, and mixins
    Class.inheritsFrom(Object).isType('Class');

    /**
     * The instance methods of a class are defined as function-valued properties
     * of the prototype object. The methods defined here are inherited by all
     * instances and provide the shared behavior of the class. Note that JavaScript
     * instance methods must use the this keyword to access the instance fields.
     */
    Class.prototype.toString = function () {
        var self = this;
        return self.type;
    };


    /**
     * Determine if an object referentially equal to another object.
     */
    Class.prototype.equals = function (obj) {
        return this === obj;
    };

    /**
     * Indicates whether the current object is structurally equal to another object of the same type.
     */
    Object.defineProperty(Class.prototype, "isEqual", {
        enumerable: false,
        value: function (obj) {
            var p;
            if (this === obj) {
                return true;
            }

            // some checks for native types first

            // function and sring
            if (typeof(this) === "function" || typeof(this) === "string" || this instanceof String) {
                return this.toString() === obj.toString();
            }

            // number
            if (this instanceof Number || typeof(this) === "number") {
                if (obj instanceof Number || typeof(obj) === "number") {
                    return this.valueOf() === obj.valueOf();
                }
                return false;
            }

            // null.equals(null) and undefined.equals(undefined) do not inherit from the
            // Object.prototype so we can return false when they are passed as obj
            if (typeof(this) !== typeof(obj) || obj === null || typeof(obj) === "undefined") {
                return false;
            }

            function sort(o) {
                var result = {};

                if (typeof o !== "object") {
                    return o;
                }

                Object.keys(o).sort().forEach(function (key) {
                    result[key] = sort(o[key]);
                });

                return result;
            }

            if (typeof(this) === "object") {
                if (Array.isArray(this)) { // check on arrays
                    return JSON.stringify(this) === JSON.stringify(obj);
                } else { // anyway objects
                    for (p in this) {
                        if (typeof(this[p]) !== typeof(obj[p])) {
                            return false;
                        }
                        if ((this[p] === null) !== (obj[p] === null)) {
                            return false;
                        }
                        switch (typeof(this[p])) {
                            case 'undefined':
                                if (typeof(obj[p]) !== 'undefined') {
                                    return false;
                                }
                                break;
                            case 'object':
                                if (this[p] !== null
                                    && obj[p] !== null
                                    && (this[p].constructor.toString() !== obj[p].constructor.toString()
                                    || !this[p].equals(obj[p]))) {
                                    return false;
                                }
                                break;
                            case 'function':
                                if (this[p].toString() !== obj[p].toString()) {
                                    return false;
                                }
                                break;
                            default:
                                if (this[p] !== obj[p]) {
                                    return false;
                                }
                        }
                    }
                    ;

                }
            }

            // at least check them with JSON
            return JSON.stringify(sort(this)) === JSON.stringify(sort(obj));
        }
    });

    Class.prototype.getHashCode = function () {
        var self = this;
        return parseInt(self.instanceToken, 10);
    };

    /**
     * To override a prototype method simple declare method of the same name.
     * To override and use the parent class implementation use call or apply
     * passing the child class as the thisArg
     */
    //ChildofClass.prototype.toString = function() {
    //    return netjs.ChildofClass._parent.toString.call(this) + 'stuff';
    //};

    /**
     * Class fields (such as constants) and class methods are defined as
     * properties of the constructor. Note that class methods do not
     * generally use the this keyword: they operate only on their arguments.
     */
    //Class.func = function(parameters) {
    //};
    //Class.STATIC_VAL = 'some val';

    return Class;

}(netjs));
// This function creates a new enumerated type. The argument object specifies
// the names and values of each instance of the class. The return value
// is a constructor function that identifies the new class. Note, however
// that the constructor throws an exception: you can't use it to create new
// instances of the type. The returned constructor has properties that
// map the name of a value to the value itself, and also a values array,
// a foreach() iterator function
netjs.Enumeration = (function (_) {
    function enumeration(namesToValues) {
    // This is the dummy constructor function that will be the return value.
    var enumeration = function() { throw "Can't Instantiate Enumerations"; };
    // Enumerated values inherit from this object.
    var proto = enumeration.prototype = {
        constructor: enumeration, // Identify type
        toString: function() { return this.name; }, // Return name
        valueOf: function() { return this.value; }, // Return value
        toJSON: function() { return this.name; } // For serialization
    };
    enumeration.values = []; // An array of the enumerated value objects
    // Now create the instances of this new type.
    for(name in namesToValues) { // For each value
        var e = _.extend({},proto); // Create an object to represent it
        e.name = name; // Give it a name
        e.value = namesToValues[name]; // And a value
        enumeration[name] = e; // Make it a property of constructor
        enumeration.values.push(e); // And store in the values array
    }
    // A class method for iterating the instances of the class
    enumeration.foreach = function(f,c) {
        for(var i = 0; i < this.values.length; i++) f.call(c,this.values[i]);
    };
    // Return the constructor that identifies the new type
    return enumeration;
    };

    return enumeration;
} (_));
netjs.Exception = (function (netjs) {

    var Exception = function (message, innerException) {
        var _args;

        /**
         * Call the parent constructor
         */
        _args = Array.prototype.slice.call(arguments);
        Exception._parent.constructor.apply(this, _args);

        this._message = message;
        this._innerException = innerException;
        this._data = new netjs.collections.Hashtable();
        this._source = null;

        if(!Exception._isBase){
            return netjs.Util.proxy(this);
        } else {
            return this;
        }
    };

    Exception.inheritsFrom(netjs.Class).isType('Exception');

    Exception.prototype.getInnerException = function () {
        var self = this;
        return self._innerException;
    };

    Exception.prototype.getMessage = function () {
        var self = this;
        return self._message;
    };

    Exception.prototype.getData = function () {
        var self = this;
        return self._data;
    };

    Exception.prototype.getSource = function () {
        var self = this;
        return self._source;
    };

    Exception.prototype.setSource = function (source) {
        var self = this;
        self._source = source;
    };

    return Exception;

} (netjs));

netjs.ApplicationException = (function (netjs) {

    var ApplicationException = function (){};

    ApplicationException.inheritsFrom(netjs.Exception).isType('ApplicationException');

    return ApplicationException;

} (netjs));

netjs.SystemException = (function (netjs) {

    var SystemException = function (){};

    SystemException.inheritsFrom(netjs.Exception).isType('SystemException');

    return SystemException;

} (netjs));

netjs.NotImplementedException = (function (netjs) {

    var NotImplementedException = function (){};

    NotImplementedException.inheritsFrom(netjs.SystemException).isType('NotImplementedException');

    return NotImplementedException;

} (netjs));

netjs.InvalidOperationException = (function (netjs) {

    var InvalidOperationException = function (){};

    InvalidOperationException.inheritsFrom(netjs.SystemException).isType('InvalidOperationException');

    return InvalidOperationException;

} (netjs));

netjs.Util.IEventObserver = (function (netjs){
    'use strict';

    var IEventObserver = new netjs.Interface('IEventObserver', ['subscribe', 'unsubscribe', 'publish']);

    return IEventObserver;
}(netjs));
netjs.Util.Observer = (function ($, netjs) {
    'use strict';

    var o = $({});

    var Observer = function Observer() {
        var self = this, _args;

        /**
        * Call the parent Constructor
        */
        _args = Array.prototype.slice.call(arguments);
        Observer._parent.constructor.apply(this, _args);
    };

    Observer.inheritsFrom(netjs.Class).isType('Observer');

    /**
    * Public
    */
    Observer.prototype.subscribe = function (/*'some/topic', handle*/) {
        o.on.apply(o, Array.prototype.slice.call(arguments));
    };

    Observer.prototype.unsubscribe = function (/*'some/topic', handle*/) {
        o.off.apply(o, Array.prototype.slice.call(arguments));
    };

    Observer.prototype.publish = function (/*'some/topic', val0, val1, val3...*/) {
        if (arguments.length && arguments.length > 0) {
            o.trigger.apply(o, Array.prototype.slice.call(arguments));
        }
    };

    Observer.ensureImplements(netjs.Util.IEventObserver);
	
	return Observer;
	
} (jQuery, netjs));
netjs.Util.Bus = (function ($, netjs) {
    'use strict';

    var Bus = function Bus() {
        var self = this;

        /**
        * Call the parent Constructor
        */
        var _args = Array.prototype.slice.call(arguments);
        Bus._parent.constructor.apply(this, _args);

        /**
        * Private
        */
        //make doc_ready an Observer
        this.addObserver('doc_ready');

        //wire the doc_ready Observer
        $(document).ready(function () {
            self.doc_ready.publish('/document/ready');
        });
    };

    Bus.inheritsFrom(netjs.Class).isType('Bus');
	
	Bus.prototype.addObserver = function(observerName){
		var self = this;
		
		//create the observer object if it does not exist
		if(!self[observerName]){
			self[observerName] = new netjs.Util.Observer();
		}
	};
	
	return Bus;
	
} (jQuery, netjs));
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
		CompoundProjectionEnumerable: CompoundProjectionEnumerable
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