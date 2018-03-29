//--------------------------------------------------------
//-- Obnoxious checker
//--------------------------------------------------------
'use strict';

const gitRemoteSemver = require('.');
const semver          = require('semver');


const options = JSON.parse(process.argv[2]);


// Get latest version and store it
gitRemoteSemver.getLatest(options.url, options.current).then((version) => {

	if (semver.valid(version)) {
		const conf = gitRemoteSemver.configstore(options.name);
		conf.set('obnoxious', {
			version: version,
			date:    new Date()
		});
	}

	// Call process exit explicitly to terminate the child process
	// Otherwise the child process will run forever, according to the Node.js docs
	process.exit();  // eslint-disable-line no-process-exit

}).catch(() => {
	process.exit(1);  // eslint-disable-line no-process-exit
});
