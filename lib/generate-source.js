'use strict';

module.exports = function (map, argNames, body, scriptId) {
	var src = '(function (' + argNames + ') {\'use strict\';\n';

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
