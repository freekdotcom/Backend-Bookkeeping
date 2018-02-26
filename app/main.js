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
  const express = require('express');
  const app = express();
  const winston = require('winston');
  const rest = require('./rest');
  const asyncHandler = require('express-async-handler');
  const database = require('./database/database');

  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.get('/log/entries', bodyParser, asyncHandler(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const JSONResult = await database.getAllLogEntries();
    res.send(JSONResult);
  }));

  /**
   * Gets a single log entry.
   * @param  {[type]} '/log/entry/:id' [description]
   * @param  {[type]} bodyParser       [description]
   * @param  {[type]} async            (req,         res [description]
   * @return {[type]}                  [description]
   */
  app.get('/log/entry/:id', bodyParser, asyncHandler(async (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    const JSONResult = await database.getSingleLogEntry(req.params.id);
    res.send(JSONResult);
  }));

  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.post('/log/entries', bodyParser, asyncHandler(async (req, res) => {
    const JSONResult = await database.postLogEntry(req.body.bunches,
      req.body.scheme, req.body.fill, req.body.energy_per_beam,
      req.body.intensityPerBeam);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSONResult);
  }));

  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.delete('/:id', (req, res) => {
    res.end(JSON.stringify({
      user: rest.deleteResponse(req.params.id)
    }));
  });


  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.listen(8080, () => {
    winston.log('info', 'listening');
  });
})();
