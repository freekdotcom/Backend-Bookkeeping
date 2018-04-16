/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const Database = require('./../database/database.js').Database;
  const database = Database.getInstance();
  const {Log} = require('@aliceo2/aliceo2-gui');

  /**
   * The log entry model
   */
  class LogEntries {
    /**
     * The constructor of the log entry model
     * @param  {[type]} id  [description]
     * @param  {[type]} req [description]
     */
    constructor(id, req) {
      this.id = id;
      this.req = req;
    }

    /**
     * Gets a single log entry from the database
     * @param  {Function} callback
     * @return {[type]} returns a single log entry
     */
    getSingleLogEntry(callback) {
      let result = null;
      const getSingleLogEntryQuery = {
        name: 'fetch-log-entry',
        text: 'SELECT * FROM log_entry WHERE run_id = $1',
        values: [this.id]
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogEntryQuery, (err) => {
          if (err) {
            Log.error(err);
            reject(err);
          }
        });
        database.getClient().query(getSingleLogEntryQuery)
          .then((res) => {
            result = res.rows;
            callback(result);
            resolve(result);
          }).catch((e) => reject(e));
      });
    }

    /**
     * [getAllEntries description]
     * @param  {Function} callback [description]
     * @return {array}            returns a single log entry
     */
    getAllEntries(callback) {
      let results = null;
      const getAllEntriesQuery = {
        name: 'fetch-all-log-entries',
        text: 'SELECT * FROM log_entry'
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(getAllEntriesQuery, (err) => {
          if (err) {
            Log.error(err);
            reject(err);
          }
        });
        database.getClient().query(getAllEntriesQuery)
          .then((res) => {
            results = res.rows;
            callback(results);
            resolve(resolve);
          }).catch((ex) => reject(ex));
      });
    }

    /**
     * Posts an single log entry to the database
     * @param  {Function} callback [description]
     * @return {[type]} confirmation message to the client
     */
    postEntry(callback) {
      let result = null;
      const postLogEntryQuery = {
        name: 'post-log-entry',
        text: 'INSERT INTO log_entry(created, subsystem, class,' +
          'type, run, author, title, log_entry_text, follow_ups, saved_file_path) values ' +
          '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        values: [this.req.body.created, this.req.body.subsystem, this.req.body.class,
          this.req.body.type, this.req.body.run, this.req.body.author, this.req.body.title,
          this.req.body.logEntryText, this.req.body.followUps]
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryQuery, (err) => {
          if (err) {
            Log.error(err);
            reject(err);
          }
        });
        database.getClient().query(postLogEntryQuery)
          .then(() => {
            result = 'Entry has been added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) => reject(ex));
      });
    }
  }
  module.exports = {LogEntries};
})();
