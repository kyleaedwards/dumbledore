/**
 * Imports
 */
const express = require('express');
const utils = require('./utils');
const markTodo = require('./mark-todo');

const layout = (req, res, x) => (req.query.json ? res.json(x) : res.render('layout', x));
const redirect = (req, res, u) => res.redirect(req.query.json ? `${u}?json=1` : u);

module.exports = function createRouter(app, store) {
  app.use(express.static('assets'));
  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json' && req.method.toLowerCase() === 'post') {
      let data = "";
      req.on('data', (chunk) => data += chunk);
      req.on('end', () => {
        try {
          req.body = JSON.parse(data);
        } catch (e) {
          req.body = data;
        }
        next();
      });
    } else {
      next();
    }
  });

  app.get('/', (req, res) => {
    let body;
    let title;
    if (req.query.s) {
      body = store.searchUriMap(req.query.s);
      title = `Search: ${req.query.s}`;
    } else {
      body = store.getUriMap();
      title = 'Table of Contents';
    }
    store.searchUriMap(req.query.s);
    layout(req, res, {
      title: 'Index',
      body: utils.renderTree(body, title, 1),
      showSearch: true,
    });
  });

  app.post('/todo', (req, res) => {
    const file = req.body.file;
    const index = req.body.index;
    const status = req.body.status;
    markTodo(file, index, status).then(() => {
      res.json({ success: true });
    }).catch((err) => {
      res.json({ success: false, err });
    });
  });

  app.get('/tag/:tag', (req, res, next) => {
    const tag = req.params.tag;
    const posts = store.getFilesByTag(tag);
    if (posts) {
      layout(req, res, {
        title: utils.titleize(tag),
        body: utils.renderTree(posts, utils.titleize(tag), 1),
      });
    } else {
      next();
    }
  });

  app.use((req, res, next) => {
    const uri = decodeURI(req.path);
    const file = store.getFileByUri(uri);
    const headers = req.headers;
    if (file) {
      if (headers.referer && headers.referer.indexOf(headers.host) !== -1) {
        file.back = headers.referer;
      } else {
        file.back = '/';
      }
      layout(req, res, {
        title: file.title,
        body: utils.renderFile(file),
      });
    } else {
      next();
    }
  });

  app.use((req, res) => redirect(req, res, '/'));
};
