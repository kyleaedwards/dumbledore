'use strict';

/**
 * Imports
 */
const dumbledore = require('./lib/dumbledore');
const ensure = require('./lib/dumbledore/config');
const chalk = require('chalk');

/**
 * Constants
 */
const LABEL = process.env.DUMBLEDORE_LABEL;
const label = chalk.bold(LABEL);

if (!LABEL) {
  console.log('index.js must be run with a label.');
  process.exit();
}

ensure((config) => {
  config.read((err, json) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!json[LABEL]) {
      console.log(`Could not start a Dumbledore instance with label ${label}. Please run \`dumbledore create ${LABEL}\`.`);
    }
    dumbledore(LABEL, json[LABEL], (port, directory) => {
      const nm = chalk.bold('Dumbledore');
      const prt = chalk.bold(port);
      const dir = chalk.bold(directory);
      json[LABEL].port = port;
      json[LABEL].directory = directory;
      config.write(json, () => {
        console.log(`${nm} has started conjuring ${label} on port ${prt}. Watching on directory ${dir}.`);
      });
    });
  });
});
