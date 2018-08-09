/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const TestDatabase = require('./test_database.js').TestDatabase;
const {log} = require('@aliceo2/web-ui');
log.configure({winston: {file: 'error.log'}});
const chai = require('chai');
const expect = chai.expect;
const logEntry = require('../app/models/log_entries');
const user = require('../app/models/users');
const mocks = require('node-mocks-http');

let database;
let mockSingleLogEntryRequest;
let mockPostLogEntryRequest;
let mockBadPostRequest;
let mockInjectionPostRequest;
let mockUserLoginRequest;
let mockBadUserLoginRequest;

describe('Database', () => {
  before(() => {
    const postLogEntryDataQuery = 'INSERT INTO test.log_entry(log_entry_id, created'+
      ', subsystem, class,' +
      'type, run, author, title, log_entry_text, follow_ups, ' +
      'interruption_duration, intervention_type) values ' +
      '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
    const postLogEntryDataValues = ['1', 'createdTime',
      'DAQ', 'MACHINE', 'RUN', '1', 'AlfredFutterkiste',
      'lorum ipsum', 'Lorum ipsum mipsum', 'Lorem ipsum', 'duration', 'Emergency'
    ];

    const postFileQuery = 'INSERT INTO test.file_paths(file_path, log_entry_id) values' +
      '($1, $2)';
    const postFileValues = ['upload/1/file.txt', '1'];

    database = TestDatabase.getInstance();
    database.getClient().query('DELETE FROM test.log_entry');
    database.getClient().query('DELETE FROM test.file_paths');
    database.getClient().query(postLogEntryDataQuery, postLogEntryDataValues)
      .catch((ex) => log.error('Begin query could not succeed. Cause: ' + ex));
 
    database.getClient().query(postFileQuery, postFileValues)
      .catch((ex) => log.error('Begin query could not succeed. Cause: ' + ex));

    mockSingleLogEntryRequest = mocks.createRequest({
      method: 'GET',
      url: '/api/:logEntryId',
      params: {
        logEntryId: 1
      }
    });

    mockUserLoginRequest = mocks.createRequest({
      method: 'POST',
      url: '/api/login',
      body: {
        email: 'walter.white@cern.ch',
        password: 'password'
      }
    });

    mockPostLogEntryRequest = mocks.createRequest({
      method: 'POST',
      url: '/api/run/:runId/:subsystem/:class/:user',
      params: {
        runId: 2,
        subsystem: 'WTL',
        class: 'MACHINE',
        user: 'AlfredFutterkiste'
      },
      body: {
        type: 'EOS',
        title: 'Test',
        log_entry_text: 'Testing the tests'
      }
    });
    mockInjectionPostRequest = mocks.createRequest({
      method: 'POST',
      url: '/api/run/:runId/:subsystem/:class/:user',
      params: {
        runId: 2,
        subsystem: 'WTL',
        class: 'MACHINE',
        user: 'AlfredFutterkiste'
      },
      body: {
        type: 'EOS',
        title: 'Test',
        log_entry_text: 'SELECT * FROM log_entry'
      }
    });

    mockBadPostRequest = mocks.createRequest({
      method: 'POST',
      url: '/api/run/:runId/:subsystem/:class/:user',
      params: {
        runId: 2,
        class: 'HUMAN'
      },
      body: {
        type: 'EOS',
        log_entry_text: 'I am incomplete.'
      }
    });

    mockFiledownloadRequest = mocks.createRequest({
      method: 'POST',
      url: '/:logEntryId/file',
      params: {
        logEntryId: 1
      }
    });

    mockBadFiledownloadRequest = mocks.createRequest({
      method: 'POST',
      url: '/:logEntryId/file',
      params: {
        logEntryId: 2
      }
    });

    mockBadUserLoginRequest = mocks.createRequest({
      method: 'POST',
      url: '/api/login',
      body: {
        email: 'walter.zhite@cern.ch',
        password: 'wrongPW'
      }
    });

    mockGetEntriesRequest = mocks.createRequest({
      method: 'GET',
      url: '/api/run/:runId/((s/:subsystem)|(u/:user)|(t/:type))',
      params: {
        runId: 2,
        subsystem: 'DAQ' 
      }
    });
  });

  it('the singleton database is connected by executing a simple query', (done) => {
    const query = 'SELECT * FROM test.log_entry;';
    database.getClient().query(query).then(() => {
      done();
    }).catch((e) => log.error(e));
  });

  it('should be able to retrieve a file from the database', (done) => {
    const file = new logEntry.LogEntries(mockFiledownloadRequest);
    file.getLogEntryFile((result) => {
      console.log(result)
        expect(result).to.not.be.null;
        expect(result).to.have.a.property('file_path');
        done();
      });
    });

  it('should be able to retrieve a single entry', (done) => {
    const single = new logEntry.LogEntries(mockSingleLogEntryRequest);
    single.getLogEntry((result) => {
      expect(result[0]).to.not.be.null;
      expect(result[0]).to.have.a.property('created');
    }).catch((err) => log.error(err));
    done();
  });

  it('should be able to add a log entry into the system', (done) => {
    const postEntry = new logEntry.LogEntries(mockPostLogEntryRequest);
    postEntry.postLogEntry((result) => {
      expect(result[0]).to.not.be.null;
      expect(result[0]).to.have.a.property('log_entry_id');
    }).catch((ex) => log.error(ex));
    done();
  });

   it('should display an error when a user tries to retrieve a file from a log entry that does not have a file', (done) => {
    const file = new logEntry.LogEntries(mockBadFiledownloadRequest);
    file.getLogEntryFile((result) => {
    }).catch((ex) => {
      console.log(ex);
      expect(ex).not.to.be.null;
      done();
    })
  });


  it('should display an error when fields for the creation of a log entry are missing', (done) => {
    const postEntry = new logEntry.LogEntries(mockBadPostRequest);
    postEntry.postLogEntry((result) => {
      expect(result[0]).to.not.be.null;
    }).catch((ex) => {
      expect(ex).to.not.be.null;
    });
    done();
  });

  it('should not let a SQL injection happen.', (done) => {
    const postEntry = new logEntry.LogEntries(mockInjectionPostRequest);
    postEntry.postLogEntry((result) => {
      expect(result[0]).to.not.be.null;
    }).catch((ex) => log.error(ex));
    done();
  });

  it('should allow a user to login', (done) => {
    const login = new user.User(mockUserLoginRequest);
    login.postUserAuthentication((result) => {
      expect(result).to.not.be.null;
      expect(result).to.have.a.property('JWToken');
      done();
    }).catch((ex) => log.error(ex));
  });

  it('should not let a user login if the email or password do not match', (done) => {
    const login = new user.User(mockBadUserLoginRequest);
    login.postUserAuthentication((result) => {
    }).catch((ex) => {
      expect(ex).not.to.be.null;
      done();
    });
  });

  it('should retrieve a file path from the database', (done) => {
    const getFile = new logEntry.LogEntries(mockFiledownloadRequest);
    getFile.getLogEntryFile((result) => {
      expect(result).not.to.be.null;
      done();
    }).catch((ex) => Log.error(ex));
  });
  
  //This test as last!
  it('should display an error message that there are no entries in the system', (done) => {
    database.getClient().query('DELETE FROM test.log_entry');
    const getEntries = new logEntry.LogEntries(mockGetEntriesRequest);
    getEntries.getEntries((result) => {
    }).catch((ex) => {
      expect(ex).not.to.be.null;
      expect(ex).to.include(404);
      done();
    });
  });

  after(() => {
    database.getClient().query('ALTER USER '
      +'cernfrederick SET SEARCH_PATH TO public').catch((ex) => {
      log.error('Database could not be closed. Cause: ' + ex)});
  });
});
