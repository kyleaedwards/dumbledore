/**
 * Imports
 */
const fs = require('fs');
const path = require('path');
const Git = require('simple-git');

/**
 * Constants
 */

const ENCODING = 'utf8';

function Remote(key, repoURL, localPath) {
  this.markfile = path.resolve(__dirname, '../..', `.dumbledore-${key}`);
  this.cloned = true;
  if (!fs.existsSync(localPath))
    fs.mkdirSync(localPath);
  if (!fs.existsSync(path.resolve(localPath, '.git'))) {
    this.cloned = false;
  }
  this.repoURL = repoURL;
  this.localPath = localPath;
  this.git = Git(localPath);
};

Remote.prototype.clone = function clone(cb) {
  fs.readFile(this.markfile, ENCODING, (err, text) => {
    if (!err && text && text.trim() === this.repoURL && this.cloned) {
      this.pull(cb);
    } else {
      Git().clone(this.repoURL, this.localPath, {}, (err) => {
        if (err) {
          cb(err);
        } else {
          fs.writeFile(this.markfile, this.repoURL, ENCODING, (err) => {
            cb(err);
          });
        }
      });
    }
  });
};

Remote.prototype.pull = function pull(cb) {
  this.git.pull('origin', 'master', cb);
};

Remote.prototype.sync = function sync(cb) {
  this.git.status((diffErr, diff) => {
    if (diffErr) {
      console.log(diffErr);
      this.pull(cb);
    } else if (!diff.files.length) {
      this.pull(cb);
    } else {
      this.git.add('./*', (addErr) => {
        if (addErr) {
          console.log(addErr);
          return this.pull(cb);
        }
        this.git.commit('File sync at ' + Date.now(), (commitErr) => {
          if (commitErr) {
            console.log(commitErr);
            this.pull(cb);
          }
          this.git.push(['-u', 'origin', 'master'], (pushErr) => {
            if (pushErr) console.log(pushErr);
            this.pull(cb);
          });
        });
      });
    }
  });
};

module.exports = Remote;
