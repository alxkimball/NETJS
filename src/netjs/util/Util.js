netjs.Util = (function ($) {
	'use strict';
	//define the the netjs.Util if not defined 
    var util = netjs.Util || {};
	
	var _uid, _proxy;
    _uid = function () {
        return Math.floor(Math.random() * 4294967296).toString(8);
    };

    util.uid = _uid;

    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str, 0) !== -1;
        };
    }

    _proxy = function (instance, prefixes) {
        /// <summary>
        /// Create a proxy object by removing functions or
        /// properties that begin with chars in the prefix list.
        /// Default list is ['_'](single underscore).
        /// </summary>
        /// <param name="instance">The hard instance</param>
        /// <param name="prefixes">The prefixes to exclude</param>
        /// <returns type="">A proxy object</returns>
        var pre = prefixes || ['_'],
			proxy = {},
			resereved = ['constructor', 'prototype'],
			prop,
			i,
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
            if (resereved.indexOf(prop) < 0) {
                for (i = 0; i < pre.length; i += 1) {
                    if (!prop.startsWith(pre[i])) {
                        if (typeof instance[prop] === 'object') {
                            proxy[prop] = _proxy(instance[prop]);
                        } else if (typeof instance[prop] === 'function') {
                            proxy[prop] = $.proxy(instance[prop], instance);
                        } else {
							_makeProp(prop);
						}
                    }
                }
            }
        }

        return proxy;
    };
	
	util.proxy = _proxy;
	
	var _proxyForMethods = function (instance, methods) {
        /// <summary>
        /// Create a proxy object with ONLY the functions defined in the methods array.
        /// </summary>
        /// <param name="instance">The hard instance</param>
        /// <param name="methods">The string array of method names for which to inculde in the proxy</param>
        /// <returns type="">A proxy object</returns>
        var proxy = {},
			resereved = ['constructor', 'prototype'],
			prop,
			i;
        for (prop in instance) {
            if (resereved.indexOf(prop) < 0) {
                if (typeof instance[prop] === 'function') {
					if(methods && methods.length > 0){
						if(methods.indexOf(prop) > -1){
							proxy[prop] = $.proxy(instance[prop], instance);
						}
					}
				}
            }
        }

        return proxy;
    };

    util.proxyForMethods = _proxyForMethods;

    return util;
} (jQuery));