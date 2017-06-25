/**
 * Imports
 */
const dumbledore = require('./lib/dumbledore');
const utils = require('./lib/dumbledore/utils');
const chalk = require('chalk');

const KEY = process.env.DUMBLEDORE_KEY;

if (!KEY) {
  utils.logError(`index.js must be run with a key.`);
  process.exit();
}

utils.getProcesses((err, json) => {
  if (err) {
    console.log(err);
    return;
  }
  if (!json[KEY]) {
    const key = chalk.bold(KEY);
    utils.logError(`Could not start a Dumbledore instance with key ${key}. Please run \`dumbledore create ${KEY}\`.`);
  }
  dumbledore(KEY, json[KEY], (port, directory) => {
    const nm = chalk.bold('Dumbledore');
    const prt = chalk.bold(port);
    const dir = chalk.bold(directory);
    const key = chalk.bold(KEY);
    json[KEY].port = port;
    json[KEY].directory = directory;
    utils.writeProcesses(json, (err) => {
      utils.castSpell(`${nm} has started conjuring ${key} on port ${prt}. Watching on directory ${dir}.`);
    });
  });
});
