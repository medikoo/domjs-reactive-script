'use strict';

var aFrom    = require('es5-ext/array/from')
  , diff     = require('es5-ext/array/#/diff')
  , once     = require('timers-ext/once')
  , resolve  = require('./resolve')
  , generate = require('./generate-source')

  , push = Array.prototype.push;

module.exports = function (map, localVars, argNames, scriptId, body, textNode, global) {
	var observables = [], update, legacyCallback
	  , assign = function (observable) { observable.on('change', update); }
	  , dismiss = function (observable) { observable.off('change', update); };

	global[scriptId] = function (fn) { legacyCallback = fn; };

	update = once(function () {
		var map = localVars.map(function (arg) { return resolve(arg); })
		  , nuObservables = [];

		// Update up to eventual observables list changes
		map.forEach(function (map) { push.apply(nuObservables, map.observables); });
		diff.call(observables, nuObservables).forEach(dismiss);
		diff.call(nuObservables, observables).forEach(assign);
		observables = nuObservables;

		// Update script source (for server generated pages)
		textNode.data = generate(map, argNames, body, scriptId);

		// Update objects in script functions (for proper SPA handling)
		legacyCallback.apply(null, map.map(function (map) {
			var arg = (new Function('\'use strict\'; return ' + map.src + ';'))();
			map.setPaths.forEach(function (path) {
				var obj, name;
				if (!path.length) {
					arg = $.setify(arg);
					return;
				}
				path = aFrom(path);
				obj = arg;
				name = path.pop();
				path.forEach(function (name) { obj = obj[name]; });
				obj[name] = $.setify(obj[name]);
			});
			return arg;
		}));
	});

	map.forEach(function (map) { push.apply(observables, map.observables); });
	observables.forEach(assign);
};
