'use strict';

var global        = require('es5-ext/global')
  , clear         = require('es5-ext/array/#/clear')
  , ObservableSet = require('observable-set')
  , Domjs         = require('domjs')
  , argMock       = require('./__playground/get-arg-mock')();

module.exports = function (t) {
	var domjs = new Domjs(document), sets = [], objMap, foos;
	var $ = {
		setify: function (obj) {
			sets.push(obj);
			return obj;
		},
		foos: foos = { foo: {}, bar: {}, miszka: {} }
	};
	objMap = [{ trzy: { objects: 'foos', objectValue: 'foos' } }];
	t(domjs);
	return {
		"": function (a, d) {
			var script;

			global.$ = $;
			script = domjs.ns.script(function (elo) {
				return elo;
			}, argMock, { objMap: objMap });
			(new Function(script.firstChild.data))();
			a.deep(sets, [['foo', true], [foos.foo, foos.bar], [{ morda: /foo/g }]]);
			clear.call(sets);
			argMock.trzy.miszka.value = { morda: new ObservableSet(['foo']) };
			setTimeout(function () {
				a.deep(sets, [['foo', true], [foos.foo, foos.bar], ['foo']]);
				delete global.$;
				d();
			}, 10);
		},
		"No args": function (a) {
			var script;
			clear.call(sets);
			global.$ = $;
			script = domjs.ns.script(function () { return 'foo'; });
			(new Function(script.firstChild.data))();
			a.deep(sets, []);
			delete global.$;
		}
	};
};
