/**
 * Requires PreReqs.js
 */
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
			resereved = ['constructor', 'prototype'],
			prop;
        for (prop in instance) {
            if (resereved.indexOf(prop) < 0) {
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

    return util;
} ());