netjs.collections.ICollection = (function (netjs) {
	'use strict';
	
	var ICollection = new netjs.Interface('ICollection', ['copyTo', 'count']);
	//ICollection extends IEnumerable
	ICollection = netjs.Interface.extendInterface(ICollection, netjs.collections.IEnumerable);
	
	return ICollection;
	
} (netjs));