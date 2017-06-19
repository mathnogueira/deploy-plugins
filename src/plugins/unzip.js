const Plugin = require('../core/plugin');
const saveFile = require('../core/file-saver');
const eraseFile = require('../core/options/erase-file');
const unzip = require('node-zip');
const path = require('path');
const fs = require('fs');

class UnzipPlugin extends Plugin {

	constructor() {
		super("unzip", "1.0.0");
	}

	run(options) {
		options = options || {};
		let zipFile = this.buffer.in;
		let destinationPath = path.dirname(zipFile);
		let zipArchive = fs.readFileSync(zipFile);
		let extracted = new unzip(zipArchive, {base64: false, checkCRC32: true});
		let extractedFiles = extracted.files;
		let filenames = Object.keys(extractedFiles);
		let outputFiles = [];

		for (let filename of filenames) {
			let fileContent = extractedFiles[filename]._data;
			let fullFilename = destinationPath + path.sep + filename;
			saveFile(fullFilename, fileContent);
			outputFiles.push(fullFilename);
		}

		eraseFile(zipFile, options);
		this.buffer.out = outputFiles;
		
		return super.run();
	}
}

module.exports = UnzipPlugin;