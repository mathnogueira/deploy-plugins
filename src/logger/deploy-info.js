(function() {
	"use strict";

	const username = require('git-user-name');
	const git = require('git-rev-sync');

	function getDeployInfo(options) {
		options = options || {};

		return function() {
			return {
				username: username(),
				branch: git.branch(),
				commit: git.short()
			};
		};
	}

	module.exports = getDeployInfo;
})();