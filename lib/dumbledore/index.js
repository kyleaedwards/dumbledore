'use strict';

/**
 * Imports
 */
const opn = require('opn');
const express = require('express');
const createWatcher = require('./watcher');
const createReader = require('./reader');
const createAnalyzer = require('./analyzer');
const createStore = require('./store');
const createRouter = require('./router');
const SocketIO = require('socket.io');
const Remote = require('./remote');
const ensure = require('./config');

/**
 * Constants
 */
const roomMap = new WeakMap();
const DIRECTORY = 'docs';
const PORT = process.env.PORT || 0;
const SYNC_DELAY = 180000; // 3 minutes

/**
 * Dumbledore reads everything and determines useful relationships between
 * the content.
 *
 * @constructor
 * @param   {String|Regexp}   filePattern   File pattern or directory to watch
 */
module.exports = function dumbledore(key, conf, cb) {
  ensure((config) => {
    const app = express();
    const directory = config.path(DIRECTORY, `${key}/`);
    const remote = new Remote(key, conf.repoURL, directory);

    const preClone = Date.now();
    remote.clone(() => {
      console.log(`Repository cloned in ${Date.now() - preClone}ms`);
      const readFile = createReader(directory);
      const store = createStore();
      const analyzer = createAnalyzer(store);

      createRouter(app, store);

      const server = app.listen(PORT, () => {});

      server.on('listening', () => {
        const port = server.address().port;
        if (typeof cb === 'function') {
          cb(port, directory);
        }
        opn(`http://localhost:${port}`);
      });

      const io = SocketIO(server);

      io.on('connection', (socket) => {
        socket.emit('grab_room');
        socket.on('room', (room) => {
          const currentRoom = roomMap.get(socket);
          if (currentRoom) {
            socket.leave(currentRoom);
          }
          roomMap.set(socket, `dumbledore${room}`);
          socket.join(`dumbledore${room}`);
        });
        socket.on('disconnect', () => {});
      });

      let filesToStore = 0;
      createWatcher(directory, {
        updated: (file) => {
          console.log(`Updated file: ${file}`);
          filesToStore += 1;
          readFile(file)
            .then((content) => {
              store.updateFile(content);
              filesToStore -= 1;
              const interval = setInterval(() => {
                if (!filesToStore) {
                  analyzer.linkContent(content);
                  io.to(`dumbledore${content.uri}`).emit('page_updated');
                  io.to('dumbledore/').emit('page_updated');
                  content.tags.forEach((tag) => {
                    io.to(`dumbledore/tag/${tag}`).emit('page_updated');
                  });
                  clearInterval(interval);
                }
              }, 100);
            }).catch(() => {
              filesToStore -= 1;
            });
        },
        removed: (file) => {
          const content = store.getFile(file);
          analyzer.unlinkContent(file);
          store.removeFile(file);
          io.to(`dumbledore${content.uri}`).emit('page_removed');
          io.to('dumbledore/').emit('page_updated');
          content.tags.forEach((tag) => {
            io.to(`dumbledore/tag/${tag}`).emit('page_updated');
          });
        },
      });

      if (!process.env.DUMBLEDORE_NOSYNC) {
        setInterval(() => {
          const now = Date.now();
          remote.sync(() => {
            console.log(`Synched in ${Date.now() - now}ms`);
          });
        }, SYNC_DELAY);
      } else {
        console.log('NOSYNC flag detected. Will not sync to Github.');
      }
    });
  });
};
