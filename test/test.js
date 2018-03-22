/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const chai = require('chai');
  const HttpServer = require('../app/main.js');
  const Log = require('@aliceo2/aliceo2-gui');
  const expect = chai.expect;
  const Pool = require('pg-pool');
  let pool;
  const config = require('../app/configuration_files/config.js');
  const testConfig = require('../app/configuration_files/test_config.js');
  const chaiHttp = require('chai-http');
  chai.use(chaiHttp);

  describe('REST GET Requests', () => {
    before(() => {
      pool = new Pool(testConfig);
    });
    after(() => {
      HttpServer.closeServer();
    });

    describe('Get all entries ', () => {
      it('should get all the entries successfully', (done) => {
        chai.request('http://localhost:8080')
          .get('/api/log/entries?token=' + config.token)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;

            done();
          });
      });
    });
    describe('Get all entries no token', () => {
      it('should not allow access when the token is not provided', (done) => {
        chai.request('http://localhost:8080')
          .get('/api/log/entries')
          .end((err, res) => {
            expect(res).to.have.status(403);
            done();
          });
      });
    });
    describe('Get single entry', () => {
      it('should return a single', async (done) => {
        pool.connect().then((client) => {
          client.query('SELECT * FROM log_entry').then((res) => {
            client.release();
            Log.info(res);
          }).catch((e) =>{
            client.release();
            Log.warn(e.message);
          });
        });
        done();
      });
    });
  });
})();
