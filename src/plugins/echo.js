const Plugin = require('../core/plugin');

class EchoPlugin extends Plugin {

	constructor() {
		super("Echo", "1.0.0");
	}

	run() {
		let fileList = this.buffer.in;
		if (Array.isArray(fileList)) {
			for (let file of fileList) {
				console.log(file);
			}
		} else {
			console.log(fileList);
		}

		this.buffer.out = this.buffer.in;

		return super.run();
	}

}

module.exports = EchoPlugin;