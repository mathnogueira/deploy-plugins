(function() {
	"use strict";
	
	const minimist = require('minimist');
	const environmentReplaceDecorator = require('./core/config-replace-decorator');
	const konfig = require('konfig');

	// Async lock to turn async operations into sync
	global.asyncLock = {
		locked: false
	};

	/**
	 * Create and configura an instance of the deployer. It will load the initial
	 * configuration and pass it to the deployer instance, so it can make all
	 * needed replacements before running the plugins.
	 * 
	 * @author Matheus Nogueira
	 */
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

	/**
	 * Main class of this package. This class is responsible for managing all installed plugins,
	 * to do all needed transformations before running any plugin and handle the execution order.
	 * 
	 * It also handles the in/out buffer that is going to be passed to the plugins during task execution.
	 * 
	 * @author Matheus Nogueira
	 */
	class Deployer {

		/**
		 * Create a new deployer instance with no tasks registered.
		 */
		constructor() {
			this.tasks = {};
			Deployer.prototype.streamBuffer.container = this;
		}

		/**
		 * Initialize the class prototype. It adds all plugins that contain a configuration
		 * file inside the folder config/plugins. It will search all files in that folder and
		 * load the code from src/plugins. So, if there is a file at config/plugins/echo.yaml, it must exist a file
		 * at src/plugins/echo.js.
		 * 
		 * It also applies the needed replacements in the args passed to the plugins. It uses the data found
		 * in the environment configuration to replace some special tokens in the deploy file. Those tokens will be
		 * mapped to the environment configuration using the token name. For example, if you use the token %SERVER%
		 * in any plugin argument, it will be replaced by the value of SERVER defined in the environment configuration
		 * file.
		 * 
		 * @param {string} env Environment that will be the target of the deploy.
		 */
		static initialize(env) {
			const plugins = konfig({
				path: 'config/plugins/'
			});
			const environments = konfig({
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

		/**
		 * Add a plugin to the deployer prototype.
		 * 
		 * @param {string} pluginName name of the plugin
		 * @param {Function} fn function that will be called to execute the plugin.
		 */
		static addPlugin(pluginName, fn) {
			let self = this;
			pluginName = pluginName[0].toLowerCase() + pluginName.substring(1);
			Deployer.prototype[pluginName] = fn;
		}

		/**
		 * Add a task in the deployer manager.
		 * 
		 * @param {string} taskName name of the task
		 * @param {Function} callback function that will be called when the task is executed.
		 * @return itself to enable chaining.
		 */
		task(taskName, callback) {
			this.tasks[taskName] = callback;
			return this;
		}

		/**
		 * Execute a task already registered by the task method.
		 * 
		 * @param {string} taskName name of the task to be executed.
		 * @return itself to enable chaining.
		 */
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

		/**
		 * Execute a sequence of tasks consecutively.
		 * 
		 * @param {Array} sequence array of name of tasks
		 */
		executeSequence(sequence) {
			for (let task of sequence) {
				this.executeTask(task);
			}
		}

		/**
		 * Define a sequence of tasks that must be run by the deployer.
		 * 
		 * @param {Array} sequence array of name of tasks.
		 */
		setExecutionPipeline(sequence) {
			this.executionSequence = sequence;
		}

		/**
		 * Run the sequence of tasks specified via arguments. If none provided, execute the default task.
		 */
		run() {
			if (this.executionSequence.length === 0) {
				this.executionSequence = ['default'];
			}
			for (let task of this.executionSequence) {
				this.executeTask(task);
			}
		}
	}

	Deployer.prototype.streamBuffer = {
		in: {},
		out: {}
	};

	module.exports = configureDeployer;
})();