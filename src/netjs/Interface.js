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
