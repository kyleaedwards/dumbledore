'use strict';

/**
 * Imports
 */
const readline = require('readline');

/**
 * Constants
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

module.exports = function prompt(q, reg, cb) {
  let callback = cb;
  let regex = reg;
  if (typeof regex === 'function') {
    callback = regex;
    regex = null;
  }
  rl.question(`${q}: `, (answer) => {
    if (!regex || regex.test(answer)) {
      callback(answer);
    } else {
      process.stdout.write(`Invalid ${q.slice(0, 1).toLowerCase()}${q.slice(1)}\n`);
      prompt(q, regex, callback);
    }
  });
};

module.exports.end = () => {
  rl.close();
};
