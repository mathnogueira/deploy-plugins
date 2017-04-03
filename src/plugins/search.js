const fs = require('fs');
const glob = require('glob');
const Plugin = require('../core/plugin');

class SearchPlugin extends Plugin {

	constructor() {
		super("Search", "1.0.0");
	}

	run(input, ignore) {
		this.buffer.out = glob.sync(input, {
			ignore: ignore
		});

		return super.run();
	}
}

module.exports = SearchPlugin;