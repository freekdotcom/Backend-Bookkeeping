/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const {HttpServer, JwtToken} = require('@aliceo2/web-ui');
const assert = require('assert');
const request = require('request');
const _ = require('underscore');
const Config = require('../app/configuration_files/Config.js').Config;
let config = Config.getInstance();
const responseExamples = require('./responses_examples.json');

let httpServer;
const jwt = new JwtToken(config.getJsonWebTokenConfiguration());
const token = jwt.generateToken(0, 'test', 1);

/**
 * Test function to see how the error message method works
 * @param  {[type]} res       [description]
 * @param  {[type]} error     [description]
 * @param  {[type]} errorCode [description]
 */
function errorHandling(res, error, errorCode) {
  res.status(errorCode);
  const resArray = [];
  const JsonErrorMessage = ({
    error_code: errorCode,
    error_message: error
  });
  resArray.push(JsonErrorMessage);
  res.send(resArray);
}

describe('REST API TESTS', () => {
  before(() => {
    httpServer = new HttpServer(config.getServerConfiguration(),
      config.getJsonWebTokenConfiguration());
    httpServer.get('/run/:runId/((s/:subsystem)|(u/:user)|(t/:type))', (req, res) => {
      const params = [req.params.runId, req.params.user];

      res.send(params);
    });
    httpServer.get('/:logEntryId/file', (req, res) => res.download('uploads/daq/5/foo.txt'));
    httpServer.get('/:logEntryId', (req, res) => {
      const filteredResponse = _.where(responseExamples,
        {'log_entry_id': Number(req.params.logEntryId)});
      if (filteredResponse === undefined || filteredResponse.length == 0) {
        errorHandling(res, 'The entry could not be retrieved', 404);
      } else {
        res.send(filteredResponse);
      }
    });

    httpServer.post('/:logEntryId/upload/:filename', (req, res) => {
      const regex = /^(.*\.(?!(gif|GIF|png|PNG|jpeg|JPEG|txt|TXT|doc|DOC)$))?[^.]*$/i;
      if (regex.test(req.params.filename)) {
        errorHandling(res, 'The file extension is not allowed', 403);
      } else {
        res.send('File is allowed');
      }
    });
  });

  describe('GET end-points', () => {
    it('should be able to retrieve a single entry based upon ID', (done) => {
      request('http://localhost:' + config.getServerConfiguration().port
        + '/api/1?token=' + token, (error, res, body) => {
        const parsedBody = JSON.parse(body);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(parsedBody[0].log_entry_id, 1);
        done();
      });
    });

    it('should return a json with an error message that the log entry does not exist', (done) => {
      request('http://localhost:' + config.getServerConfiguration().port
        + '/api/1111?token=' + token, (error, res, body) => {
        const parsedBody = JSON.parse(body);
        assert.strictEqual(res.statusCode, 404);
        assert.strictEqual(parsedBody[0].error_message, 'The entry could not be retrieved');
        done();
      });
    });

    it('should be able to receive the parameters from the URL', (done) => {
      request('http://localhost:' + config.getServerConfiguration().port +
        '/api/run/1/u/Guus?token=' + token, (error, res, body) => {
        const parsedBody = JSON.parse(body);
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(parsedBody[0], '1');
        assert.strictEqual(parsedBody[1], 'Guus');
        done();
      });
    });

    it('Should deny access to the application when the token is not present', (done) => {
      request('http://localhost:' + config.getServerConfiguration().port +
        '/api/run/1/u/Guus?token=', (error, res, body) => {
        const parsedBody = JSON.parse(body);
        assert.strictEqual(parsedBody.message, 'JsonWebTokenError');
        done();
      });
    });

    it('Should not allow a file with the wrong extension', (done) => {
      request.post('http://localhost:' + config.getServerConfiguration().port +
        '/api/1/upload/badfile.sh?token=' + token, (error, res, body) => {
        const parsedBody = JSON.parse(body);
        assert.strictEqual(res.statusCode, 403);
        assert.strictEqual(parsedBody[0].error_message, 'The file extension is not allowed');
        done();
      });
    });
  });

  after(() => {
    httpServer.getServer.close();
  });
});
