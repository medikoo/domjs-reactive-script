'use strict';

var document;

try {
	document = new (require('jsdom/lib/jsdom/living').Document)();
} catch (ignore) {}

exports.context = document ? {
	document: document,
	setTimeout: setTimeout,
	clearTimeout: clearTimeout
} : {};
