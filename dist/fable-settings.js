(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.FableSettings = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      /**
      * Fable Core Pre-initialization Service Base
      *
      * For a couple services, we need to be able to instantiate them before the Fable object is fully initialized.
      * This is a base class for those services.
      *
      * @license MIT
      * @author <steven@velozo.com>
      */

      class FableCoreServiceProviderBase {
        constructor(pOptions, pServiceHash) {
          this.fable = false;
          this.options = typeof pOptions === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';

          // The hash will be a non-standard UUID ... the UUID service uses this base class!
          this.UUID = `CORESVC-${Math.floor(Math.random() * (99999 - 10000) + 10000)}`;
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : `${this.UUID}`;
        }
        static isFableService = true;

        // After fable is initialized, it would be expected to be wired in as a normal service.
        connectFable(pFable) {
          this.fable = pFable;
          return true;
        }
      }
      module.exports = FableCoreServiceProviderBase;
    }, {}],
    2: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @license MIT
      * @author <steven@velozo.com>
      */

      class FableServiceProviderBase {
        constructor(pFable, pOptions, pServiceHash) {
          this.fable = pFable;
          this.options = typeof pOptions === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';
          this.UUID = pFable.getUUID();
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : `${this.UUID}`;
        }
        static isFableService = true;
      }
      module.exports = FableServiceProviderBase;
      module.exports.CoreServiceProviderBase = require('./Fable-ServiceProviderBase-Preinit.js');
    }, {
      "./Fable-ServiceProviderBase-Preinit.js": 1
    }],
    3: [function (require, module, exports) {
      /**
      * Precedent Meta-Templating
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Process text streams, parsing out meta-template expressions.
      */
      var libWordTree = require(`./WordTree.js`);
      var libStringParser = require(`./StringParser.js`);
      class Precedent {
        /**
         * Precedent Constructor
         */
        constructor() {
          this.WordTree = new libWordTree();
          this.StringParser = new libStringParser();
          this.ParseTree = this.WordTree.ParseTree;
        }

        /**
         * Add a Pattern to the Parse Tree
         * @method addPattern
         * @param {Object} pTree - A node on the parse tree to push the characters into
         * @param {string} pPattern - The string to add to the tree
         * @param {number} pIndex - callback function
         * @return {bool} True if adding the pattern was successful
         */
        addPattern(pPatternStart, pPatternEnd, pParser) {
          return this.WordTree.addPattern(pPatternStart, pPatternEnd, pParser);
        }

        /**
         * Parse a string with the existing parse tree
         * @method parseString
         * @param {string} pString - The string to parse
         * @param {object} pData - Data to pass in as the second argument
         * @return {string} The result from the parser
         */
        parseString(pString, pData) {
          return this.StringParser.parseString(pString, this.ParseTree, pData);
        }
      }
      module.exports = Precedent;
    }, {
      "./StringParser.js": 4,
      "./WordTree.js": 5
    }],
    4: [function (require, module, exports) {
      /**
      * String Parser
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Parse a string, properly processing each matched token in the word tree.
      */

      class StringParser {
        /**
         * StringParser Constructor
         */
        constructor() {}

        /**
         * Create a fresh parsing state object to work with.
         * @method newParserState
         * @param {Object} pParseTree - A node on the parse tree to begin parsing from (usually root)
         * @return {Object} A new parser state object for running a character parser on
         * @private
         */
        newParserState(pParseTree) {
          return {
            ParseTree: pParseTree,
            Output: '',
            OutputBuffer: '',
            Pattern: false,
            PatternMatch: false,
            PatternMatchOutputBuffer: ''
          };
        }

        /**
         * Assign a node of the parser tree to be the next potential match.
         * If the node has a PatternEnd property, it is a valid match and supercedes the last valid match (or becomes the initial match).
         * @method assignNode
         * @param {Object} pNode - A node on the parse tree to assign
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        assignNode(pNode, pParserState) {
          pParserState.PatternMatch = pNode;

          // If the pattern has a END we can assume it has a parse function...
          if (pParserState.PatternMatch.hasOwnProperty('PatternEnd')) {
            // ... this is the legitimate start of a pattern.
            pParserState.Pattern = pParserState.PatternMatch;
          }
        }

        /**
         * Append a character to the output buffer in the parser state.
         * This output buffer is used when a potential match is being explored, or a match is being explored.
         * @method appendOutputBuffer
         * @param {string} pCharacter - The character to append
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        appendOutputBuffer(pCharacter, pParserState) {
          pParserState.OutputBuffer += pCharacter;
        }

        /**
         * Flush the output buffer to the output and clear it.
         * @method flushOutputBuffer
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        flushOutputBuffer(pParserState) {
          pParserState.Output += pParserState.OutputBuffer;
          pParserState.OutputBuffer = '';
        }

        /**
         * Check if the pattern has ended.  If it has, properly flush the buffer and start looking for new patterns.
         * @method checkPatternEnd
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        checkPatternEnd(pParserState, pData) {
          if (pParserState.OutputBuffer.length >= pParserState.Pattern.PatternEnd.length + pParserState.Pattern.PatternStart.length && pParserState.OutputBuffer.substr(-pParserState.Pattern.PatternEnd.length) === pParserState.Pattern.PatternEnd) {
            // ... this is the end of a pattern, cut off the end tag and parse it.
            // Trim the start and end tags off the output buffer now
            pParserState.OutputBuffer = pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length, pParserState.OutputBuffer.length - (pParserState.Pattern.PatternStart.length + pParserState.Pattern.PatternEnd.length)), pData);
            // Flush the output buffer.
            this.flushOutputBuffer(pParserState);
            // End pattern mode
            pParserState.Pattern = false;
            pParserState.PatternMatch = false;
          }
        }

        /**
         * Parse a character in the buffer.
         * @method parseCharacter
         * @param {string} pCharacter - The character to append
         * @param {Object} pParserState - The state object for the current parsing task
         * @private
         */
        parseCharacter(pCharacter, pParserState, pData) {
          // (1) If we aren't in a pattern match, and we aren't potentially matching, and this may be the start of a new pattern....
          if (!pParserState.PatternMatch && pParserState.ParseTree.hasOwnProperty(pCharacter)) {
            // ... assign the node as the matched node.
            this.assignNode(pParserState.ParseTree[pCharacter], pParserState);
            this.appendOutputBuffer(pCharacter, pParserState);
          }
          // (2) If we are in a pattern match (actively seeing if this is part of a new pattern token)
          else if (pParserState.PatternMatch) {
            // If the pattern has a subpattern with this key
            if (pParserState.PatternMatch.hasOwnProperty(pCharacter)) {
              // Continue matching patterns.
              this.assignNode(pParserState.PatternMatch[pCharacter], pParserState);
            }
            this.appendOutputBuffer(pCharacter, pParserState);
            if (pParserState.Pattern) {
              // ... Check if this is the end of the pattern (if we are matching a valid pattern)...
              this.checkPatternEnd(pParserState, pData);
            }
          }
          // (3) If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
          else {
            pParserState.Output += pCharacter;
          }
        }

        /**
         * Parse a string for matches, and process any template segments that occur.
         * @method parseString
         * @param {string} pString - The string to parse.
         * @param {Object} pParseTree - The parse tree to begin parsing from (usually root)
         * @param {Object} pData - The data to pass to the function as a second paramter
         */
        parseString(pString, pParseTree, pData) {
          let tmpParserState = this.newParserState(pParseTree);
          for (var i = 0; i < pString.length; i++) {
            // TODO: This is not fast.
            this.parseCharacter(pString[i], tmpParserState, pData);
          }
          this.flushOutputBuffer(tmpParserState);
          return tmpParserState.Output;
        }
      }
      module.exports = StringParser;
    }, {}],
    5: [function (require, module, exports) {
      /**
      * Word Tree
      *
      * @license     MIT
      *
      * @author      Steven Velozo <steven@velozo.com>
      *
      * @description Create a tree (directed graph) of Javascript objects, one character per object.
      */

      class WordTree {
        /**
         * WordTree Constructor
         */
        constructor() {
          this.ParseTree = {};
        }

        /** 
         * Add a child character to a Parse Tree node
         * @method addChild
         * @param {Object} pTree - A parse tree to push the characters into
         * @param {string} pPattern - The string to add to the tree
         * @param {number} pIndex - The index of the character in the pattern
         * @returns {Object} The resulting leaf node that was added (or found)
         * @private
         */
        addChild(pTree, pPattern, pIndex) {
          if (!pTree.hasOwnProperty(pPattern[pIndex])) pTree[pPattern[pIndex]] = {};
          return pTree[pPattern[pIndex]];
        }

        /** Add a Pattern to the Parse Tree
         * @method addPattern
         * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
         * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
         * @param {number} pParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
         * @return {bool} True if adding the pattern was successful
         */
        addPattern(pPatternStart, pPatternEnd, pParser) {
          if (pPatternStart.length < 1) return false;
          if (typeof pPatternEnd === 'string' && pPatternEnd.length < 1) return false;
          let tmpLeaf = this.ParseTree;

          // Add the tree of leaves iteratively
          for (var i = 0; i < pPatternStart.length; i++) tmpLeaf = this.addChild(tmpLeaf, pPatternStart, i);
          tmpLeaf.PatternStart = pPatternStart;
          tmpLeaf.PatternEnd = typeof pPatternEnd === 'string' && pPatternEnd.length > 0 ? pPatternEnd : pPatternStart;
          tmpLeaf.Parse = typeof pParser === 'function' ? pParser : typeof pParser === 'string' ? () => {
            return pParser;
          } : pData => {
            return pData;
          };
          return true;
        }
      }
      module.exports = WordTree;
    }, {}],
    6: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};
      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function (name) {
        return [];
      };
      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };
    }, {}],
    7: [function (require, module, exports) {
      /**
      * Simple browser shim loader - assign the npm module to a window global automatically
      *
      * @author <steven@velozo.com>
      */
      var libNPMModuleWrapper = require('./Fable-Settings.js');
      if (typeof window === 'object' && !window.hasOwnProperty('FableSettings')) {
        window.FableSettings = libNPMModuleWrapper;
      }
      module.exports = libNPMModuleWrapper;
    }, {
      "./Fable-Settings.js": 10
    }],
    8: [function (require, module, exports) {
      module.exports = {
        "Product": "ApplicationNameHere",
        "ProductVersion": "0.0.0",
        "ConfigFile": false,
        "LogStreams": [{
          "level": "trace"
        }]
      };
    }, {}],
    9: [function (require, module, exports) {
      (function (process) {
        (function () {
          /**
          * Fable Settings Template Processor
          *
          * This class allows environment variables to come in via templated expressions, and defaults to be set.
          *
          *
          * @author Steven Velozo <steven@velozo.com>
          * @module Fable Settings
          */
          const libPrecedent = require('precedent');
          class FableSettingsTemplateProcessor {
            constructor(pDependencies) {
              // Use a no-dependencies templating engine to parse out environment variables
              this.templateProcessor = new libPrecedent();

              // TODO: Make the environment variable wrap expression demarcation characters configurable?
              this.templateProcessor.addPattern('${', '}', pTemplateValue => {
                let tmpTemplateValue = pTemplateValue.trim();
                let tmpSeparatorIndex = tmpTemplateValue.indexOf('|');

                // If there is no pipe, the default value will end up being whatever the variable name is.
                let tmpDefaultValue = tmpTemplateValue.substring(tmpSeparatorIndex + 1);
                let tmpEnvironmentVariableName = tmpSeparatorIndex > -1 ? tmpTemplateValue.substring(0, tmpSeparatorIndex) : tmpTemplateValue;
                if (process.env.hasOwnProperty(tmpEnvironmentVariableName)) {
                  return process.env[tmpEnvironmentVariableName];
                } else {
                  return tmpDefaultValue;
                }
              });
            }
            parseSetting(pString) {
              return this.templateProcessor.parseString(pString);
            }
          }
          module.exports = FableSettingsTemplateProcessor;
        }).call(this);
      }).call(this, require('_process'));
    }, {
      "_process": 6,
      "precedent": 3
    }],
    10: [function (require, module, exports) {
      /**
      * Fable Settings Add-on
      *
      *
      * @author Steven Velozo <steven@velozo.com>
      * @module Fable Settings
      */

      const libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;
      const libFableSettingsTemplateProcessor = require('./Fable-Settings-TemplateProcessor.js');
      class FableSettings extends libFableServiceProviderBase {
        constructor(pSettings, pServiceHash) {
          super(pSettings, pServiceHash);
          this.serviceType = 'SettingsManager';

          // Initialize the settings value template processor
          this.settingsTemplateProcessor = new libFableSettingsTemplateProcessor();

          // set straight away so anything that uses it respects the initial setting
          this._configureEnvTemplating(pSettings);
          this.default = this.buildDefaultSettings();

          // Construct a new settings object
          let tmpSettings = this.merge(pSettings, this.buildDefaultSettings());

          // The base settings object (what they were on initialization, before other actors have altered them)
          this.base = JSON.parse(JSON.stringify(tmpSettings));
          if (tmpSettings.DefaultConfigFile) {
            try {
              // If there is a DEFAULT configuration file, try to load and merge it.
              tmpSettings = this.merge(require(tmpSettings.DefaultConfigFile), tmpSettings);
            } catch (pException) {
              // Why this?  Often for an app we want settings to work out of the box, but
              // would potentially want to have a config file for complex settings.
              console.log('Fable-Settings Warning: Default configuration file specified but there was a problem loading it.  Falling back to base.');
              console.log('     Loading Exception: ' + pException);
            }
          }
          if (tmpSettings.ConfigFile) {
            try {
              // If there is a configuration file, try to load and merge it.
              tmpSettings = this.merge(require(tmpSettings.ConfigFile), tmpSettings);
            } catch (pException) {
              // Why this?  Often for an app we want settings to work out of the box, but
              // would potentially want to have a config file for complex settings.
              console.log('Fable-Settings Warning: Configuration file specified but there was a problem loading it.  Falling back to base.');
              console.log('     Loading Exception: ' + pException);
            }
          }
          this.settings = tmpSettings;
        }

        // Build a default settings object.  Use the JSON jimmy to ensure it is always a new object.
        buildDefaultSettings() {
          return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')));
        }

        // Update the configuration for environment variable templating based on the current settings object
        _configureEnvTemplating(pSettings) {
          // default environment variable templating to on
          this._PerformEnvTemplating = !pSettings || pSettings.NoEnvReplacement !== true;
        }

        // Resolve (recursive) any environment variables found in settings object.
        _resolveEnv(pSettings) {
          for (const tmpKey in pSettings) {
            if (typeof pSettings[tmpKey] === 'object') {
              this._resolveEnv(pSettings[tmpKey]);
            } else if (typeof pSettings[tmpKey] === 'string') {
              pSettings[tmpKey] = this.settingsTemplateProcessor.parseSetting(pSettings[tmpKey]);
            }
          }
        }

        /**
         * Check to see if a value is an object (but not an array).
         */
        _isObject(value) {
          return typeof value === 'object' && !Array.isArray(value);
        }

        /**
         * Merge two plain objects. Keys that are objects in both will be merged property-wise.
         */
        _deepMergeObjects(toObject, fromObject) {
          if (!fromObject || !this._isObject(fromObject)) {
            return;
          }
          Object.keys(fromObject).forEach(key => {
            const fromValue = fromObject[key];
            if (this._isObject(fromValue)) {
              const toValue = toObject[key];
              if (toValue && this._isObject(toValue)) {
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
        merge(pSettingsFrom, pSettingsTo) {
          // If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
          let tmpSettingsFrom = typeof pSettingsFrom === 'object' ? pSettingsFrom : {};
          // Default to the settings object if none is passed in for the merge.
          let tmpSettingsTo = typeof pSettingsTo === 'object' ? pSettingsTo : this.settings;

          // do not mutate the From object property values
          let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));
          tmpSettingsTo = this._deepMergeObjects(tmpSettingsTo, tmpSettingsFromCopy);
          if (this._PerformEnvTemplating) {
            this._resolveEnv(tmpSettingsTo);
          }
          // Update env tempating config, since we just updated the config object, and it may have changed
          this._configureEnvTemplating(tmpSettingsTo);
          return tmpSettingsTo;
        }

        // Fill in settings gaps without overwriting settings that are already there
        fill(pSettingsFrom) {
          // If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
          let tmpSettingsFrom = typeof pSettingsFrom === 'object' ? pSettingsFrom : {};

          // do not mutate the From object property values
          let tmpSettingsFromCopy = JSON.parse(JSON.stringify(tmpSettingsFrom));
          this.settings = this._deepMergeObjects(tmpSettingsFromCopy, this.settings);
          return this.settings;
        }
      }
      ;

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new FableSettings(pSettings);
      }
      module.exports = FableSettings;
      module.exports.new = autoConstruct;
    }, {
      "./Fable-Settings-Default": 8,
      "./Fable-Settings-TemplateProcessor.js": 9,
      "fable-serviceproviderbase": 2
    }]
  }, {}, [7])(7);
});