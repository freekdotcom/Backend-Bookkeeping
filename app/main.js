/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const {HttpServer} = require('@aliceo2/web-ui');
  const Config = require('./configuration_files/Config.js').Config;
  const config = Config.getInstance();

  //  const jwt = new JwtToken(config.);
  const logEntry = require('./models/log_entries');
  const view = require('./views/log_entries');

  /*  const token = jwt.generateToken(1, 'code-example');
  jwt.verify(token).then(() => {
    Log.info('The token is verified');
  }).catch(() => {
    Log.error('The token could not be verified');
  });
  config.jwtToken = token; */

  let httpServer = new HttpServer(config.getServerConfiguration(),
    config.getJsonWebTokenConfiguration());

  // Gets a single entry from the database
  httpServer.get('/single/entry/:id', (req, res) => {
    const single = new logEntry.LogEntries(req);
    single.getSingleLogEntry((result) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      result = view.render(result);
      res.send(result);
    });
  });

  // Gets all the entries from the database
  httpServer.get('/all/entries', (req, res) => {
    const all = new logEntry.LogEntries(req);
    all.getAllEntries((result) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      result = view.render(result);
      res.send(result);
    });
  });

  httpServer.post('/post/entry/data', (req, res) => {
    const post = new logEntry.LogEntries(req);
    post.postDataEntry((result) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      result = view.render(result);
      res.send(result);
    });
  });

  // httpServer.post('/post/entry', (req, res) => {
  //   const post = new logEntry.LogEntries(0, req);
  //   post.postEntry((result) => {
  //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  //     res.setHeader('Access-Control-Allow-Methods', 'POST');
  //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //     res.setHeader('Access-Control-Allow-Credentials', true);
  //     result = view.render(result);
  //     res.send(result);
  //   });
  // });
})();
