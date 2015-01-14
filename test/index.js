'use strict';

var global        = require('es5-ext/global')
  , clear         = require('es5-ext/array/#/clear')
  , ObservableSet = require('observable-set')
  , Domjs         = require('domjs')
  , argMock       = require('./__playground/arg-mock');

module.exports = function (t, a, d) {
	var domjs = new Domjs(document), script, sets = [];
	t(domjs);
	global.$ = {
		setify: function (obj) {
			sets.push(obj);
			return obj;
		}
	};

	script = domjs.ns.script(function (elo) {
		return elo;
	}, argMock);
	(new Function(script.firstChild.data))();
	a.deep(sets, [['foo', true], [{ morda: /foo/g }]]);
	clear.call(sets);
	argMock.trzy.miszka.value = { morda: new ObservableSet(['foo']) };
	setTimeout(function () {
		a.deep(sets, [['foo', true], ['foo']]);
		delete global.fooBar23;
		delete global.$;
		d();
	}, 10);
};
