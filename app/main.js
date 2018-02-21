(() => {
  'use strict';
  const bodyParser = require('body-parser').json();
  const express = require('express');
  const app = express();
  const winston = require('winston');
  const rest = require('./rest');
  const database = require('./database/database');

  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.get('/log/entries', bodyParser, async (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    const JSONResult = await database.GetAllLogEntries();
    console.log(JSONResult);
    res.send(JSONResult);
  });

  /**
   * Gets a single log entry.
   * @param  {[type]} '/log/entry/:id' [description]
   * @param  {[type]} bodyParser       [description]
   * @param  {[type]} async            (req,         res [description]
   * @return {[type]}                  [description]
   */
  app.get('/log/entry/:id', bodyParser, async (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    const JSONResult = await database.GetSingleLogEntry(req.params.id);
    res.send(JSONResult);
  });

  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.post('/log/entries', bodyParser, async (req, res) => {
    const JSONResult = await database.PostLogEntry(req.body.bunches, 
      req.body.scheme, req.body.fill, req.body.energyPerBeam, 
      req.body.intensityPerBeam);
    res.setHeader('Content-Type', 'application/json');

    res.send(JSONResult);
  });

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
