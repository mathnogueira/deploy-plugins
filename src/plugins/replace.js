(function() {
	"use strict";

	const Plugin = require('../core/plugin');

	class ReplacePlugin extends Plugin {

		constructor() {
			super("Replace", "1.0.0");
		}

		run(pattern, replace) {
			let inputs = this.buffer.in;
			let output = inputs.map(input => input.replace(pattern, replace));
			this.buffer.out = output;

			return super.run();
		}
	}

	module.exports = ReplacePlugin;
})();