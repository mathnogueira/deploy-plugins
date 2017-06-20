(function() {
	"use strict";

	const Plugin = require('../core/plugin');
	const fs = require('fs');

	class LogPlugin extends Plugin {

		constructor() {
			super("Log", "1.0.0");
		}

		run(filename) {
			let action = this.buffer.in + '\n';
			fs.appendFileSync(filename, action, 'utf8');
			this.buffer.out = this.buffer.in;

			return super.run();
		}
	}

	module.exports = LogPlugin;

})();