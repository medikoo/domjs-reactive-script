'use strict';

var global          = require('es5-ext/global')
  , Set             = require('es6-set')
  , ObservableSet   = require('observable-set')
  , ObservableValue = require('observable-value');

module.exports = function (t, a) {
	var o1, o2, o3, $;
	global.$ = $ = {};
	a.deep(t(), { src: 'undefined', setPaths: [], observables: [] });
	a.deep(t(null), { src: 'null', setPaths: [], observables: [] });
	a.deep(t(12.23), { src: '12.23', setPaths: [], observables: [] });
	a.deep(t('raz'), { src: '"raz"', setPaths: [], observables: [] });
	a.deep(t(false), { src: 'false', setPaths: [], observables: [] });
	a.deep(t(/raz/g), { src: '/raz/g', setPaths: [], observables: [] });
	a.deep(t(function (foo) { return 'bar'; }), { src: 'function (foo) { return \'bar\'; }',
		setPaths: [], observables: [] });
	a.deep(t(new Date(123456789)), { src: 'new Date(123456789)', setPaths: [], observables: [] });
	a.deep(t(new Set(['raz', 23])), { src: '$.setify(["raz",23])', setPaths: [[]], observables: [] });
	a.deep(t(['raz', 23]), { src: '["raz",23]', setPaths: [], observables: [] });
	a.deep(t({ foo: 'bar', dwa: 23 }),
		{ src: '{"foo":"bar","dwa":23}', setPaths: [], observables: [] });

	a.deep(t({ foo: 'bar', dwa: 23, trzy: {
		elok: o1 = new ObservableSet(['foo', true]),
		miszka: o2 = new ObservableValue({
			marko: 'raz',
			zagalo: o3 = new ObservableSet([{
				morda: /foo/g
			}])
		})
	} }), { src: '{"foo":"bar","dwa":23,"trzy":{"elok":$.setify(["foo",true]),"miszka":{"marko":' +
		'"raz","zagalo":$.setify([{"morda":/foo/g}])}}}',
		setPaths: [['trzy', 'elok'], ['trzy', 'miszka', 'zagalo']],
		observables: [o1, o2, o3] });

	$.foos = { foo: {}, bar: {} };
	$.setify = function (obj) { return obj; };
	a((new Function('return ' + t({ __id__: 'foo' }, 'foos').src))(), $.foos.foo);
	a.deep((new Function('return ' + t(new Set([{ __id__: 'foo' },
		{ __id__: 'bar' }]), 'foos').src))(), [$.foos.foo, $.foos.bar]);
	a.deep((new Function('return ' + t({ marko: new Set([{ __id__: 'foo' },
		{ __id__: 'bar' }]) }, { marko: 'foos' }).src))(), { marko: [$.foos.foo, $.foos.bar] });
	delete global.$;
};
