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
  const {Log} = require('@aliceo2/web-ui');
  // const formidable = require('formidable');
  // const fs = require('fs');

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
    getSingleLogEntry(callback) {
      let result = null;
      const getSingleLogEntryQuery = 'SELECT * FROM log_entry WHERE run_id = $1';
      const getSingleLogEntryValues = [this.req.params.id];
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogEntryQuery,
          getSingleLogEntryValues, (err) => {
            if (err) {
              Log.error(err);
              reject(err);
            }
          });
        database.getClient().query(getSingleLogEntryQuery,
          getSingleLogEntryValues).then((res) => {
          result = res.rows;
          callback(result);
          resolve(result);
        }).catch(() => reject('The entry does not exist'));
      });
    }

    /**
     * [getAllEntries description]
     * @param  {Function} callback [description]
     * @return {array}            returns a single log entry
     */
    getAllEntries(callback) {
      let results = null;
      const getAllEntriesQuery = 'SELECT * FROM log_entry';
      return new Promise((resolve, reject) => {
        database.getClient().query(getAllEntriesQuery, (err) => {
          if (err) {
            Log.error(err);
            reject(err);
          }
        });
        database.getClient().query(getAllEntriesQuery).then((res) => {
          results = res.rows;
          callback(results);
          resolve(results);
        }).catch((ex) => reject(ex));
      });
    }

    /**
     * Description TO BE FURTHER WRIITEN DOWN LATER
     * @param  {Function} callback TO BE FURTHER WRIITEN DOWN LATER
     * @return {arrau}            TO BE FURTHER WRIITEN DOWN LATER
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
        this.req.body.log_entry_text, this.req.body.followUps];
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryDataQuery,
          postLogEntryDataValues, (err) => {
            if (err) {
              Log.error(err);
              callback(err);
              reject(err);
            }
          });
        database.getClient().query(postLogEntryDataQuery, postLogEntryDataValues)
          .then(() => {
            result = 'Entry has been added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) => reject(ex));
      });
    }

    /**
     * [postFileEntry description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    async postFileEntry(callback) {
      let result = null;
      const filePath = await this.fileStorage();
      const postLogEntryFileQuery = {
        name: 'post-file-log-entry',
        text: 'UPDATE log_entry SET saved_file_path=($1) WHERE run_id=($2)',
        values: [filePath, this.req.params.id]
      };
      return new Promise((resolve, reject) => {
        if (filePath == undefined) {
          Log.error('File is undefined');
          reject('File is undefined');
        }
        database.getClient().query(postLogEntryFileQuery)
          .then(() => {
            result = 'Filepaths are added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) => reject(ex));
      });
    }

    // /**
    //  * Method to handle storing files into the server
    //  * @return {[type]} [description]
    //  */
    // fileStorage() {
    //   let form = new formidable.IncomingForm();
    //   return new Promise((resolve, reject) => {
    //     if (this.req.files == undefined) {
    //       Log.error('No File found');
    //       return undefined;
    //     }
    //     form.parse(this.req, (err, fields, files) => {
    //       const oldPath = this.req.files.file.path;
    //       const newPath = './uploads/files/' + this.req.params.id + '/' +
    //         this.req.files.file.name;
    //       fs.rename(oldPath, newPath, (err) => {
    //         if (err) {
    //           reject(err);
    //         }
    //         const result = newPath;
    //         resolve(result);
    //       });
    //     });
    //   });
    // }
  }
  module.exports = {LogEntries};
})();
