netjs.collections.ArrayEnumerator = (function (netjs) {
	'use strict';
	
	var ArrayEnumerator = function ArrayEnumerator(source) {
		this.source = source;
		this.index = -1;
	};

	ArrayEnumerator.prototype.current = function () {
		var self = this;
		if(self.index === -1) {
			return window.missingVariable;
		} else if(self.index >= self.source.length) {
			throw new Error("InvalidEnumeratorPosistion");
		}
		return self.source[self.index];
	};
	
	ArrayEnumerator.prototype.next = function () {
		var self = this;
		self.index += 1;
		return (self.index > -1 && self.index < self.source.length);
	};
	
	ArrayEnumerator.prototype.reset = function () {
		var self = this;
		self.index = -1;
	};
	
	ArrayEnumerator.ensureImplements(netjs.collections.IEnumerator);
	
	return ArrayEnumerator;
} (netjs));