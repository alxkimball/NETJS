netjs.IComparable = (function (netjs) {
	'use strict';
	
	/**
	* Compares the current instance with another object of the same type and returns an integer
	* that indicates whether the current instance precedes, follows, or occurs in the same
	* position in the sort order as the other object.
	*
	* Less than zero - The current instance precedes the object specified by the CompareTo method in the sort order.
	* Zero - This current instance occurs in the same position in the sort order as the object specified by the CompareTo method.
	* Greater than zero - This current instance follows the object specified by the CompareTo method in the sort order. 
	*/
	var IComparable = new netjs.Interface('IComparable', ['compareTo']);
	
	return IComparable;
} (netjs));