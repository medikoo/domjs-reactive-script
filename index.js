'use strict';

var defaultGlobal    = require('es5-ext/global')
  , validArray       = require('es5-ext/array/valid-array')
  , isFunction       = require('es5-ext/function/is-function')
  , toTokens         = require('es5-ext/function/#/to-string-tokens')
  , randomUniq       = require('es5-ext/string/random-uniq')
  , resolve          = require('./lib/resolve')
  , handleReactivity = require('./lib/handle-reactivity')
  , generate         = require('./lib/generate-source')

  , slice = Array.prototype.slice
  , trim = Function.prototype.call.bind(String.prototype.trim);

module.exports = function (domjs/*, options*/) {
	var script = domjs.ns.script, text = domjs.ns.text, options = Object(arguments[1])
	  , global = options.global || defaultGlobal;

	return (domjs.ns.script = function (fn/* …localVars, options*/) {
		var map, data, localVars, argNames, element, options, scriptId, srcTextNode, objMap;
		if (!isFunction(fn)) return script.apply(this, arguments);
		localVars = slice.call(arguments, 1);
		data = toTokens.call(fn);
		argNames = data.args.trim() ? data.args.split(',').map(trim) : [];
		if (argNames.length !== localVars.length) {
			if ((localVars.length - 1) === argNames.length) {
				options = Object(localVars.pop());
			} else {
				throw new TypeError("Script function signature doesn't match passed arguments count");
			}
		}
		if (options && (options.objMap !== undefined)) objMap = validArray(options.objMap);
		map = localVars.map(function (arg, index) { return resolve(arg, objMap && objMap[index]); });
		element = script.call(this);
		element.appendChild(srcTextNode = text());

		// Update in case of observable changes
		if (map.some(function (data) { return data.observables.length; })) {
			scriptId = 's' + randomUniq();
			handleReactivity(map, localVars, argNames, scriptId, data.body, srcTextNode, global, objMap);
		}
		srcTextNode.data = generate(map, argNames, data.body, scriptId);

		return element;
	});
};
