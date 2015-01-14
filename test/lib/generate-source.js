'use strict';

var global  = require('es5-ext/global')
  , resolve = require('../../lib/resolve')
  , argMock = require('../__playground/arg-mock');

module.exports = function (t, a) {
	var scriptId = 'fooBar23', legacyCallback, map, src, elo, sets = [];
	global.fooBar23 = function (lc) { legacyCallback = lc; };
	global.$ = {
		setify: function (obj) {
			sets.push(obj);
			return obj;
		}
	};

	map = resolve(argMock);
	src = t([map], ['elo'], 'return elo;\n', scriptId);
	elo = (new Function('return ' + src))();
	a(typeof legacyCallback, 'function');
	a.deep(sets, [elo.trzy.elok, elo.trzy.miszka.zagalo]);
	delete global.fooBar23;
	delete global.$;
};
