'use strict';

/**
 * Imports
 */
const fs = require('fs');

/**
 * Constants
 */
const ENCODING = 'utf8';

module.exports = function markTodo(file, index, checked) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, ENCODING, (err, text) => {
      let todo = 0;
      const data = text.replace(/\[[x ]?\]/gi, (box) => { // eslint-disable-line no-useless-escape
        if (todo === parseInt(index, 10)) {
          todo += 1;
          return checked ? '[x]' : '[ ]';
        }
        todo += 1;
        return box;
      });
      fs.writeFile(file, data, ENCODING, (writeErr) => {
        if (writeErr) {
          reject(writeErr);
        } else {
          resolve();
        }
      });
    });
  });
};
