const fs = require('fs');

module.exports = function markTodo(file, index, checked) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, text) => {
      let todo = 0;
      const data = text.replace(/\[[x ]?\]/gi, (box) => {
        if (todo == index) {
          todo++;
          return checked ? '[x]' : '[ ]';
        }
        todo++;
        return box;
      });
      fs.writeFile(file, data, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};
