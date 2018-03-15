/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
'use strict';
const pg = require('pg');
const config = require('./../configuration_files/config.js');
const conString = config.databaseIP;

/**
 * [getAllLogEntries description] testing the database function
 * @return {array} All the results from the database.
 */
function getAllLogEntries() {
  const results = [];
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise((resolve, reject) => {
    try {
      query = client.query('SELECT * FROM log_entry');
      query.on('row', (row) => {
        results.push(row);
      });

      query.on('end', () => {
        client.end();
        resolve(results);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

/**
 * [getSingleLogEntry description]
 * @param {[type]} runID [description]
 * @return {[type]} the log entry
 */
function getSingleLogEntry(runID) {
  let result = null;
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise((resolve, reject) => {
    try {
      query = client.query('SELECT * FROM log_entry WHERE run_id = $1', [runID]);
      query.on('row', (row) => {
        result = row;
      });

      query.on('end', () => {
        client.end();
        resolve(result);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

/**
 * [postLogEntry description]
 * @param  {[type]} created      [description]
 * @param  {[type]} subsystem    [description]
 * @param  {[type]} Class        [description]
 * @param  {[type]} type         [description]
 * @param  {[type]} run          [description]
 * @param  {[type]} author       [description]
 * @param  {[type]} title        [description]
 * @param  {[type]} logEntryText [description]
 * @param  {[type]} followUps    [description]
 * @param {[type]} filePath The path to the file saved with the log entry.
 * @return {[type]}              [description]
 */
function postLogEntry(created, subsystem, Class, type, run, author, title,
  logEntryText, followUps, filePath) {
  const results = [];
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise((resolve, reject) => {
    // filling in the req params
    try {
      client.query('INSERT INTO log_entry(created, subsystem, class,' +
        'type, run, author, title, log_entry_text, follow_ups, saved_file_path) values ' +
        '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [created, subsystem, Class,
        type, run, author, title, logEntryText, followUps, filePath
      ]);
      // proof that it succeeded.
      query = client.query('SELECT * FROM log_entry');
      query.on('row', (row) => {
        results.push(row);
      });

      query.on('end', () => {
        client.end();
        resolve(results);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}
module.exports = {getAllLogEntries, getSingleLogEntry, postLogEntry};
