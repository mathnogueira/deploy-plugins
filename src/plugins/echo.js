const Plugin = require('../core/plugin');

class EchoPlugin extends Plugin {

	constructor() {
		super("Echo", "1.0.0");
	}

	run() {
		let fileList = this.buffer.out;
		for (let file of fileList) {
			console.log(file);
		}
	}

}

module.exports = EchoPlugin;