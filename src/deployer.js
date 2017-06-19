const minimist = require('minimist');
const environmentReplaceDecorator = require('./core/config-replace-decorator');

function configureDeployer() {
	// Parse options
	let args = minimist(process.argv.slice(2));
	let tasks = args._;
	let environment = args.h || 'test';

	// Initialize
	Deployer.initialize(environment);
	let deployer = new Deployer();
	deployer.setExecutionPipeline(tasks);

	return deployer;
}

class Deployer {

	constructor() {
		this.tasks = {};
		Deployer.prototype.streamBuffer.container = this;
	}

	static initialize(env) {
		const plugins = require('konfig')({
			path: 'config/plugins/'
		});
		const environments = require('konfig')({
			path: 'config/environments/'
		});
		for (let pluginName in plugins) {
			if (!plugins.hasOwnProperty(pluginName)) continue;
			let Plugin = require(plugins[pluginName].path);
			let plugin = new Plugin();
			plugin.setBuffer(Deployer.prototype.streamBuffer);
			// Set decorator to replace all %ENV_Variables% in the args
			let pluginImpl = environmentReplaceDecorator(plugin.run.bind(plugin), environments[env]);
			Deployer.addPlugin(plugin.name, pluginImpl);
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
		let task = this.tasks[taskName];
		if (Array.isArray(task)) {
			// Task is a sequence of tasks, so execute each one of them
			this.executeSequence(task);
		} else {
			this.streamBuffer.in = {};
			this.streamBuffer.out = {};
			this.tasks[taskName](this);
		}
		return this;
	}

	executeSequence(sequence) {
		for (let task of sequence) {
			this.executeTask(task);
		}
	}

	setExecutionPipeline(sequence) {
		this.executionSequence = sequence;
	}

	setTargetEnvironment(env) {
		const environments = require('konfig')({
			path: 'config/'
		});
		this.envConfig = environments[env];
	}

	run() {
		for (let task of this.executeSequence) {
			this.executeTask(task);
		}
	}
}

Deployer.prototype.streamBuffer = {
	in: {},
	out: {}
};

module.exports = configureDeployer;