/**
* Fable Settings Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/

// needed since String.matchAll wasn't added to node until v12
const libMatchAll = require('match-all');

/**
* Fable Solution Settings
*
* @class FableSettings
* @constructor
*/

class FableSettings
{
	constructor(pFableSettings)
	{
		this.default = this.buildDefaultSettings();

		// Construct a new settings object
		let tmpSettings = this.merge(pFableSettings, this.buildDefaultSettings());

		// default environment variable templating to on
		this._PerformEnvTemplating = !tmpSettings || tmpSettings.NoEnvReplacement !== true;

		// The base settings object (what they were on initialization, before other actors have altered them)
		this.base = JSON.parse(JSON.stringify(tmpSettings));

		if (tmpSettings.DefaultConfigFile)
		{
			try
			{
				// If there is a DEFAULT configuration file, try to load and merge it.
				tmpSettings = this.merge(require(tmpSettings.DefaultConfigFile), tmpSettings);
			}
			catch (pException)
			{
				// Why this?  Often for an app we want settings to work out of the box, but
				// would potentially want to have a config file for complex settings.
				console.log('Fable-Settings Warning: Default configuration file specified but there was a problem loading it.  Falling back to base.');
				console.log('     Loading Exception: '+pException);
			}
		}

		if (tmpSettings.ConfigFile)
		{
			try
			{
				// If there is a configuration file, try to load and merge it.
				tmpSettings = this.merge(require(tmpSettings.ConfigFile), tmpSettings);
			}
			catch (pException)
			{
				// Why this?  Often for an app we want settings to work out of the box, but
				// would potentially want to have a config file for complex settings.
				console.log('Fable-Settings Warning: Configuration file specified but there was a problem loading it.  Falling back to base.');
				console.log('     Loading Exception: '+pException);
			}
		}

		this.settings = tmpSettings;
	}

	// Build a default settings object.  Use the JSON jimmy to ensure it is always a new object.
	buildDefaultSettings()
	{
		return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')));
	}


	// Resolve (recursive) any environment variables found in settings object.
	_resolveEnv(pSettings)
	{
		for (const tmpKey in pSettings)
		{
			const tmpValue = pSettings[tmpKey];
			if (typeof(tmpValue) === 'object') // && !Array.isArray(tmpValue))
			{
				this._resolveEnv(tmpValue);
			}
			else if (typeof(tmpValue) === 'string')
			{
				if (tmpValue.indexOf('${') >= 0)
				{
					//pick out and resolve env constiables from the settings value.
					const tmpMatches = libMatchAll(tmpValue, /\$\{(.*?)\}/g).toArray();
					tmpMatches.forEach((tmpMatch) =>
					{
						//format: VAR_NAME|DEFAULT_VALUE
						const tmpParts = tmpMatch.split('|');
						let tmpResolvedValue = process.env[tmpParts[0]] || '';
						if (!tmpResolvedValue && tmpParts.length > 1)
						{
							tmpResolvedValue = tmpParts[1];
						}

						pSettings[tmpKey] = pSettings[tmpKey].replace('${' + tmpMatch + '}', tmpResolvedValue);
					});
				}
			}
		}
	}

	// Merge some new object into the existing settings.
	merge(pSettingsFrom, pSettingsTo)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};
		// Default to the settings object if none is passed in for the merge.
		let tmpSettingsTo = (typeof(pSettingsTo) === 'object') ? pSettingsTo : this.settings;

		// do not mutate the From object property values
		let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));
		tmpSettingsTo = Object.assign(tmpSettingsTo, tmpSettingsFromCopy);

		if (this._PerformEnvTemplating)
		{
			this._resolveEnv(tmpSettingsTo);
		}

		return tmpSettingsTo;
	}

	// Fill in settings gaps without overwriting settings that are already there
	fill(pSettingsFrom)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};

		this.settings = Object.assign(tmpSettingsFrom, this.settings);

		return this.settings;
	}
};

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableSettings(pSettings);
}

module.exports = {new:autoConstruct, FableSettings:FableSettings};
