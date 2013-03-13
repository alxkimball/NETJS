netjs.collections.IEqualityComparer = (function (netjs) {
	'use strict';
	
	var IEqualityComparer = new netjs.Interface('IEqualityComparer',['equals', 'getHashCode']);
	
	return IEqualityComparer;
} (netjs));