netjs.collections.IList = (function (netjs) {
	'use strict';
	
	/**
	* insert - 
	* If index equals the number of items in the IList, then value is appended to the end.
	* In collections of contiguous elements, such as lists, the elements that follow the
	* insertion point move down to accommodate the new element. If the collection is indexed,
	* the indexes of the elements that are moved are also updated.
	*/
	
	/**
	* removeAt -
	* In collections of contiguous elements, such as lists, the elements that follow the 
	* removed element move up to occupy the vacated spot. If the collection is indexed,
	* the indexes of the elements that are moved are also updated. 
	*/
	var IList = new netjs.Interface('IList', ['add', 'clear', 'contains', 'getItem', 'indexOf', 'insert', 'remove', 'removeAt', 'setItem']);
	//IList extends ICollection, IEnumerable
	IList = netjs.Interface.extendInterface(IList, netjs.collections.ICollection, netjs.collections.IEnumerable);
	
	return IList;
} (netjs));