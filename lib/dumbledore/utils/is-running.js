'use strict';

/**
 * Imports
 */
const childProcess = require('child_process');

module.exports = (pid, cb) => {
  childProcess.exec(`ps -p ${pid} | grep /index.js`, (err, stdout, stderr) => {
    const isRunning = typeof stdout === 'string' && !!stdout.trim().length;
    cb(err || stderr, isRunning);
  });
};
