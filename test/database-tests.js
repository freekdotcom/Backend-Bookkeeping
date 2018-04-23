/*
 * @Author: Frederick van der Meulen
 * @Date:   2018-04-23 11:15:32
 * @Last Modified by:   Frederick van der Meulen
 * @Last Modified time: 2018-04-23 13:46:07
 */

'use strict';
// const logEntry = require('../app/models/log_entries');
const Database = require('../app/database/database.js').Database;
const {Log} = require('@aliceo2/web-ui');

let database;

describe('Database', () => {
  before(() => {
    database = Database.getInstance();
  });

  it('the singleton database is connected by executing a simple query', (done) => {
    const query = 'SELECT * FROM log_entry';
    database.getClient().query(query).then(() => {
      done();
    }).catch((e) => Log.error(e));
  });

  after(() => {
    database.getClient().end();
  });
});
