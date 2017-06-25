const chalk = require('chalk');

const PREFIX = chalk.red.bold('ERROR:');

module.exports = (msg) => {
  process.stdout.write(`${PREFIX} ${msg}\n`);
};
