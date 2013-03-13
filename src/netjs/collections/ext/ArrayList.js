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