//--------------------------------------------------------
//-- Git remote semver
//--------------------------------------------------------
'use strict';

const { exec } = require('child_process');
const boxen    = require('boxen');
const chalk    = require('chalk');
const semver   = require('semver');
const toSemver = require('to-semver');


const DICTIONARY = {
	updateAvailable: {
		fr: 'Mise à jour disponible',
		en: 'Update available'
	}
};






module.exports = class {

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
		return boxen(
			`${DICTIONARY.updateAvailable[lang]} ${chalk.dim(current)} ${chalk.reset('→')} ${chalk.green(latest)}${msg ? `\n${msg}` : ''}`,
			{
				padding:     1,
				margin:      0.5,
				align:       'left',
				borderColor: 'yellow'
			}
		);
	}

};
