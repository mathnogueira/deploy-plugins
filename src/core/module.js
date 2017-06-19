var _ = require('lodash');

class Module {

	constructor() {
		this.plugins = [];
	}

	addPlugin(plugin) {
		this.plugins.push(plugin);
		return this;
	}

	getPluginByName(name) {
		return _.find(this.plugins, plugin => plugin.name === name);
	}
}

module.exports = Module;