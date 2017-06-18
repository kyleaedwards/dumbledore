/**
 * Imports
 */
const fs = require('fs');
const path = require('path');
const hermione = require('./lib/hermione');
const prompt = require('./lib/hermione/prompt');

const ENCODING = 'utf8';
const CONFIG = path.resolve(__dirname, 'config.json');
const done = (port, directory) => {
  const spell = [
    'Accio Server',
    'Expecto Patronum',
    'Expelliarmus',
    'Petrificus Totalus',
    'Priori Incantato',
    'Wingardium Leviosa',
  ][Math.floor(6 * Math.random())];

  process.stdout.write([
    '',
    '====================================================================',
    ` \u001b[1mHermione\u001b[22m has started conjuring on port \u001b[1m${port}\u001b[22m.`,
    ` Watching on directory \u001b[1m${directory}\u001b[22m.`,
    '',
    ` (∩｀-´)⊃━☆ﾟ.*･｡ﾟ \u001b[3m"${spell}!"\u001b[23m`,
    '====================================================================',
    '',
  ].join('\n'));
};

fs.readFile(CONFIG, ENCODING, (err, json) => {
  let config;
  if (!err) {
    try {
      config = JSON.parse(json);
    } catch (e) {}
  }
  if (config && config.repoURL) {
    hermione(config, done);
  } else {
    config = {};
    process.stdout.write([
      '',
      '====================================================================',
      ` \u001b[1mHermione\u001b[22m requires a quick setup to generate a config.json file.`,
      ` You are free to write your own or follow the prompts below.`,
      '',
      ` (∩｀-´)⊃━☆ﾟ.*･｡ﾟ \u001b[3m"Accio config!"\u001b[23m`,
      '====================================================================',
      '',
      'Press ^C at any time to quit.',
      '',
    ].join('\n'));
    prompt('Project title', /./, (title) => {
      prompt('Github repository URL', /\.git\/?/gi, (repoURL) => {
        config = { title, repoURL };
        fs.writeFile(CONFIG, JSON.stringify(config, null, 2), ENCODING, (err) => {
          if (err) {
            console.log(err);
            process.exit();
          }
          hermione(config, done);
        });
      });
    });
  }
});
