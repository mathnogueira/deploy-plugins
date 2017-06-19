(function() {
	"use strict";

	const fs = require('fs');

	function eraseFile(filename, options) {
		if (options.eraseFile) {
			fs.unlinkSync(filename);
		}
	}

	module.exports = eraseFile;

})();