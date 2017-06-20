(function() {

	"use strict";

	const deployer = require('./src/deployer')();
	const moment = require('moment');

	const getDeployInfo = require('./src/logger/deploy-info');
	const logFormatter = require('./src/logger/log-formatter');

	// Sequencias de tarefas para fazer o deploy
	deployer.task('default', ['backup', 'deploy']);
	deployer.task('backup', ['backup-interface', 'backup-logica']);
	deployer.task('deploy', ['deploy-logica', 'deploy-interface', 'log']);

	// Faz o backup da interface que está no servidor.
	deployer.task('backup-interface', deploy => {
		let date = moment().format('DD-MM-YYYY HH-mm');
		deploy
			.search('D:/workspace/sigerh-pa/Interface/dist/**/*.*')
			.replace('D:/workspace/sigerh-pa/Interface/dist/', '@{Server}/sigerh/Interface/')
			.zip('backup.zip', { removePrefix: '@{Server}/sigerh/Interface/', verbose: true })
			.send(`@{Server}/sigerh/backups/interface/${date}.zip`);
	});

	// Faz o backup da lógica que está no servidor.
	deployer.task('backup-logica', deploy => {
		let date = moment().format('DD-MM-YYYY HH-mm');
		deploy
			.search('D:/publish/sigerh-pa/**/*.*')
			.replace('D:/publish/sigerh-pa/', '@{Server}/sigerh/Logica/')
			.zip('backup.zip', { removePrefix: '@{Server}/sigerh/Logica/' })
			.send(`@{Server}/sigerh/backups/logica/${date}.zip`);
	});

	// Faz o deploy da nova build da interface
	deployer.task('deploy-interface', deploy => {
		deploy
			.search('D:/workspace/sigerh-pa/Interface/dist/**/*.*')
			.zip('interface.zip', { removePrefix: 'D:/workspace/sigerh-pa/Interface/dist/', binary: true})
			.send('@{Server}/sigerh/Interface/interface.zip', { eraseFile: true })
			.unzip({ eraseFile: true });
	});

	// Faz o deploy da lógica
	deployer.task('deploy-logica', deploy => {
		deploy
			.search('D:/publish/sigerh-pa/**/*.*')
			.zip('logica.zip', { removePrefix: 'D:/publish/sigerh-pa/', binary: true})
			.send('@{Server}/sigerh/Logica/logica.zip', { eraseFile: true })
			.unzip({ eraseFile: true });
	});

	deployer.task('log', deploy => {
		deploy
			.pipe(getDeployInfo())
			.pipe(logFormatter())
			.log('@{Server}/sigerh/deploy.log');
	});

	deployer.run();
})();