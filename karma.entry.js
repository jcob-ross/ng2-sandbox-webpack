require('core-js/es6/array');
require('core-js/es6/map');
require('core-js/es6/set');
require('core-js/es6/string');
require('core-js/es6/symbol');
require('core-js/es7/reflect');
require('zone.js');

// Specify platform and application providers
var browser = require('angular2/platform/testing/browser');
var testing = require('angular2/testing');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_APPLICATION_PROVIDERS
);

// Recursively discover and load all spec files
var context = require.context('./src', true, /\.spec\.ts/);
context.keys().forEach(context);

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
