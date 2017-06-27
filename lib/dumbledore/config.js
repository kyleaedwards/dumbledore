'use strict';

/**
 * Imports
 */
const path = require('path');
const os = require('os');
const fs = require('fs');

/**
 * Constants
 */
const DIRECTORY = path.resolve(os.homedir(), '.dumbledore');
const PROCFILE = path.resolve(DIRECTORY, 'config.json');
const ENCODING = 'utf8';
const NOOP = () => {};

function write(json, cb) {
  const callback = typeof cb === 'function' ? cb : NOOP;
  const file = JSON.stringify(json, null, 2);
  fs.writeFile(PROCFILE, file, ENCODING, callback);
}

function read(cb) {
  const callback = typeof cb === 'function' ? cb : NOOP;
  fs.readFile(PROCFILE, ENCODING, (err, file) => {
    let json = {};
    if (err && err.code !== 'ENOENT') {
      callback(err);
    } else {
      try {
        json = JSON.parse(file);
      } catch (e) {
        console.log(e);
      }
      cb(null, json);
    }
  });
}

function getPath() {
  return path.resolve.apply(null, [DIRECTORY, ...arguments]);
}

function ensure(cb) {
  if (!fs.existsSync(DIRECTORY)) {
    fs.mkdirSync(DIRECTORY);
    fs.mkdirSync(getPath('docs'));
    fs.mkdirSync(getPath('logs'));
  }
  cb({
    path: getPath,
    write,
    read,
  });
}

module.exports = ensure;
