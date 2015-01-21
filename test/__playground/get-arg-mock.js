'use strict';

var ObservableSet   = require('observable-set')
  , ObservableValue = require('observable-value');

module.exports = function () {
	return { foo: 'bar', dwa: 23, trzy: {
		elok: new ObservableSet(['foo', true]),
		objects: new ObservableSet([{ __id__: 'foo' }, { __id__: 'bar' }]),
		objectValue: { __id__: 'miszka' },
		miszka: new ObservableValue({
			marko: 'raz',
			zagalo: new ObservableSet([{
				morda: /foo/g
			}])
		})
	} };
};
