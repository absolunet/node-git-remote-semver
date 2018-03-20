//--------------------------------------------------------
//-- Git remote semver
//--------------------------------------------------------
'use strict';

const { exec, spawn } = require('child_process');
const boxen           = require('boxen');
const chalk           = require('chalk');
const Configstore     = require('configstore');
const semver          = require('semver');
const toSemver        = require('to-semver');


const DICTIONARY = {
	updateAvailable: {
		fr: 'Mise à jour disponible',
		en: 'Update available'
	}
};






module.exports = class {

	static configstore(name) {
		return new Configstore(`@absolunet-git-remote-semver/${name}`);
	}

	static getVersions(url) {
		return new Promise((resolve) => {
			exec(`git ls-remote --tags ${url} | awk '{print $2}' | grep -v '{}' | awk -F"/" '{print $3}'`, { encoding:'utf8' }, (error, stdout/* , stderr */) => {
				const versions = [];

				stdout.split(`\n`).forEach((line) => {
					if (line) {
						versions.push(line.trim());
					}
				});

				resolve(toSemver(versions));
			});
		});
	}

	static getLatest(url) {
		return new Promise((resolve) => {
			this.getVersions(url).then((versions) => {
				resolve(versions.shift() || null);
			});
		});
	}

	static needUpdate(url, current) {
		return new Promise((resolve) => {
			this.getLatest(url).then((latest) => {
				resolve(latest && semver.gt(latest, current) ? latest : false);
			});
		});
	}


	// Simulate npm's update-notifier behavior
	static updateNotification({ current, latest, lang = 'en', msg }) {
		return boxen(`${DICTIONARY.updateAvailable[lang]} ${chalk.dim(current)} ${chalk.reset('→')} ${chalk.green(latest)}${msg ? `\n${msg}` : ''}`, {
			padding:     1,
			margin:      0.5,
			align:       'left',
			borderColor: 'yellow'
		});
	}


	// Check for updates unobtrusively but be obnoxious about the update
	static obnoxiousNotification({ url, current, name, lang = 'en', msg }) {

		// Get latest checked version
		const conf = this.configstore(name);

		if (conf.has('obnoxious')) {
			const infos = conf.get('obnoxious');

			// If update is available tell it
			if (semver.gt(infos.version, current)) {

				// eslint-disable-next-line no-console
				console.log(`\n${
					this.updateNotification({
						current: current,
						latest:  infos.version,
						lang:    lang,
						msg:     msg
					})
				}`);
			}
		}

		// Spawn a unobtrusive check
		spawn(process.execPath, [`${__dirname}/obnoxious.js`, JSON.stringify({ url, name, current })], {
			detached: true,
			stdio: 'ignore'
		}).unref();
	}

};
