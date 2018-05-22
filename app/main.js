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
  const {HttpServer, Log} = require('@aliceo2/web-ui');
  const Config = require('./configuration_files/Config.js').Config;
  const config = Config.getInstance();
  const logEntry = require('./models/log_entries');
  const view = require('./views/log_entries');
  const user = require('./models/users');
  const fs = require('fs');

  /**
   * TODO : Implement once CORS works
   * sets the headers for CORS
   * @param  {response} res    Response
   * @param  {string} method The method used for CORS
   */
  // function setheaders(res, method) {
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  //   res.setHeader('Access-Control-Allow-Methods', method);
  //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //   res.setHeader('Access-Control-Allow-Credentials', true);
  // }
  //
  /**
   * Handles any error related to the end-points
   * @param  {res} res    the response
   * @param  {error} error the rejected promise
   */
  function errorHandling(res, error) {
    res.status(400);
    res.send(error);
  }

  let httpServer = new HttpServer(config.getServerConfiguration(),
    config.getJsonWebTokenConfiguration());


  // Gets a single entry from the database
  httpServer.get('/single/entry/:id', (req, res) => {
    const single = new logEntry.LogEntries(req);
    single.getSingleLogEntry((result) => {
      result = view.render(result);
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error);
    });
  });

  // Gets a single file from an entry from the database
  httpServer.get('/single/entry/file/:id', (req, res) => {
    const file = new logEntry.LogEntries(req);
    file.getSingleLogEntryFile((result) => {
      const filePath = result.saved_file_path;
      res.download(filePath, ((err) => {
        if (err) {
          Log.error(err);
        }
      }));
    }).catch((error) => {
      errorHandling(res, error);
    });
  });


  // Gets all the entries from the database
  httpServer.get('/all/entries', (req, res) => {
    const all = new logEntry.LogEntries(req);
    all.getAllEntries((result) => {
      result = view.render(result);
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error);
    });
  });

  // Posts an entry with all the data
  httpServer.post('/post/entry/data', (req, res) => {
    const post = new logEntry.LogEntries(req);
    post.postDataEntry((result) => {
      result = view.render(result);
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error);
    });
  });

  // Posts a file.
  httpServer.post('/upload/:id', (req, res) => {
    const postFile = new logEntry.LogEntries(req);
    postFile.postFileEntry((result) => {
      result = view.render(result);
      res.send(result);
    }).catch((error) => {
      fs.unlink(req.file.path);
      errorHandling(res, error);
    });
  });

  // Login for the users
  httpServer.post('/user/login/info', (req, res) => {
    const postUser = new user.User(req);
    postUser.postUserAuthentication((result) => {
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error);
    });
  });
})();
