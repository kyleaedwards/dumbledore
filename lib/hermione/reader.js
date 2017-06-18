const fs = require('fs');
const fm = require('front-matter');
const marked = require('marked');
const path = require('path');
const uuidV4 = require('uuid/v4');

module.exports = function createReader(base) {
  return function readFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }

        const content = fm(data);
        const uri = path.resolve(file).replace(base, '').replace(/\.md$/gi, '');

        if (!content || !content.body) {
          return reject('Empty file. Skipping archive.');
        }

        const attrs = content.attributes || {};
        const tags = attrs.tags ? attrs.tags.split(',').map(t => t.trim()) : [];

        let todo = 0;
        const body = content.body.replace(/- \[[x ]?\]([^\n]+)/gi, (box, text) => {
          const data = `class="todo" data-todo-index="${todo}" data-todo-file="${file}"`;
          const checked = box[3] === 'x' ? 'checked="checked"' : '';
          const output = `- <label><input type="checkbox" ${checked} ${data} /><span class="todo-label">${text}</span></label>`;
          todo++;
          return output;
        });

        return resolve({
          id: uuidV4(),
          body: marked(body),
          title: attrs.title || uri,
          tags,
          file,
          uri,
        });
      });
    });
  };
};
