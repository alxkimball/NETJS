netjs.collections.DictionaryEntry = (function (netjs) {
	'use strict';
	
	var DictionaryEntry = function DictionaryEntry(key, value) {
		this.key = key;
		this.value = value;
	};
	
	DictionaryEntry.prototype.key = function () {
		var self = this;
		return self.key;
	};
	
	DictionaryEntry.prototype.value = function () {
		var self = this;
		return self.value;
	};
	
	return DictionaryEntry;	
} (netjs));