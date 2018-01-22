(()=> {
  'use strict';
  const express = require('express');
  const app = express();
  const winston = require('winston');
  const myHello = require('./foo');
  app.get('/:test/:id', (req, res) => {
    res.end(JSON.stringify({
      hello: myHello.hello(req.params.id),
      foo: myHello.hello(req.params.test)
    }));
  });
  app.listen(8080, () => {
    winston.log('info', 'listening');
  });
})();
