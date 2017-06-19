const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function saveFile(filename, data) {
	let basePath = path.dirname(filename);
	mkdirp.sync(basePath);
	fs.writeFileSync(filename, data);
}

module.exports = saveFile;