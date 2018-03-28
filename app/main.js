/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const bodyParser = require('body-parser').json();
  const rest = require('./REST_api/rest');
  const asyncHandler = require('express-async-handler');
  const multer = require('multer');
  const fs = require('fs');
  const {HttpServer, Log, JwtToken} = require('@aliceo2/aliceo2-gui');
  //  const path = require('path');
  const config = require('./configuration_files/config.json');
  const upload = multer({
    dest: 'uploads/' // this saves your file into a directory called "uploads"
  });

  const httpServer = new HttpServer(config.httpConf, config.jwtConf);
  const jwt = new JwtToken(config.jwtConf);
  const token = jwt.generateToken(1, 'code-example');
  jwt.verify(token).then(() => {
    Log.info('The token is verified');
  }).catch(() => {
    Log.error('The token could not be verified');
  });


  /**
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  httpServer.get('/log/entries', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    const JSONResult = await rest.getAllResponses();
    res.send(JSONResult);
  });

  /**
   * Gets a single log entry.
   * @param  {[type]} '/log/entry/:id' [description]
   * @param  {[type]} bodyParser       [description]
   * @param  {[type]} async            (req,         res [description]
   * @return {[type]}                  [description]
   */
  httpServer.get('/log/entry/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const JSONResult = await rest.getSingleResponse(req.params.id);
    res.send(JSONResult);
  });
  /**
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  httpServer.post('/log/entries', bodyParser, upload.single('file'),
    asyncHandler(async (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      if (req.file != null) {
        try {
          let file = __dirname + '/' + req.file.filename;
          fs.rename(req.file.path, file, async function(err) {
            if (err) {
              Log.error(err);
            } else {
              const JSONResult = await rest.postResponse(req.body.created, req.body.subsystem,
                req.body.class, req.body.type, req.body.run, req.body.author, req.body.title,
                req.body.log_entry_text, req.body.followUps, file);
              res.setHeader('Content-Type', 'application/json');
              res.send(JSONResult);
            }
          });
        } catch (ex) {
          throw (ex);
        }
      }
    }));

  /**
   * This function closes the connection with the server
   */
  function closeServer() {
    httpServer.getServer.close();
  }

  module.exports = {httpServer, closeServer};
})();
