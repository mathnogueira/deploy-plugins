(function() {
	"use strict";

	const Plugin = require('../core/plugin');

	class PipePlugin extends Plugin {

		constructor() {
			super("Pipe", "1.0.0");
		}

		run(fn) {
			this.buffer.out = fn(this.buffer.in);
			return super.run();
		}
	}

	module.exports = PipePlugin;
})();