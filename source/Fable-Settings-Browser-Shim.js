/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @author <steven@velozo.com>
*/
var libNPMModuleWrapper = require('./Fable-Settings.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('FableSettings'))
{
	window.FableSettings = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;