'use strict';

var global        = require('es5-ext/global')
  , clear         = require('es5-ext/array/#/clear')
  , ObservableSet = require('observable-set')
  , Domjs         = require('domjs')
  , argMock       = require('./__playground/arg-mock');

module.exports = function (t) {
	var domjs = new Domjs(document), sets = [];
	var $ = {
		setify: function (obj) {
			sets.push(obj);
			return obj;
		}
	};
	t(domjs);
	return {
		"": function (a, d) {
			var script;

			global.$ = $;
			script = domjs.ns.script(function (elo) {
				return elo;
			}, argMock);
			(new Function(script.firstChild.data))();
			a.deep(sets, [['foo', true], [{ morda: /foo/g }]]);
			clear.call(sets);
			argMock.trzy.miszka.value = { morda: new ObservableSet(['foo']) };
			setTimeout(function () {
				a.deep(sets, [['foo', true], ['foo']]);
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
