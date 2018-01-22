(()=> {
  'use strict';
  const express = require('express');
  const app = express();
  const winston = require('winston');
  app.get('/:test/:id', (req, res) => {
    res.end(JSON.stringify({
      hello: req.params.id,
      foo: req.params.test
    }));
  });
  app.listen(8080, () => {
    winston.log('info', 'listening');
  });
})();
