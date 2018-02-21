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
  app.get('/log/entries', bodyParser, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const JSONResult = database.getInformationFromDatabase();
    res.send(JSONResult);
  });

  /**
  * @param  {[type]}
  * @param  {[type]}
  * @return {[type]}
  */
  app.post('/:id/:name/:age', (req, res) => {
    res.end(JSON.stringify({
      user: rest.postResponse(req.params.id, req.params.name, req.params.age)
    }));
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
