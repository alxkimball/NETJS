netjs.Util.Bus = (function ($, netjs) {
    'use strict';

    var Bus = function Bus() {
        var self = this;

        /**
        * Call the parent Constructor
        */
        var _args = Array.prototype.slice.call(arguments);
        Bus._parent.constructor.apply(this, _args);

        /**
        * Private
        */
        //make doc_ready an Observer
        this.addObserver('doc_ready');

        //wire the doc_ready Observer
        $(document).ready(function () {
            self.doc_ready.publish('/document/ready');
        });
    };

    Bus.inheritsFrom(netjs.Class).isType('Bus');
	
	Bus.prototype.addObserver = function(observerName){
		var self = this;
		
		//create the observer object if it does not exist
		if(!self[observerName]){
			self[observerName] = new netjs.Util.Observer();
		}
	};
	
	return Bus;
	
} (jQuery, netjs));