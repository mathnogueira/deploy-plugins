
// Remove the root directory of a filename.
// Ex: /var/www/html/mysite/index.html will become /www/html/mysite/index.html
//
// @param {string} filename full path for the file.
// @param {object} options set of options.
// @return path without the root directory.
function removeRoot(filename, options) {
	let outputFile = filename;
	if (options.removeRoot) {
		let splittedFilePath = filename.split('/');
		splittedFilePath.shift();
		outputFile = splittedFilePath.join('/');
	}
	return outputFile;
}

module.exports = removeRoot;