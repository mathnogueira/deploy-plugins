(function() {
	"use strict";

	const moment = require('moment');

	function logFormatter() {

		return function(deployInfo) {
			let date = moment().format('DD/MM/YYYY HH:mm');
			return `[${date}] ${deployInfo.username} publicou o commit #${deployInfo.commit} da branch ${deployInfo.branch}`;
		};
	}

	module.exports = logFormatter;
})();