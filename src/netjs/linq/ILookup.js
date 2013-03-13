netjs.linq.ILookup = (function (netjs) {
	'use strict';
	//a sequence of IGrouping
	var ILookup = new netjs.Interface('ILookup', ['contains', 'count', 'getItem']);
	ILookup = netjs.Interface.extendInterface(ILookup, netjs.collections.IEnumerable);
	
	return ILookup;
} (netjs));