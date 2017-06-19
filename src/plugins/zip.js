const Plugin = require('../core/plugin');
const removeRoot = require('../core/options/remove-root');
const removePrefix = require('../core/options/remove-prefix');
const zipLib = require('node-zip');
const fs = require('fs');
const path = require('path');

class ZipPlugin extends Plugin {

	constructor() {
		super("Zip", "1.0.0");
	}

	run(outputFile, options) {
		options = options || {};
		let zip = zipLib();
		let filesToZip = this.buffer.in;
		for (let rawFilename of filesToZip) {
			let filename = removeRoot(rawFilename, options);
			filename = removePrefix(filename, options);
			let content = fs.readFileSync(rawFilename, 'utf8');
			zip.file(filename, content);
		}
		let data = zip.generate({ base64: false, compression: 'DEFLATE'});
		fs.writeFileSync(outputFile, data, 'binary');
		this.buffer.out = outputFile;
		
		return super.run();
	}
}

module.exports = ZipPlugin;