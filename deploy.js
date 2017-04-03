const Module = require('./src/core/module');
const Echo = require('./src/plugins/echo');
const Deployer = require('./src/deployer');


Deployer.initialize();
var deployer = new Deployer();

deployer.task('echoFiles', deploy => {
	deploy
		.search("./**/*.js", "./node_modules/**/*")
		.zip("deploy.zip")
		.echo();
});

deployer.executeTask('echoFiles');