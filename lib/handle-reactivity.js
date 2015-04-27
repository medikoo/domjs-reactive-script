'use strict';

var diff     = require('es5-ext/array/#/diff')
  , once     = require('timers-ext/once')
  , resolve  = require('./resolve')
  , generate = require('./generate-source')

  , push = Array.prototype.push;

module.exports = function (map, localVars, argNames, scriptId, body, textNode, global, objMap) {
	var observables = [], update, legacyCallback
	  , assign = function (observable) { observable.on('change', update); }
	  , dismiss = function (observable) { observable.off('change', update); };

	global[scriptId] = function (fn) { legacyCallback = fn; };

	update = once(function () {
		var map = localVars.map(function (arg, index) { return resolve(arg, objMap && objMap[index]); })
		  , nuObservables = [];

		// Update up to eventual observables list changes
		map.forEach(function (map) { push.apply(nuObservables, map.observables); });
		diff.call(observables, nuObservables).forEach(dismiss);
		diff.call(nuObservables, observables).forEach(assign);
		observables = nuObservables;

		// Update script source (for server generated pages)
		textNode.data = generate(map, argNames, body, scriptId);

		if (legacyCallback) {
			// Update objects in script functions (for proper SPA handling)
			legacyCallback.apply(null, map.map(function (map) {
				return (new Function('\'use strict\'; return ' + map.src + ';'))();
			}));
		}
	});

	map.forEach(function (map) { push.apply(observables, map.observables); });
	observables.forEach(assign);
};
