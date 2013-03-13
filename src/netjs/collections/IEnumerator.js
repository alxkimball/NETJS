netjs.collections.IEnumerator = (function (netjs) {
	'use strict';
	/**
	* Intended behavior:
	* obj current()
	* bool next()
	* void reset()
	* 
	* After an enumerator is created or after the reset() method is called, the next() method must
	* be called to advance the enumerator to the first element of the collection before reading the
	* value of the current property; otherwise, current() is undefined.	current() also throws an 
	* exception if the last call to next returned false, which indicates the end of the collection.
	*
	* current does not move the position of the enumerator, and consecutive calls to current return 
	* the same object until either next or reset is called.
	*/
	var IEnumerator = new netjs.Interface('IEnumerator', ['current', 'next', 'reset']);
	
	return IEnumerator
} (netjs));