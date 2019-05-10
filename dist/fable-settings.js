(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
	"Product": "ApplicationNameHere",
	"ProductVersion": "0.0.0",

	"ConfigFile": false,

	"LogStreams":
	[
		{
			"level": "trace"
		}
	]
}

},{}],2:[function(require,module,exports){
/**
* Fable Settings Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/

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
		return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')))
	}

	// Merge some new object into the existing settings.
	merge(pSettingsFrom, pSettingsTo)
	{
		// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
		let tmpSettingsFrom = (typeof(pSettingsFrom) === 'object') ? pSettingsFrom : {};
		// Default to the settings object if none is passed in for the merge.
		let tmpSettingsTo = (typeof(pSettingsTo) === 'object') ? pSettingsTo : this.settings;

		tmpSettingsTo = Object.assign(tmpSettingsTo, tmpSettingsFrom);

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

},{"./Fable-Settings-Default":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvRmFibGUtU2V0dGluZ3MtRGVmYXVsdC5qc29uIiwic291cmNlL0ZhYmxlLVNldHRpbmdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwiUHJvZHVjdFwiOiBcIkFwcGxpY2F0aW9uTmFtZUhlcmVcIixcblx0XCJQcm9kdWN0VmVyc2lvblwiOiBcIjAuMC4wXCIsXG5cblx0XCJDb25maWdGaWxlXCI6IGZhbHNlLFxuXG5cdFwiTG9nU3RyZWFtc1wiOlxuXHRbXG5cdFx0e1xuXHRcdFx0XCJsZXZlbFwiOiBcInRyYWNlXCJcblx0XHR9XG5cdF1cbn1cbiIsIi8qKlxuKiBGYWJsZSBTZXR0aW5ncyBBZGQtb25cbipcbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEBhdXRob3IgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qIEBtb2R1bGUgRmFibGUgU2V0dGluZ3NcbiovXG5cbi8qKlxuKiBGYWJsZSBTb2x1dGlvbiBTZXR0aW5nc1xuKlxuKiBAY2xhc3MgRmFibGVTZXR0aW5nc1xuKiBAY29uc3RydWN0b3JcbiovXG5cbmNsYXNzIEZhYmxlU2V0dGluZ3Ncbntcblx0Y29uc3RydWN0b3IocEZhYmxlU2V0dGluZ3MpXG5cdHtcblx0XHR0aGlzLmRlZmF1bHQgPSB0aGlzLmJ1aWxkRGVmYXVsdFNldHRpbmdzKCk7XG5cblx0XHQvLyBDb25zdHJ1Y3QgYSBuZXcgc2V0dGluZ3Mgb2JqZWN0XG5cdFx0bGV0IHRtcFNldHRpbmdzID0gdGhpcy5tZXJnZShwRmFibGVTZXR0aW5ncywgdGhpcy5idWlsZERlZmF1bHRTZXR0aW5ncygpKTtcblxuXHRcdC8vIFRoZSBiYXNlIHNldHRpbmdzIG9iamVjdCAod2hhdCB0aGV5IHdlcmUgb24gaW5pdGlhbGl6YXRpb24sIGJlZm9yZSBvdGhlciBhY3RvcnMgaGF2ZSBhbHRlcmVkIHRoZW0pXG5cdFx0dGhpcy5iYXNlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0bXBTZXR0aW5ncykpO1xuXG5cdFx0aWYgKHRtcFNldHRpbmdzLkRlZmF1bHRDb25maWdGaWxlKVxuXHRcdHtcblx0XHRcdHRyeVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhIERFRkFVTFQgY29uZmlndXJhdGlvbiBmaWxlLCB0cnkgdG8gbG9hZCBhbmQgbWVyZ2UgaXQuXG5cdFx0XHRcdHRtcFNldHRpbmdzID0gdGhpcy5tZXJnZShyZXF1aXJlKHRtcFNldHRpbmdzLkRlZmF1bHRDb25maWdGaWxlKSwgdG1wU2V0dGluZ3MpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKHBFeGNlcHRpb24pXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFdoeSB0aGlzPyAgT2Z0ZW4gZm9yIGFuIGFwcCB3ZSB3YW50IHNldHRpbmdzIHRvIHdvcmsgb3V0IG9mIHRoZSBib3gsIGJ1dFxuXHRcdFx0XHQvLyB3b3VsZCBwb3RlbnRpYWxseSB3YW50IHRvIGhhdmUgYSBjb25maWcgZmlsZSBmb3IgY29tcGxleCBzZXR0aW5ncy5cblx0XHRcdFx0Y29uc29sZS5sb2coJ0ZhYmxlLVNldHRpbmdzIFdhcm5pbmc6IERlZmF1bHQgY29uZmlndXJhdGlvbiBmaWxlIHNwZWNpZmllZCBidXQgdGhlcmUgd2FzIGEgcHJvYmxlbSBsb2FkaW5nIGl0LiAgRmFsbGluZyBiYWNrIHRvIGJhc2UuJyk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCcgICAgIExvYWRpbmcgRXhjZXB0aW9uOiAnK3BFeGNlcHRpb24pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0bXBTZXR0aW5ncy5Db25maWdGaWxlKVxuXHRcdHtcblx0XHRcdHRyeVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhIGNvbmZpZ3VyYXRpb24gZmlsZSwgdHJ5IHRvIGxvYWQgYW5kIG1lcmdlIGl0LlxuXHRcdFx0XHR0bXBTZXR0aW5ncyA9IHRoaXMubWVyZ2UocmVxdWlyZSh0bXBTZXR0aW5ncy5Db25maWdGaWxlKSwgdG1wU2V0dGluZ3MpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKHBFeGNlcHRpb24pXG5cdFx0XHR7XG5cdFx0XHRcdC8vIFdoeSB0aGlzPyAgT2Z0ZW4gZm9yIGFuIGFwcCB3ZSB3YW50IHNldHRpbmdzIHRvIHdvcmsgb3V0IG9mIHRoZSBib3gsIGJ1dFxuXHRcdFx0XHQvLyB3b3VsZCBwb3RlbnRpYWxseSB3YW50IHRvIGhhdmUgYSBjb25maWcgZmlsZSBmb3IgY29tcGxleCBzZXR0aW5ncy5cblx0XHRcdFx0Y29uc29sZS5sb2coJ0ZhYmxlLVNldHRpbmdzIFdhcm5pbmc6IENvbmZpZ3VyYXRpb24gZmlsZSBzcGVjaWZpZWQgYnV0IHRoZXJlIHdhcyBhIHByb2JsZW0gbG9hZGluZyBpdC4gIEZhbGxpbmcgYmFjayB0byBiYXNlLicpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnICAgICBMb2FkaW5nIEV4Y2VwdGlvbjogJytwRXhjZXB0aW9uKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnNldHRpbmdzID0gdG1wU2V0dGluZ3M7XG5cdH1cblxuXHQvLyBCdWlsZCBhIGRlZmF1bHQgc2V0dGluZ3Mgb2JqZWN0LiAgVXNlIHRoZSBKU09OIGppbW15IHRvIGVuc3VyZSBpdCBpcyBhbHdheXMgYSBuZXcgb2JqZWN0LlxuXHRidWlsZERlZmF1bHRTZXR0aW5ncygpXG5cdHtcblx0XHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXF1aXJlKCcuL0ZhYmxlLVNldHRpbmdzLURlZmF1bHQnKSkpXG5cdH1cblxuXHQvLyBNZXJnZSBzb21lIG5ldyBvYmplY3QgaW50byB0aGUgZXhpc3Rpbmcgc2V0dGluZ3MuXG5cdG1lcmdlKHBTZXR0aW5nc0Zyb20sIHBTZXR0aW5nc1RvKVxuXHR7XG5cdFx0Ly8gSWYgYW4gaW52YWxpZCBzZXR0aW5ncyBmcm9tIG9iamVjdCBpcyBwYXNzZWQgaW4gKGUuZy4gb2JqZWN0IGNvbnN0cnVjdG9yIHdpdGhvdXQgcGFzc2luZyBpbiBhbnl0aGluZykgdGhpcyBzaG91bGQgc3RpbGwgd29ya1xuXHRcdGxldCB0bXBTZXR0aW5nc0Zyb20gPSAodHlwZW9mKHBTZXR0aW5nc0Zyb20pID09PSAnb2JqZWN0JykgPyBwU2V0dGluZ3NGcm9tIDoge307XG5cdFx0Ly8gRGVmYXVsdCB0byB0aGUgc2V0dGluZ3Mgb2JqZWN0IGlmIG5vbmUgaXMgcGFzc2VkIGluIGZvciB0aGUgbWVyZ2UuXG5cdFx0bGV0IHRtcFNldHRpbmdzVG8gPSAodHlwZW9mKHBTZXR0aW5nc1RvKSA9PT0gJ29iamVjdCcpID8gcFNldHRpbmdzVG8gOiB0aGlzLnNldHRpbmdzO1xuXG5cdFx0dG1wU2V0dGluZ3NUbyA9IE9iamVjdC5hc3NpZ24odG1wU2V0dGluZ3NUbywgdG1wU2V0dGluZ3NGcm9tKTtcblxuXHRcdHJldHVybiB0bXBTZXR0aW5nc1RvO1xuXHR9XG5cblx0Ly8gRmlsbCBpbiBzZXR0aW5ncyBnYXBzIHdpdGhvdXQgb3ZlcndyaXRpbmcgc2V0dGluZ3MgdGhhdCBhcmUgYWxyZWFkeSB0aGVyZVxuXHRmaWxsKHBTZXR0aW5nc0Zyb20pXG5cdHtcblx0XHQvLyBJZiBhbiBpbnZhbGlkIHNldHRpbmdzIGZyb20gb2JqZWN0IGlzIHBhc3NlZCBpbiAoZS5nLiBvYmplY3QgY29uc3RydWN0b3Igd2l0aG91dCBwYXNzaW5nIGluIGFueXRoaW5nKSB0aGlzIHNob3VsZCBzdGlsbCB3b3JrXG5cdFx0bGV0IHRtcFNldHRpbmdzRnJvbSA9ICh0eXBlb2YocFNldHRpbmdzRnJvbSkgPT09ICdvYmplY3QnKSA/IHBTZXR0aW5nc0Zyb20gOiB7fTtcblxuXHRcdHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHRtcFNldHRpbmdzRnJvbSwgdGhpcy5zZXR0aW5ncyk7XG5cblx0XHRyZXR1cm4gdGhpcy5zZXR0aW5ncztcblx0fVxufTtcblxuLy8gVGhpcyBpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbmZ1bmN0aW9uIGF1dG9Db25zdHJ1Y3QocFNldHRpbmdzKVxue1xuXHRyZXR1cm4gbmV3IEZhYmxlU2V0dGluZ3MocFNldHRpbmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7bmV3OmF1dG9Db25zdHJ1Y3QsIEZhYmxlU2V0dGluZ3M6RmFibGVTZXR0aW5nc307XG4iXX0=
