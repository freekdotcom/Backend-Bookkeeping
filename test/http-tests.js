/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

'use strict';

const {HttpServer, JwtToken} = require('@aliceo2/web-ui');
const assert = require('assert');
const http = require('http');
const url = require('url');
const Config = require('../app/configuration_files/Config.js').Config;
const config = Config.getInstance();

let httpServer;
const jwt = new JwtToken(config.getJsonWebTokenConfiguration());
const token = jwt.generateToken(0, 'test', 1);

describe('REST API', () => {
  before(() => {
    httpServer = new HttpServer(config.getServerConfiguration(),
      config.getJsonWebTokenConfiguration());
    httpServer.get('/get-request', (req, res) => res.json({ok: 1}));
    httpServer.get('/get-file', (req, res) => res.download('uploads/daq/foo.txt'));
    httpServer.get('/get-bad-file', (req, res) => res.download('uploads/das/foo.txt'));
  });

  it('should retrieve the user details when "/" is used', (done) => {
    http.get('http://localhost:' + config.getServerConfiguration().port +
      '/', (res) => {
      assert.strictEqual(res.statusCode, 302);
      const parsedUrl = new url.URL(res.headers.location, 'http://localhost');
      parsedUrl.searchParams.has('personid');
      parsedUrl.searchParams.has('name');
      parsedUrl.searchParams.has('token');
      done();
    });
  });

  it('should give an error when the token has not been given with the request',
    (done) => {
      http.get('http://localhost:' + config.getServerConfiguration().port +
        '/api/get-request', (res) => {
        assert.strictEqual(res.statusCode, 403);
        done();
      });
    });

  it('should let a get request go through', (done) => {
    http.get('http://localhost:' + config.getServerConfiguration().port +
      '/api/get-request?token=' + token, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });
  });

  it('should download a file', (done) => {
    http.get('http://localhost:' + config.getServerConfiguration().port +
      '/api/get-file?token=' + token, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });
  });

  it('should throw an error when the file path is wrong', (done) => {
    http.get('http://localhost:' + config.getServerConfiguration().port +
      '/api/get-bad-file?token=' + token, (res) => {
      assert.strictEqual(res.statusCode, 500);
      done();
    });
  });

  after(() => {
    httpServer.getServer.close();
  });
});
