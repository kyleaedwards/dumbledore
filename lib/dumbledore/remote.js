'use strict';

/**
 * Imports
 */
const fs = require('fs');
const path = require('path');
const Git = require('simple-git');
const ensure = require('./config');

/**
 * Constants
 */

const ENCODING = 'utf8';

function Remote(key, repoURL, localPath) {
  ensure((config) => {
    this.markfile = config.path(`.dumbledore-${key}`);
    this.cloned = true;
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath);
    }
    if (!fs.existsSync(path.resolve(localPath, '.git'))) {
      this.cloned = false;
    }
    this.repoURL = repoURL;
    this.localPath = localPath;
    this.git = Git(localPath);
  });
}

Remote.prototype.clone = function clone(cb) {
  fs.readFile(this.markfile, ENCODING, (readErr, text) => {
    if (!readErr && text && text.trim() === this.repoURL && this.cloned) {
      this.pull(cb);
    } else {
      Git().clone(this.repoURL, this.localPath, {}, (cloneErr) => {
        if (cloneErr) {
          cb(cloneErr);
        } else {
          fs.writeFile(this.markfile, this.repoURL, ENCODING, (writeErr) => {
            cb(writeErr);
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
          this.pull(cb);
        } else {
          this.git.commit(`File sync at ${Date.now()}`, (commitErr) => {
            if (commitErr) {
              console.log(commitErr);
              this.pull(cb);
            }
            this.git.push(['-u', 'origin', 'master'], (pushErr) => {
              if (pushErr) console.log(pushErr);
              this.pull(cb);
            });
          });
        }
      });
    }
  });
};

module.exports = Remote;
