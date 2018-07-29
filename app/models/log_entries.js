/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const Database = require('./../database.js').Database;
  const database = Database.getInstance();
  const fs = require('fs');
  const mkdirp = require('mkdirp');
  const {Log} = require('@aliceo2/web-ui');
  const dateTime = require('node-datetime');

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
      const getSingleLogEntryQuery = 'SELECT created, '+
      'subsystem, class, type, run, author, title, log_entry_text,'+
      ' follow_ups, saved_file_path, quality_flag, interruption_duration,'
      'intervention_type FROM log_entry WHERE run_id = $1';
      const getSingleLogEntryValues = [this.req.params.id];
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogEntryQuery,
          getSingleLogEntryValues).then((res) => {
          result = res.rows;
          callback(result);
          resolve(result);
        }).catch((err) => reject(['The entry does not exist. Cause: ' + err, 404]));
      });
    }

    /**
     * Function to retrieve a single file from the database
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    getSingleLogEntryFile(callback) {
      let result = null;
      const getSingleLogFileQuery = 'SELECT file_path FROM file_paths ' +
      'WHERE log_entry_id = $1';
      const getSingleLogFileValues = [this.req.params.id];
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogFileQuery,
          getSingleLogFileValues).then((res) => {
          result = res.rows[0];
          callback(result);
          resolve(result);
        }).catch(() => {
          reject(['The file cannot be found. Cause: ' + err, 404]);
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
      const getAllEntriesQuery = 'SELECT run_id, created, '+
      'subsystem, class, type, run, author, title, log_entry_text,'+
      ' follow_ups, saved_file_path, quality_flag, interruption_duration,' + 
      'intervention_type FROM log_entry ORDER BY run_id';
      return new Promise((resolve, reject) => {
        database.getClient().query(getAllEntriesQuery).then((res) => {
          results = res.rows;
          callback(results);
          resolve(results);
        }).catch(() => reject(['There are no entries in the system. Cause: ' + err, 404]));
      });
    }

    /**
     * Inserts the log entry into the database
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    async postDataEntry(callback) {
      let result = null;
      let createdTime = await this.getCurrentTime();
      const postLogEntryDataQuery = 'INSERT INTO log_entry(created, subsystem, class,' +
        'type, run, author, title, log_entry_text, follow_ups, ' +
        'interruption_duration, intervention_type) values ' +
        '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
      const postLogEntryDataValues = [createdTime,
        this.req.body.subsystem, this.req.body.class,
        this.req.body.type, this.req.body.run, this.req.body.author,
        this.req.body.title,
        this.req.body.log_entry_text, this.req.body.followUps,
        this.req.body.interruption_duration, this.req.body.intervention_type
      ];
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryDataQuery, postLogEntryDataValues)
          .then((res) => {
            // result = 'Entry has been added to the database';
            result = res.rows;
            callback(result);
            resolve(result);
          }).catch((ex) => reject(['The entry could not be added to the system. Cause: '
            + ex, 500]));
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
        .catch(() => callback('error with uploading the file.'));
      const postLogEntryFileQuery = {
        name: 'post-file-log-entry',
        text: 'INSERT INTO file_paths(file_path, log_entry_id) VALUES ' +
        '($1, $2)',
        values: [filePath, this.req.params.id]
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryFileQuery)
          .then(() => {
            result = 'Filepath has been added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) =>{
            reject(['File could not be uploaded. Cause: ' + ex, 500]);
          });
      });
    }

    /**
     * Returns the current time the log entry is created.
     * @return {String} The time and year as a string.
     */
    getCurrentTime(){
      return new Promise((resolve, reject) => {
        const dt = dateTime.create();
        const formatted = dt.format('Y-m-d H:M:S');
        resolve(formatted);
      }).catch((ex) => {
        Log.error('Time could not be retrieved. Cause: ' + ex);
        reject(['Time could not be retrieved. Cause: ' + ex, 500])
      })
      
    }

    /**
     * Method to place the file to another location on the server
     * @return {string} The new path of the file
     */
    filePlacement() {
      return new Promise((resolve, reject) => {
        const newFilePath = 'upload/' + this.req.params.id + '/';
        mkdirp(newFilePath, (err) => {
          if (err) {
            Log.error(err);
            reject(['Could not move file. Cause: ' + err, 202]);
          }
          let newFile = newFilePath + this.req.file.originalname;
          fs.rename(this.req.file.path, newFile, (err) => {
            if (err) {
              Log.error(err);
              reject(['Error with uploading the file. Cause: ' + err, 202]);
            }
          });
          resolve(newFile);
        });
      }).catch((ex) => {
        Log.error(ex);
      });
    }
  }
  module.exports = {LogEntries};
})();
