const chalk = require('chalk');
const wrapAnsi = require('wrap-ansi');

const LINE = '====================================================================';
const MAX_WIDTH = LINE.length;

module.exports = (body, spell) => {
  if (!spell) spell = [
    'Accio Server',
    'Expecto Patronum',
    'Expelliarmus',
    'Petrificus Totalus',
    'Priori Incantato',
    'Wingardium Leviosa',
  ][Math.floor(6 * Math.random())];
  const parsedBody = wrapAnsi(body, MAX_WIDTH - 1).split('\n').map(n => ` ${n}`);
  process.stdout.write(['', LINE].concat(parsedBody, [
    '',
    ` (∩｀-´)⊃━☆ﾟ.*･｡ﾟ ${chalk.italic(`"${spell}!"`)}`,
    LINE,
    '',
    '',
  ]).join('\n'));
};
