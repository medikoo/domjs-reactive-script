'use strict';

var defaultGlobal    = require('es5-ext/global')
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
	  , global = options.global || defaultGlobal, scriptId, srcTextNode;

	return (domjs.ns.script = function (fn/* …localVars*/) {
		var map, data, localVars, argNames, element;
		if (!isFunction(fn)) return script.apply(this, arguments);
		localVars = slice.call(arguments, 1);
		data = toTokens.call(fn);
		argNames = data.args.trim() ? data.args.split(',').map(trim) : [];
		if (argNames.length !== localVars.length) {
			throw new TypeError("Script function signature doesn't match passed arguments count");
		}

		map = localVars.map(function (arg) { return resolve(arg); });
		element = script.call(this);
		element.appendChild(srcTextNode = text());

		// Update in case of observable changes
		if (map.some(function (data) { return data.observables.length; })) {
			scriptId = 's' + randomUniq();
			handleReactivity(map, localVars, argNames, scriptId, data.body, srcTextNode, global);
		}
		srcTextNode.data = generate(map, argNames, data.body, scriptId);

		return element;
	});
};
