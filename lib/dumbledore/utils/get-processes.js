/**
 * Imports
 */
const fs = require('fs');
const path = require('path');

const PROCFILE = path.resolve(__dirname, '../../..', 'config.json');
const ENCODING = 'utf8';
const NOOP = () => {};

module.exports = (cb) => {
  const callback = typeof cb === 'function' ? cb : NOOP;
  fs.readFile(PROCFILE, ENCODING, (err, file) => {
    let json = {};
    if (err && err.code !== 'ENOENT') {
      return callback(err);
    }
    try {
      json = JSON.parse(file);
    } catch (e) {}
    cb(null, json);
  });
};
