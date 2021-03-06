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