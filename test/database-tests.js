/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const TestDatabase = require('./test_database.js').TestDatabase;
const {Log} = require('@aliceo2/web-ui');
Log.configure({winston: {file: 'error.log'}});
const mocks = require('node-mocks-http');
const chai = require('chai');
const expect = chai.expect;
const logEntry = require('../app/models/log_entries');

let database;
let mockSingleLogEntryRequest;
let mockPostLogEntryRequest;
let mockBadPostRequest;

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

    database = TestDatabase.getInstance();
    database.getClient().query('DELETE FROM test.log_entry');
    database.getClient().query(postLogEntryDataQuery, postLogEntryDataValues)
      .catch((ex) => Log.error('Begin query could not succeed. Cause: ' + ex));
    mockSingleLogEntryRequest = mocks.createRequest({
      method: 'GET',
      url: '/api/:logEntryId',
      params: {
        logEntryId: 1
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
  });

  it('the singleton database is connected by executing a simple query', (done) => {
    const query = 'SELECT * FROM test.log_entry;';
    database.getClient().query(query).then(() => {
      done();
    }).catch((e) => Log.error(e));
  });


  it('should be able to retrieve a single entry', (done) => {
    const single = new logEntry.LogEntries(mockSingleLogEntryRequest);
    single.getLogEntry((result) => {
      expect(result[0]).to.not.be.null;
      expect(result[0]).to.have.a.property('created');
    }).catch((err) => Log.error(err));
    done();
  });

  it('should be able to add a log entry into the system', (done) => {
    const postEntry = new logEntry.LogEntries(mockPostLogEntryRequest);
    postEntry.postDataEntry((result) => {
      expect(result[0]).to.not.be.null;
      expect(result[0]).to.have.a.property('log_entry_id');
    }).catch((ex) => Log.error(ex));
    done();
  });

  it('should display an error when fields for the creation of a log entry are missing', (done) => {
    const postEntry = new logEntry.LogEntries(mockBadPostRequest);
    postEntry.postDataEntry((result) => {
      expect(result[0]).to.not.be.null;
    }).catch((ex) => {
      expect(ex).to.not.be.null;
    });
    done();
  });

  after(() => {
    // database.getClient().query('ALTER USER '
    //  +'cernfrederick SET SEARCH_PATH TO public').catch((ex)
    //  => Log.error('Database could not be closed. Cause: ' + ex));
    database.getClient().end();
  });
});
