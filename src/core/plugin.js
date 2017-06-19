(function() {
	"use strict";

	const Deployer = require('../deployer');

	class Plugin {

		constructor(name, version) {
			if (!name) throw "Your plugin must have a name!";
			if (!version) throw "Your plugin must have a version!";
			this.name = name;
			this.version = version;
		}

		run() {
			this.buffer.in = this.buffer.out;
			this.buffer.out = {};
			return this.buffer.container;
		}

		setBuffer(streamBuffer) {
			this.buffer = streamBuffer;
		}
	}

	module.exports = Plugin;

})();