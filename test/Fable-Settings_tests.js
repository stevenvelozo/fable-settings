/**
* Unit tests for the Fable Settings Object
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

suite
(
	'Fable-Settings',
	function()
	{
		setup
		(
			function()
			{
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'initialize should build a happy little object',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new();
						Expect(tmpFableSettings)
							.to.be.an('object', 'Fable-Settings should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new();
						Expect(tmpFableSettings).to.have.a.property('default')
							.that.is.a('object');
						Expect(tmpFableSettings).to.have.a.property('base')
							.that.is.a('object');
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('Fable');
					}
				);
			}
		);
		suite
		(
			'Customization and twiddling of settings',
			function()
			{
				test
				(
					'passing in a value',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new({Product:'TestProduct1'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('TestProduct1');
					}
				);
				test
				(
					'manually defining a settings object',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new();
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('Fable');
						tmpFableSettings.merge({Product:'NewSettingsObject'});
						Expect(tmpFableSettings.settings.Product)
							.to.equal('NewSettingsObject');
						// Be sure defaults carry through
						Expect(tmpFableSettings.settings.ProductVersion)
							.to.equal('0.0.0');

						// Test the object fill method.
						tmpFableSettings.fill({Product:'DontOverwriteMe',SomeFancySetting:'CreateMe'});
						// Fill should have ignored overwriting existing settings
						Expect(tmpFableSettings.settings.Product)
							.to.equal('NewSettingsObject');
						// Fill should have filled-in gaps in the union
						Expect(tmpFableSettings.settings.SomeFancySetting)
							.to.equal('CreateMe');
						// Exercise filling without a good value
						tmpFableSettings.fill();
					}
				);
				test
				(
					'loading settings from a DEFAULT file',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new({DefaultConfigFile:__dirname+'/DefaultExampleSettings.json'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('BestProductEver - DEFAULT');
					}
				);
				test
				(
					'loading settings from a nonexistant DEFAULT file',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new({DefaultConfigFile:__dirname+'/NO_SETTINGS_HERE.json'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('Fable');
					}
				);
				test
				(
					'loading settings from a file',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new(
							{
								DefaultConfigFile:__dirname+'/DefaultExampleSettings.json',
								ConfigFile:__dirname+'/ExampleSettings.json'
							});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('BestProductEver');
						Expect(tmpFableSettings.settings.TestValue)
							.to.equal('NOT_OVERIDDEN');
					}
				);
				test
				(
					'loading settings from a nonexistant file',
					function()
					{
						var tmpFableSettings = require('../source/Fable-Settings.js').new({ConfigFile:__dirname+'/NO_SETTINGS_HERE.json'});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Product')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Product)
							.to.equal('Fable');
					}
				);
				test
				(
					'resolve environment variables',
					function()
					{
						process.env['NOT_DEFAULT'] = 'found_value';

						var tmpFableSettings = require('../source/Fable-Settings.js').new(
							{
								DefaultConfigFile:__dirname+'/DefaultExampleSettings.json',
								ConfigFile:__dirname+'/ExampleSettings.json'
							});
						Expect(tmpFableSettings).to.have.a.property('settings')
							.that.is.a('object');
						Expect(tmpFableSettings.settings).to.have.a.property('Environment')
							.that.is.a('string');
						Expect(tmpFableSettings.settings.Environment)
							.to.equal('found_value-default');
					}
				);
			}
		);
	}
);