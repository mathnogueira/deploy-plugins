const Module = require('./src/core/module');
const Echo = require('./src/plugins/echo');
const Deployer = require('./src/deployer');


Deployer.initialize();
var deployer = new Deployer();

deployer.task('echoFiles', deploy => {
	deploy
		.search("./**/*.js", "./node_modules/**/*")
		.echo();
});

deployer.executeTask('echoFiles');