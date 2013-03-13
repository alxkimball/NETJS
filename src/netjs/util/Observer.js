/**
 * jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL 
 */
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