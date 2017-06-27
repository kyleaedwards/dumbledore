'use strict';

/**
 * Imports
 */
const chalk = require('chalk');
const wrapAnsi = require('wrap-ansi');

/**
 * Constants
 */
const PREFIX = chalk.red.bold('ERROR:');
const MAX_WIDTH = 68;

/**
 * Wraps cli text output in a Dumbledore-styled wrapper.
 */
module.exports.spell = (body, spellName, skipWrap) => {
  let spell = spellName;
  if (!spell) {
    spell = [
      'Accio Server',
      'Expecto Patronum',
      'Expelliarmus',
      'Petrificus Totalus',
      'Priori Incantato',
      'Wingardium Leviosa',
    ][Math.floor(6 * Math.random())];
  }
  let parsedBody = body;
  if (!skipWrap) {
    parsedBody = wrapAnsi(body, MAX_WIDTH);
  }
  parsedBody = parsedBody.split('\n');
  while (parsedBody[parsedBody.length - 1].trim() === '') {
    parsedBody.pop();
  }
  parsedBody.map(n => `${n}`);
  process.stdout.write([''].concat(parsedBody, [
    '',
    `(∩｀-´)⊃━☆ﾟ.*･｡ﾟ ${chalk.italic(`"${spell}!"`)}`,
    '',
    '',
  ]).join('\n'));
};

module.exports.error = (msg) => {
  process.stdout.write(`${PREFIX} ${msg}\n`);
};
