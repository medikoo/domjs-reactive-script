'use strict';

var global        = require('es5-ext/global')
  , clear         = require('es5-ext/array/#/clear')
  , ObservableSet = require('observable-set')
  , resolve       = require('../../lib/resolve')
  , generate      = require('../../lib/generate-source')
  , argMock       = require('../__playground/get-arg-mock')();

module.exports = function (t, a, d) {
	var scriptId = 'fooBar23', map, sets = [], textNode, nuSet;
	global.$ = {
		setify: function (obj) {
			sets.push(obj);
			return obj;
		}
	};

	map = [resolve(argMock)];
	textNode = document.createTextNode();
	t(map, [argMock], ['elo'], scriptId, 'return elo;\n', textNode, global);
	(new Function('return ' + generate(map, ['elo'], 'return elo;\n', scriptId)))();
	argMock.trzy.miszka.value = { morda: nuSet = new ObservableSet(['foo']) };
	setTimeout(function () {
		a.deep(sets, [['foo', true], [{ morda: /foo/g }], ['foo', true], ['foo']]);
		clear.call(sets);
		nuSet.add('bar');
		setTimeout(function () {
			a.deep(sets, [['foo', true], ['foo', 'bar']]);
			delete global.fooBar23;
			delete global.$;
			d();
		}, 10);
	}, 10);
};
