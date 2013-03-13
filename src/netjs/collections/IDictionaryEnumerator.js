netjs.collections.IDictionaryEnumerator = (function (netjs) {
	'use strict';
	var IDictionaryEnumerator = new netjs.Interface('IDictionaryEnumerator', ['entry', 'key', 'value']);
	//IDictionaryEnumerator extends the IEnumerator interface
	IDictionaryEnumerator = netjs.Interface.extendInterface(IDictionaryEnumerator, netjs.collections.IEnumerator);
	
	return IDictionaryEnumerator
} (netjs));