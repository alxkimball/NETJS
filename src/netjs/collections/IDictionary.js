netjs.collections.IDictionary = (function (netjs) {
	'use strict';
	
	var IDictionary = new netjs.Interface('IDictionary', ['keys', 'values', 'getItem', 'setItem', 'add', 'clear', 'contains', 'remove']);
	//IDictionary extends ICollection, IEnumerable
	IDictionary = netjs.Interface.extendInterface(IDictionary, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return IDictionary;
} (netjs));