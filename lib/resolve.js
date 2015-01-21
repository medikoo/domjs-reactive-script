'use strict';

var aFrom             = require('es5-ext/array/from')
  , contains          = require('es5-ext/array/#/contains')
  , isDate            = require('es5-ext/date/is-date')
  , customError       = require('es5-ext/error/custom')
  , isFunction        = require('es5-ext/function/is-function')
  , isObject          = require('es5-ext/object/is-object')
  , isPlainObject     = require('es5-ext/object/is-plain-object')
  , serialize         = require('es5-ext/object/serialize')
  , toArray           = require('es5-ext/object/to-array')
  , isRegExp          = require('es5-ext/reg-exp/is-reg-exp')
  , isSet             = require('es6-set/is-set')
  , isObservableValue = require('observable-value/is-observable-value')
  , isObservable      = require('observable-value/is-observable')

  , isArray = Array.isArray, map = Array.prototype.map
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , stringify = JSON.stringify;

var Result = function () {
	this.setPaths = [];
	this.observables = [];
};

var process = function (value, result, ancestors, setPath, objMap) {
	var index, data;
	if (isObservableValue(value)) {
		result.observables.push(value);
		value = value.value;
	}
	if (!isObject(value)) return serialize(value);
	if (isDate(value)) return serialize(value);
	if (isRegExp(value)) return serialize(value);
	if (isFunction(value)) return serialize(value);
	if ((typeof objMap === 'string') && hasOwnProperty.call(value, '__id__')) {
		return '$[' + stringify(objMap) + '][' + stringify(value.__id__) + ']';
	}
	if (contains.call(ancestors, value)) {
		throw customError('Cannot handle recursive structure', 'RECURSIVE_STRUCTURE');
	}
	ancestors = aFrom(ancestors);
	ancestors.push(value);
	if (isArray(value)) {
		if (isObservable(value)) result.observables.push(value);
		// We invoke map indirectly to avoid memory leak in case of observables arrays
		return '[' + map.call(value, function (value, index) {
			return process(value, result, ancestors, setPath.concat(index),
				(typeof objMap === 'string') ? objMap : null);
		}) + ']';
	}
	if (isSet(value)) {
		if (isObservable(value)) result.observables.push(value);
		result.setPaths.push(setPath);
		index = 0;
		data = [];
		value.forEach(function (value) {
			data.push(process(value, result, ancestors, setPath.concat(index),
				(typeof objMap === 'string') ? objMap : null));
			++index;
		});
		return '$.setify([' + data + '])';
	}
	if (!isPlainObject(value)) {
		throw customError(value + ' cannot be serialized', 'NON_SERIALIZABLE_VALUE');
	}
	return '{' + toArray(value, function (value, name) {
		return stringify(name) + ':' + process(value, result, ancestors, setPath.concat(name),
			objMap && objMap[name]);
	}) + '}';
};

module.exports = function (value, objMap) {
	var result = new Result();
	result.src = process(value, result, [], [], objMap);
	return result;
};
