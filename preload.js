// Node.js APIs are available in this preload process.

process.once('loaded', () => {
  global.appMain = require('./output/Main');
  require('./src/js/Exporter');
});