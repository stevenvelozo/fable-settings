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
		// set straight away so anything that uses it respects the initial setting
		this._configureEnvTemplating(pFableSettings);

		this.default = this.buildDefaultSettings();

		// Construct a new settings object
		let tmpSettings = this.merge(pFableSettings, this.buildDefaultSettings());

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

	// Update the configuration for environment variable templating based on the current settings object
	_configureEnvTemplating(pSettings)
	{
		// default environment variable templating to on
		this._PerformEnvTemplating = !pSettings || pSettings.NoEnvReplacement !== true;
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

	/**
	 * Check to see if a value is an object (but not an array).
	 */
	_isObject(value)
	{
		return typeof(value) === 'object' && !Array.isArray(value);
	}

	/**
	 * Merge two plain objects. Keys that are objects in both will be merged property-wise.
	 */
	_deepMergeObjects(toObject, fromObject)
	{
		if (!fromObject || !this._isObject(fromObject))
		{
			return;
		}
		Object.keys(fromObject).forEach((key) =>
		{
			const fromValue = fromObject[key];
			if (this._isObject(fromValue))
			{
				const toValue = toObject[key];
				if (toValue && this._isObject(toValue))
				{
					// both are objects, so do a recursive merge
					this._deepMergeObjects(toValue, fromValue);
					return;
				}
			}
			toObject[key] = fromValue;
		});
		return toObject;
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
		tmpSettingsTo = this._deepMergeObjects(tmpSettingsTo, tmpSettingsFromCopy);

		if (this._PerformEnvTemplating)
		{
			this._resolveEnv(tmpSettingsTo);
		}
		// update env tempating config, since we just updated the config object, and it may have changed
		this._configureEnvTemplating(tmpSettingsTo);

		return tmpSettingsTo;
	}

	// Fill in settings gaps without overwriting settings that are already there
	fill(pSettingsFrom)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};

		// do not mutate the From object property values
		let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));

		this.settings = this._deepMergeObjects(tmpSettingsFromCopy, this.settings);

		return this.settings;
	}
};

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableSettings(pSettings);
}

module.exports = {new:autoConstruct, FableSettings:FableSettings};
