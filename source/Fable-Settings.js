/**
* Fable Settings Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/
// Underscore for utility
var libUnderscore = require('underscore');

/**
* Fable Solution Settings
*
* @class FableSettings
* @constructor
*/
var FableSettings = function()
{
	// Default Fable settings
	var _SettingsDefaults = (
	{
		// This is used for logging and API identification
		Product: 'Fable',
		ProductVersion: '0.0.0',

		// The default port for an API server
		APIServerPort: 8080,

		// The location for a config file to load 
		ConfigFile: false,

		// Identification for the log and record GUID generators
		UUID: (
			{
				DataCenter: 0,
				Worker: 0
			}),

		// The session handler configuration
		SessionStrategy: "memcached",
		MemcachedURL: "127.0.0.1:11211",

		// The MongoDB URL (this is used by the logger)
		MongoDBURL:"mongodb://127.0.0.1/Fable",

		// The MySQL Server connection data
		MySQL:
			{
				"Server": "127.0.0.1",
				"Port": 3306,
				"User": "ENTER_USER_HERE",
				"Password": "ENTER_PASSWORD_HERE",
				"Database": "ENTER_DATABASE_HERE",
				"ConnectionPoolLimit": 20
			},

		// A sane default log stream
		LogStreams: [{streamtype:'process.stdout', level:'trace'}]
	});

	function createNew(pFromParameters)
	{
		var _Settings;
		var _SettingsBase;

		// Merge some new object into the existing settings.
		var merge = function(pSettings)
		{
			// Laziliy initialize settings.
			_Settings = libUnderscore.extend((typeof(_Settings) === 'object') ? _Settings : {}, (typeof(pSettings) === 'object') ? pSettings : {});
			return _Settings;
		};

		// Fill in settings gaps without overwriting settings that are already there
		var fill = function(pSettings)
		{
			_Settings = libUnderscore.extend((typeof(pSettings) === 'object') ? pSettings : {}, _Settings);
			return _Settings;
		};

		// Merge in the defaults, which we expect to be the minimum valid working set
		merge(_SettingsDefaults);

		// Now merge the passed-in parameter with the settings defaults to create a "base" settings object
		_SettingsBase = merge(pFromParameters);

		if (_Settings.DefaultConfigFile)
		{
			try
			{
				// If there is a DEFAULT configuration file, try to load and merge it.
				merge(require(_SettingsBase.DefaultConfigFile));
			}
			catch (pException)
			{
				// Why this?  Often for an app we want settings to work out of the box, but
				// would potentially want to have a config file for complex settings.
				console.log('Fable-Settings Warning: Default configuration file specified but there was a problem loading it.  Falling back to base.');
				console.log('     Loading Exception: '+pException);
			}
		}

		if (_Settings.ConfigFile)
		{
			try
			{
				// If there is a configuration file, try to load and merge it.
				merge(require(_SettingsBase.ConfigFile));
			}
			catch (pException)
			{
				// Why this?  Often for an app we want settings to work out of the box, but
				// would potentially want to have a config file for complex settings.
				console.log('Fable-Settings Warning: Configuration file specified but there was a problem loading it.  Falling back to base.');
				console.log('     Loading Exception: '+pException);
			}
		}

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableSettingsObject = (
		{
			merge: merge,
			fill: fill,

			new: createNew
		});

		/**
		 * Default Settings
		 *
		 * @property default
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableSettingsObject, 'default',
			{
				get: function() { return _SettingsDefaults; },
				enumerable: true
			});

		/**
		 * Base Settings
		 *
		 * @property base
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableSettingsObject, 'base',
			{
				get: function() { return _SettingsBase; },
				enumerable: true
			});

		/**
		 * Settings
		 *
		 * @property settings
		 * @type string
		 */
		Object.defineProperty(tmpNewFableSettingsObject, 'settings',
			{
				get: function() { return _Settings; },
				enumerable: true
			});

		return tmpNewFableSettingsObject;
	}

	return createNew();
};

module.exports = new FableSettings();
