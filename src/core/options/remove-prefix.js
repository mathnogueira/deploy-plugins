(function() {
	"use strict";

	function removePrefix(filename, options) {
		let newFilename = filename;
		if (options.removePrefix) {
			newFilename = filename.replace(options.removePrefix, '');
		}

		return newFilename;
	}

	module.exports = removePrefix;

})();