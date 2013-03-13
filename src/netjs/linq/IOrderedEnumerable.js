netjs.linq.IOrderedEnumerable = (function (netjs) {
	'use strict';
	var IOrderedEnumerable = new netjs.Interface('IOrderedEnumerable', ['createOrderedEnumerable', 'thenBy', 'thenByDesc']);
	IOrderedEnumerable = netjs.Interface.extendInterface(IOrderedEnumerable, netjs.collections.ext.IEnumerable);
	
	return IOrderedEnumerable;
} (netjs));