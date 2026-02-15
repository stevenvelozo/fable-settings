# API Reference

## Class: FableSettings

Extends `CoreServiceProviderBase` from fable-serviceproviderbase.

```javascript
const libFableSettings = require('fable-settings');
let tmpSettings = new libFableSettings({ Product: 'MyApp' });
```

There is also a legacy factory method:

```javascript
let tmpSettings = libFableSettings.new({ Product: 'MyApp' });
```

## Constructor

```javascript
new FableSettings(pSettings, pServiceHash)
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pSettings` | object | No | Initial settings to merge with defaults |
| `pServiceHash` | string | No | Service hash for the provider base |

**Construction order:**

1. Calls parent constructor (`CoreServiceProviderBase`)
2. Initializes the environment variable template processor
3. Configures environment variable templating based on `pSettings.NoEnvReplacement`
4. Builds a fresh copy of default settings and stores it in `this.default`
5. Merges `pSettings` into defaults
6. Stores merged result as `this.base`
7. If `DefaultConfigFile` is set, loads and merges that JSON file
8. If `ConfigFile` is set, loads and merges that JSON file
9. Stores final result as `this.settings`

If either config file is missing or unreadable, a warning is logged to the console and execution continues.

## Instance Properties

### settings

- **Type:** object
- **Description:** The current merged configuration. This is the primary property you read from.

### default

- **Type:** object
- **Description:** A copy of the built-in default settings, created at construction time. Not modified after construction.

### base

- **Type:** object
- **Description:** The settings as they were after merging constructor parameters with defaults, before config files were loaded.

### settingsTemplateProcessor

- **Type:** FableSettingsTemplateProcessor
- **Description:** The template processor instance used for environment variable resolution.

### serviceType

- **Type:** string
- **Value:** `'SettingsManager'`
- **Description:** Identifies this service type in the Fable service registry.

## Instance Methods

### merge(pSettingsFrom, pSettingsTo)

Deep merge settings from one object into another.

```javascript
tmpSettings.merge({ NewKey: 'value' });
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pSettingsFrom` | object | No | The source object to merge from. Defaults to `{}` if invalid. |
| `pSettingsTo` | object | No | The target object to merge into. Defaults to `this.settings`. |

**Returns:** The merged target object.

**Behavior:**

- Creates a deep copy of `pSettingsFrom` before merging (source is never mutated)
- When both source and target have an object at the same key, the objects are merged recursively
- For all other types, the source value overwrites the target value
- After merging, resolves environment variables (unless `NoEnvReplacement` is true)
- Updates the `NoEnvReplacement` configuration after merge

### fill(pSettingsFrom)

Fill in missing settings without overwriting existing values.

```javascript
tmpSettings.fill({ MaybeNew: 'only if missing' });
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pSettingsFrom` | object | No | Object whose values fill gaps in `this.settings`. Defaults to `{}` if invalid. |

**Returns:** The updated `this.settings` object.

**Behavior:**

- Creates a deep copy of `pSettingsFrom` (source is never mutated)
- Merges `this.settings` into the copy, so existing settings take priority
- Assigns the result back to `this.settings`
- Does **not** resolve environment variables

### buildDefaultSettings()

Returns a fresh copy of the built-in default settings.

```javascript
let tmpDefaults = tmpSettings.buildDefaultSettings();
```

**Returns:** A new object with the default configuration:

```json
{
    "Product": "ApplicationNameHere",
    "ProductVersion": "0.0.0",
    "ConfigFile": false,
    "LogStreams": [{ "level": "trace" }]
}
```

Each call returns a new object (via `JSON.parse(JSON.stringify(...))`).

## Configuration Keys

These keys have special meaning when present in the settings:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `Product` | string | `"ApplicationNameHere"` | Application name |
| `ProductVersion` | string | `"0.0.0"` | Application version |
| `ConfigFile` | string or false | `false` | Path to a JSON file to load and merge |
| `DefaultConfigFile` | string | (none) | Path to a default JSON file, loaded before ConfigFile |
| `NoEnvReplacement` | boolean | (none) | If `true`, disables `${...}` environment variable resolution |
| `LogStreams` | array | `[{ "level": "trace" }]` | Log stream configuration for fable-log |

## Exports

### Default Export

The `FableSettings` class.

### FableSettings.new(pSettings)

Legacy factory function. Returns a new `FableSettings` instance.

```javascript
const libFableSettings = require('fable-settings');
let tmpSettings = libFableSettings.new({ Product: 'MyApp' });
```
