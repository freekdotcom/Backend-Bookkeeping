(()=> {
  'use strict';
  const express = require('express');
  const app = express();
  const winston = require('winston');
  const rest = require('./rest');
  const myHello = require('./foo');

  app.get('/:id', (req, res) => {
    console.log(rest.getResponse(req.params.id));
    res.end(JSON.stringify({
      user : rest.getResponse(req.params.id)
    }));
  });

  app.post('/:id/:name/:age', (req, res) => {
    res.end(JSON.stringify({
      user : rest.postResponse(req.params.id, req.params.name, req.params.age)
    }));

  });

  app.delete('/:id', (req, res) => {
    res.end(JSON.stringify({
      user : rest.deleteResponse(req.params.id)
    }));
  });



  app.listen(8080, () => {
    winston.log('info', 'listening');

  });
})();