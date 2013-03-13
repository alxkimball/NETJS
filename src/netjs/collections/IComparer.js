netjs.collections.IComparer = (function (netjs) {
	'use strict';
	
	var IComparer = new netjs.Interface('IComparer', ['compare']);
	
	return IComparer;
} (netjs));