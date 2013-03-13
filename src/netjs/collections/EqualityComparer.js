netjs.collections.EqualityComparer = (function (_, netjs) {
	'use strict'
	var EqualityComparer = function () {};
		
		EqualityComparer.prototype.hashEquals = function (x, y) {
			var self = this;
			return self.getHashCode(x) === self.getHasCode(y);
		};
		
		EqualityComparer.prototype.equals = function (x, y) {
			var self = this;
			if(_.isObject(x)){
				if(!_.isUndefined(x.equals)){
					return x.equals(y);
				}
			}
			return _.isEqual(x, y);
		};
		
		EqualityComparer.prototype.getHashCode = function (x) {
			//default string hasher
			if(_.isString(x)){
				var sum = 0;
				for(var charIdx = 0; charIdx < x.length; ++charIdx){
					sum += x.charCodeAt(charIdx);
				}
				return sum;
			}
			
			//default number hasher
			if(_.isNumber(x)){
				return Math.round(x);
			}
			
			//default bool hasher
			if(_.isBoolean(x)){
				return x ? 1 : 0;
			}
			
			//default date hasher
			if(_.isDate(x)){
				return x.getTime();
			}
			
			//default object hasher
			if(_.isObject(x)){
				if(!_.isUndefined(x.getHashCode)) {
					return x.getHashCode();
				}
			}
			
			throw new Error('Cannot get hash code for object');
		};
		
		EqualityComparer.ensureImplements(netjs.collections.IEqualityComparer);
		
		var _default = new EqualityComparer();
	
		EqualityComparer.Default = _default;
		
		return EqualityComparer;
} (_, netjs));