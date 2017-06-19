(function() {

	"use strict";

	const deployer = require('./src/deployer')();
	const moment = require('moment');

	// Sequencias de tarefas para fazer o deploy
	deployer.task('default', ['backup', 'deploy']);
	deployer.task('backup', ['backup-interface', 'backup-logica']);
	deployer.task('deploy', ['deploy-logica', 'deploy-interface']);

	// Faz o backup da interface que está no servidor.
	deployer.task('backup-interface', deploy => {
		let date = moment().format('DD-MM-YYYY HH-mm');
		deploy
			.search('%Server%/sigerh/Interface/**/*.*')
			.zip('backup.zip', { removePrefix: '%Server%/sigerh/Interface/' })
			.send(`%Server%/sigerh/backups/interface/${date}.zip`);
	});

	// Faz o backup da lógica que está no servidor.
	deployer.task('backup-logica', deploy => {
		let date = moment().format('DD-MM-YYYY HH-mm');
		deploy
			.search('%Server%/sigerh/Logica/**/*.*')
			.zip('backup.zip', { removePrefix: '%Server%/sigerh/Interface/' })
			.send(`%Server%/sigerh/backups/logica/${date}.zip`);
	});

	// Faz o deploy da nova build da interface
	deployer.task('deploy-interface', deploy => {
		deploy
			.search('D:/workspace/sigerh-pa/Interface/dist/**/*.*')
			.zip('interface.zip', { removePrefix: 'D:/workspace/sigerh-pa/Interface/dist/'})
			.send('%Server%/sigerh/Interface/interface.zip', { eraseFile: true })
			.unzip({ eraseFile: true });
	});

	// Faz o deploy da lógica
	deployer.task('deploy-logica', deploy => {
		deploy
			.search('D:/publish/sigerh-pa/**/*.*')
			.zip('logica.zip', { removePrefix: 'D:/publish/sigerh-pa/' })
			.send('%Server%/sigerh/Logica/logica.zip', { eraseFile: true })
			.unzip({ eraseFile: true });
	});

	// deployer.executeTask('deploy');
	deployer.run();
})();