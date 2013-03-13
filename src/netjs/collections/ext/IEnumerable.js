netjs.collections.ext.IEnumerable = (function (netjs) {
	'use strict';
	var IEnumerable = new netjs.Interface('IEnumerable', ['aggregate', 'all', 'any', 'average',
	'concat', 'count', 'distinct', 'each', 'except', 'first', 'firstOrDefault', 'groupBy', 'intersect', 'join', 
	'last', 'lastOrDefault', 'max', 'min', 'orderBy', 'orderByDesc', 'reverse', 'select', 'selectMany', 
	'sequenceEqual', 'single', 'singleOrDefault', 'skip', 'skipWhile', 'sum', 'take', 'takeWhile', 'toArray',
	'toList', 'toLookup', 'union', 'where', 'zip']); 
	
	IEnumerable = netjs.Interface.extendInterface(IEnumerable, netjs.collections.IEnumerable);
	
	return IEnumerable;
} (netjs));