(function() {
	"use strict";

	function getEnvironemntConfigVariables(string) {
		"use strict";
		const configRegex = /.*\%(.+)\%.*/;
		let a = configRegex.exec(string);
		// console.log(string, a);
		return a;
	}

	function replaceVariables(string, variables, config) {
		// console.log(variables);
	}

	function replaceArgument(arg, config) {
		if (typeof arg === 'object' || Array.isArray(arg)) {
			for (let key in arg) {
				if (!arg.hasOwnProperty(key)) continue;
				arg[key] = replaceArgument(arg[key], config);
			}
		} else {
			let configVars = getEnvironemntConfigVariables(arg);
			if (configVars) {
				let variable = configVars[1];
				let configVar = config[variable];
				arg = arg.replace('%' + variable + '%', configVar);
			}
			return arg;
		}

		return arg;
	}

	function configReplaceDecorator(target, config) {

		return function() {
			let args = replaceArgument(arguments, config);
			return target.apply(target, args);
		};
	}

	module.exports = configReplaceDecorator;

})();