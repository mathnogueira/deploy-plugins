(function() {
	"use strict";
	
	function warn(message, options) {
		if (options.verbose) {
			console.warn('[WARNING]', message);
		}
	}

	module.exports = warn;

})();