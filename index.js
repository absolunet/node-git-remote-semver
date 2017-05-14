//--------------------------------------------------------
//-- Git remote semver
//--------------------------------------------------------
'use strict';

const { exec } = require('child_process');
const semver   = require('semver');
const toSemver = require('to-semver');






module.exports = class GitRemoteSemver {

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
				resolve(versions.shift());
			});
		});
	}

	static needUpdate(url, current) {
		return new Promise((resolve) => {
			this.getLatest(url).then((latest) => {
				resolve(semver.gt(latest, current) ? latest : false);
			});
		});
	}

};
