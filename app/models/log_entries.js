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
  const fs = require('fs');
  const mkdirp = require('mkdirp');

  /**
   * The log entry model
   */
  class LogEntries {
    /**
     * The constructor of the log entry model
     * @param  {[type]} req [description]
     */
    constructor(req) {
      this.req = req;
    }

    /**
     * Gets a single log entry from the database
     * @param  {Function} callback
     * @return {[type]} returns a single log entry
     */
    async getSingleLogEntry(callback) {
      let result = null;
      const getSingleLogEntryQuery = 'SELECT log_entry FROM log_entry WHERE run_id = $1';
      const getSingleLogEntryValues = [this.req.params.id];
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogEntryQuery,
          getSingleLogEntryValues).then((res) => {
          result = res.rows;
          callback(result);
          resolve(result);
        }).catch(() => reject('The entry does not exist', 404));
      });
    }

    /**
     * Function to retrieve a single file from the database
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getSingleLogEntryFile(callback) {
      let result = null;
      const getSingleLogFileQuery = 'SELECT saved_file_path FROM log_entry WHERE run_id = $1';
      const getSingleLogFileValues = [this.req.params.id];
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogFileQuery,
          getSingleLogFileValues).then((res) => {
          result = res.rows[0];
          callback(result);
          resolve(result);
        }).catch(() => {
          reject('The file cannot be found.', 404);
        });
      });
    }

    /**
     * [getAllEntries description]
     * @param  {Function} callback [description]
     * @return {array}            returns a single log entry
     */
    getAllEntries(callback) {
      let results = null;
      const getAllEntriesQuery = 'SELECT log_entry FROM log_entry';
      return new Promise((resolve, reject) => {
        database.getClient().query(getAllEntriesQuery).then((res) => {
          results = res.rows;
          callback(results);
          resolve(results);
        }).catch(() => reject('There are no entries in the system.'));
      });
    }

    /**
     * Inserts the log entry into the database
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    postDataEntry(callback) {
      let result = null;
      const postLogEntryDataQuery = 'INSERT INTO log_entry(created, subsystem, class,' +
        'type, run, author, title, log_entry_text, follow_ups) values ' +
        '($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const postLogEntryDataValues = [this.req.body.created,
        this.req.body.subsystem, this.req.body.class,
        this.req.body.type, this.req.body.run, this.req.body.author,
        this.req.body.title,
        this.req.body.log_entry_text, this.req.body.followUps
      ];
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryDataQuery, postLogEntryDataValues)
          .then(() => {
            result = 'Entry has been added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) => reject('The entry could not be added to the system. Cause: '
            + ex, 500));
      });
    }

    /**
     * Adds the file path to the database.
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    async postFileEntry(callback) {
      let result = null;
      const filePath = await this.filePlacement()
        .catch(() => 'error with uploading the file.');
      const postLogEntryFileQuery = {
        name: 'post-file-log-entry',
        text: 'UPDATE log_entry SET saved_file_path=($1) WHERE run_id=($2)',
        values: [filePath, this.req.params.id]
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryFileQuery)
          .then(() => {
            result = 'Filepath has been added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) =>{
            reject('File could not be uploaded. Cause: ' + ex, 500);
          });
      });
    }

    /**
     * Method to place the file to another location on the server
     * @return {string} The new path of the file
     */
    filePlacement() {
      return new Promise((resolve, reject) => {
        const newFilePath = 'uploads/';
        mkdirp(newFilePath, (err) => {
          if (err) {
            reject('Could not move file. Cause: ' + err);
            // fs.unlink(this.req.file.path);
          }
          fs.rename(this.req.file.path, newFilePath + this.req.file.originalname);
          resolve(newFilePath);
        }).catch((ex) => {
          reject('Error with uploading the file. Cause: ' + ex);
        });
      });
    }
  }
  module.exports = {LogEntries};
})();
