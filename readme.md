# @absolunet/git-remote-semver

[![NPM version](https://img.shields.io/npm/v/@absolunet/git-remote-semver.svg)](https://www.npmjs.com/package/@absolunet/git-remote-semver)
[![Travis build](https://api.travis-ci.org/absolunet/node-git-remote-semver.svg?branch=master)](https://travis-ci.org/absolunet/node-git-remote-semver/builds)
[![Dependencies](https://david-dm.org/absolunet/node-git-remote-semver/status.svg)](https://david-dm.org/absolunet/node-git-remote-semver)
[![Dev dependencies](https://david-dm.org/absolunet/node-git-remote-semver/dev-status.svg)](https://david-dm.org/absolunet/node-git-remote-semver?type=dev)

> Git remote tags semver


## Install

```sh
$ npm install @absolunet/git-remote-semver
```


## Usage

```js
const pkg             = require('package');
const gitRemoteSemver = require('@absolunet/git-remote-semver');

gitRemoteSemver.needUpdate('git@github.com:absolunet/node-git-remote-semver.git', pkg.version).then((version) => {
	if (version) {
		console.log(gitRemoteSemver.updateNotification({
			current: pkg.version,
			latest:  version,
			msg:     'Please update...'
		}));
	} else {
		console.log('You are up to date!');
	}
});
```


## API

### getVersions(url)

`Promise` returns an `Array` of valid, sorted, and cleaned semver tags.

#### url

*Required*  
Type: `string`  

The [remote git url](https://git-scm.com/docs/git-fetch#_git_urls_a_id_urls_a)


### getLatest(url)

`Promise` returns a `string` of the latest semver tag.

#### url

*Required*  
Type: `string`  

The [remote git url](https://git-scm.com/docs/git-fetch#_git_urls_a_id_urls_a)


### needUpdate(url, current)

`Promise` returns a `string` of version if `current` is lower than latest tag or `false`

#### url

*Required*  
Type: `string`  

The [remote git url](https://git-scm.com/docs/git-fetch#_git_urls_a_id_urls_a)

#### current

*Required*  
Type: `string`

Current semver version.


### updateNotification(options)

Returns a `string` of a [update-notifier](https://www.npmjs.com/package/update-notifier) style notification.

#### options

*Required*  
Type: `Object`

##### current

*Required*  
Type: `string`<br>
Current semver version.

##### latest

*Required*  
Type: `string`<br>
Latest semver version.

##### lang

Type: `string`<br>
Default: 'en'<br>
Language to use for notification (fr/en).

##### msg

Type: `string`<br>
Additional message for the notification.


## License

MIT © [Absolunet](https://absolunet.com)
