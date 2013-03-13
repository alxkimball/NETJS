(function () {
	'use strict';
	Function.prototype.mixin = function (mixin) {
        if (mixin && typeof mixin === "object") {
            var currMixins = this.prototype.mixins || [];
            currMixins.push(mixin._mixinType);
            _.extend(this.prototype, mixin);
            delete this.prototype._mixinType;
            this.prototype.mixins = currMixins || [];
        }
        return this; //always return this at end of function prototype extensions
    };
} ());

netjs.isMixin = (function () {
	'use strict';
	var isMixin = function (o, type) {
        var _mixinType = type;
        if (typeof o._mixinType === "undefined") {
            //Public Read-Only Property for type
            Object.defineProperty(o, '_mixinType', {
                enumerable: true,
                configurable: false,
                get: function () {
                    return _mixinType;
                }
            });
        }
        return o;
    };
	
	return isMixin;
} ());