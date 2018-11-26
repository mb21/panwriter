// Node.js APIs are available in this preload process.

const fixPath = require('fix-path');

process.once('loaded', () => {
  fixPath();
  global.appMain = require('../../output/AppRenderer');
  require('./Exporter');
  global.platform = process.platform;
});
