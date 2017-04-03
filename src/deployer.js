class Deployer {

	constructor() {
		this.tasks = {};
		Deployer.prototype.streamBuffer.container = this;
	}

	static initialize() {
		const plugins = require('konfig')({
			path: 'config/plugins/'
		});
		for (let pluginName in plugins) {
			if (plugins[pluginName].enabled) {
				let Plugin = require(plugins[pluginName].path);
				let plugin = new Plugin();
				plugin.setBuffer(Deployer.prototype.streamBuffer);
				Deployer.addPlugin(plugin.name, plugin.run.bind(plugin));
			}
		}
	}

	static addPlugin(pluginName, fn) {
		let self = this;
		pluginName = pluginName[0].toLowerCase() + pluginName.substring(1);
		Deployer.prototype[pluginName] = fn;
	}

	task(taskName, callback) {
		this.tasks[taskName] = callback;
		return this;
	}

	executeTask(taskName) {
		if (!this.tasks[taskName])
			throw `Task ${taskName} was not found!`;
		this.tasks[taskName](this);
		return this;
	}
}

Deployer.prototype.streamBuffer = {
	in: {},
	out: {},
};

module.exports = Deployer;