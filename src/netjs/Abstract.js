netjs.Abstract = (function () {
	'use strict';
    
    //define the the netjs.Abstract namespace if not defined 
    var abstractNS = netjs.Abstract || {};
	
	// A convenient function that can be used for any abstract method
	abstractNS.abstractMethod = function () { throw new Error("cannot invoke abstract method"); };

	return abstractNS;
}());