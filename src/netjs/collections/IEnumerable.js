netjs.collections.IEnumerable = (function (netjs) {
	'use strict';
	
	var IEnumerable =  new netjs.Interface('IEnumerable', ['enumerator']);
	
	return IEnumerable;
} (netjs));