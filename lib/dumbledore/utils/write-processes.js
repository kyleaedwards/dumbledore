/**
 * Imports
 */
const fs = require('fs');
const path = require('path');

const PROCFILE = path.resolve(__dirname, '../../..', 'config.json');
const ENCODING = 'utf8';
const NOOP = () => {};

module.exports = (json, cb) => {
  const callback = typeof cb === 'function' ? cb : NOOP;
  const file = JSON.stringify(json, null, 2);
  fs.writeFile(PROCFILE, file, ENCODING, callback);
};
