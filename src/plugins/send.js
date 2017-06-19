(function() {
	"use strict";

	const Plugin = require('../core/plugin');
	const eraseFile = require('../core/options/erase-file');
	const fs = require('fs-sync');

	class SendPlugin extends Plugin {

		constructor() {
			super("Send", "1.0.0");
		}

		run(destination, options) {
			options = options || {};
			let file = this.buffer.in;
			fs.copy(file, destination);
			this.buffer.out = destination;

			eraseFile(file, options);
			return super.run();
		}

	}

	module.exports = SendPlugin;

})();