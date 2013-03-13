netjs.linq.IGrouping = (function (netjs) {
	'use strict';
	//sequence of elements with a key
	var IGrouping = new netjs.Interface('IGrouping', ['getKey', 'getElements']);
	IGrouping = netjs.Interface.extendInterface(IGrouping, netjs.collections.ext.IEnumerable);
	
	return IGrouping;
} (netjs));