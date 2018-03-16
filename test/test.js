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
  const httpServer = require('../app/main.js').httpServer;
  const testToken = '?personid=0&name=Anonymous&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJpZCI6MCwidXNlcm5hbWUiOiJBbm9ueW1vdXMiLCJhY2Nlc3MiOjAsImlhdCI6MTUyMTE5MjMxOSwiZXhwIjo'
  + 'xNTIxMjc4NzE5LCJpc3MiOiJvMi11aSJ9.R7uAMYirOYBRoFictZ3DdXhx4XoFl9rKjUkyiWHopy8';
  const expect = chai.expect;
  let chaiHttp = require('chai-http');
  chai.use(chaiHttp);

  describe('REST GET Requests', () => {
    after(() => {
      httpServer.getServer.close();
    });
    describe('Get all entries ', () => {
      it('should get all the entries successfully', (done) => {
        chai.request('http://localhost:8080')
          .get('/api/log/entries' + testToken)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
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
  });
})();
