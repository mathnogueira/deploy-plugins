const Plugin = require('../core/plugin');
const zip = require('node-zip')();
const fs = require('fs');

class ZipPlugin extends Plugin {

	constructor() {
		super("Zip", "1.0.0");
	}

	run(outputFile) {
		let filesToZip = this.buffer.out;
		for (let file of filesToZip) {
			let content = fs.readFileSync(file, 'utf8');
			zip.file(file, content);
		}
		let data = zip.generate({ base64: false, compression: 'DEFLATE'});
		fs.writeFileSync(outputFile, data, 'binary');
		this.buffer.out = outputFile;
		return super.run();
	}
}

module.exports = ZipPlugin;