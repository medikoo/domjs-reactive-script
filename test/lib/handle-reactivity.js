'use strict';

var global        = require('es5-ext/global')
  , clear         = require('es5-ext/array/#/clear')
  , ObservableSet = require('observable-set')
  , resolve       = require('../../lib/resolve')
  , generate      = require('../../lib/generate-source')
  , argMock       = require('../__playground/get-arg-mock')();

module.exports = function (t, a, d) {
	var scriptId = 'fooBar23', map, sets = [], textNode, nuSet, objMap, foos;
	global.$ = {
		setify: function (obj) {
			sets.push(obj);
			return obj;
		},
		foos: foos = { foo: {}, bar: {}, miszka: {} }
	};

	objMap = [{ trzy: { objects: 'foos', objectValue: 'foos' } }];
	map = [resolve(argMock, objMap[0])];
	textNode = document.createTextNode();
	t(map, [argMock], ['elo'], scriptId, 'return elo;\n', textNode, global, objMap);
	(new Function('return ' + generate(map, ['elo'], 'return elo;\n', scriptId)))();
	a.deep(sets, [['foo', true], [foos.foo, foos.bar],
		[{ morda: /foo/g }]]);
	clear.call(sets);
	argMock.trzy.miszka.value = { morda: nuSet = new ObservableSet(['foo']) };
	setTimeout(function () {
		a.deep(sets, [['foo', true], [foos.foo, foos.bar], ['foo']]);
		clear.call(sets);
		nuSet.add('bar');
		setTimeout(function () {
			a.deep(sets, [['foo', true], [foos.foo, foos.bar], ['foo', 'bar']]);
			delete global.fooBar23;
			delete global.$;
			d();
		}, 10);
	}, 10);
};
