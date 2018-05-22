/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

// const logEntry = require('../app/models/log_entries');
const Database = require('../app/database/database.js').Database;
const {Log} = require('@aliceo2/web-ui');
const mocks = require('node-mocks-http');
const chai = require('chai');
const expect = chai.expect;
const logEntry = require('../app/models/log_entries');

let database;
let mockAllRequest;
let mockSingleRequest;

describe('Database', () => {
  before(() => {
    database = Database.getInstance();
    mockAllRequest = mocks.createRequest({
      method: 'GET',
      url: '/api/mock/get/all/entries'
    });
    mockSingleRequest = mocks.createRequest({
      method: 'GET',
      url: '/api/mock/get/single/entry/:id',
      params: {
        id: 6
      }
    });
  });

  it('the singleton database is connected by executing a simple query', (done) => {
    const query = 'SELECT * FROM pg_catalog.pg_tables;';
    database.getClient().query(query).then(() => {
      done();
    }).catch((e) => Log.error(e));
  });

  it('should be able to retrieve all the entries', (done) => {
    const all = new logEntry.LogEntries(mockAllRequest);
    all.getAllEntries((result) => {
      expect(result).to.not.be.null;
      done();
    });
  });

  it('should be able to retrieve a single entry', (done) => {
    const single = new logEntry.LogEntries(mockSingleRequest);
    single.getSingleLogEntry((result) => {
      expect(result).to.not.be.null;
      done();
    });
  });


  after(() => {
    database.getClient().end();
  });
});
