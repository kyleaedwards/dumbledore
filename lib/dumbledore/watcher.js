'use strict';

/**
 * Imports
 */
const chokidar = require('chokidar');
const path = require('path');
const utils = require('./utils');

/**
 * Create Chokidar file watcher with optional callbacks.
 *
 * @param   {String|Regexp}   filePattern   File pattern or directory to watch
 * @param   {Object}          options       KV pairs of callbacks
 * @returns {Object}          Chokidar watcher object
 */
module.exports = function createWatcher(filePattern, options) {
  const updated = options.updated || utils.noop;
  const removed = options.removed || utils.noop;
  const error = options.error || utils.noop;
  const ready = options.ready || utils.noop;

  return chokidar.watch(filePattern, {
    ignored: (p) => {
      if (p.indexOf('npm-debug') !== -1) return true;
      if (p.indexOf('.git') !== -1) return true;
      return /(^[.#]|(?:__|~)$)/.test(path.basename(p));
    },
    persistent: true,
  }).on('add', updated)
    .on('change', updated)
    .on('unlink', removed)
    .on('error', error)
    .on('ready', ready);
};
