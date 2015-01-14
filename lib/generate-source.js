'use strict';

var flatten = require('es5-ext/array/#/flatten')

  , stringify = JSON.stringify;

module.exports = function (map, argNames, body, scriptId) {
	var src = '(function (' + argNames + ') {\'use strict\';\n';

	// Setify eventual sets
	src += flatten.call(map.map(function (data, index) {
		var argName = argNames[index];
		return data.setPaths.map(function (path) {
			var varName = argName +
				path.map(function (token) { return '[' + stringify(token) + ']'; }).join('');
			return varName + ' = $.setify(' + varName + ');\n';
		});
	})).join('');

	// In SPA Update on observable changes
	if (scriptId) {
		src += 'if (typeof ' + scriptId + ' === \'function\') ' + scriptId + '(' +
			'function () {' + argNames.map(function (name, index) {
				return name + ' = arguments[' + index + '];';
			}).join('') + '});\n';
	}
	src += body + '}(' + map.map(function (data) { return data.src; }) + '));';
	return src;
};
