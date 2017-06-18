/**
 * Imports
 */
const fs = require('fs');
const Simplegit = require('simple-git');

/**
 * Constants
 */
const markfile = './.hermione';

function Remote(repoURL, localPath) {
  this.cloned = true;
  if (!fs.existsSync(localPath))
    fs.mkdirSync(localPath);
  if (!fs.existsSync(`${localPath}/.git`)) {
    this.cloned = false;
  }
  this.repoURL = repoURL;
  this.localPath = localPath;
  this.git = Simplegit(localPath);
};

Remote.prototype.clone = function clone(cb) {
  fs.readFile(markfile, 'utf8', (err, text) => {
    if (!err && text && text.trim() === this.repoURL && this.cloned) {
      this.pull(cb);
    } else {
      Simplegit().clone(this.repoURL, this.localPath, {}, (err) => {
        if (err) {
          cb(err);
        } else {
          fs.writeFile(markfile, this.repoURL, 'utf8', (err) => {
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
