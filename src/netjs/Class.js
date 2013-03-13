(function () {
	'use strict';
    Function.prototype.inheritsFrom = function (parent) {
        if (parent.constructor === Function) {
            //Normal Inheritance
            parent._isBase = true;
			this._isBase = false;
            var F = function () { };
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
} ());

(function () {
	'use strict';
	Function.prototype.isType = function (type) {
        var _type = type;
        if (typeof this.type === "undefined") {
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
} ());

netjs.Class = (function (_, netjs) {
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
	* Indicates whether the current object is equal to another object of the same type.
	*/
	Class.prototype.equals = function (other) {
		var self = this;
		return _.isEqual(self, other);
	};
	
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
	Class.equals = function (obj1, obj2) {
		return _.isEqual(obj1, obj2);
	}
	
	return Class;

} (_, netjs));