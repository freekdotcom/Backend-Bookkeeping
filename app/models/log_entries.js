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
  // const path = require('path');

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
      const getSingleLogEntryQuery = {
        name: 'fetch-log-entry',
        text: 'SELECT * FROM log_entry WHERE run_id = $1',
        values: [this.req.params.id]
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(getSingleLogEntryQuery, (err) => {
          if (err) {
            Log.error(err);
            reject(err);
          }
        });
        database.getClient().query(getSingleLogEntryQuery).then((res) => {
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
      const getAllEntriesQuery = {name: 'fetch-all-log-entries', text: 'SELECT * FROM log_entry'};
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
          resolve(resolve);
        }).catch((ex) => reject(ex));
      });
    }

    /**
     * Posts an single log entry to the database
     * @param  {Function} callback [description]
     * @return {[type]} confirmation message to the client
     */
    // async postEntry(callback) {
    //   let result = null;
    //   let filePath = await this.fileStorage(this.req);
    //   const postLogEntryQuery = {
    //     name: 'post-log-entry',
    //     text: 'INSERT INTO log_entry(created, subsystem, class,' +
    //       'type, run, author, title, log_entry_text, follow_ups, saved_file_path) values ' +
    //       '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    //     values: [this.req.body.created, this.req.body.subsystem, this.req.body.class,
    //       this.req.body.type, this.req.body.run, this.req.body.author, this.req.body.title,
    //       this.req.body.logEntryText, this.req.body.followUps, filePath
    //     ]
    //   };
    //   return new Promise((resolve, reject) => {
    //     database.getClient().query(postLogEntryQuery, (err) => {
    //       if (err) {
    //         Log.error(err);
    //         reject(err);
    //       }
    //     });
    //     database.getClient().query(postLogEntryQuery)
    //       .then(() => {
    //         result = 'Entry has been added to the database';
    //         callback(result);
    //         resolve(result);
    //       }).catch((ex) => reject(ex));
    //   });
    // }
    /**
     * Description TO BE FURTHER WRIITEN DOWN LATER
     * @param  {Function} callback TO BE FURTHER WRIITEN DOWN LATER
     * @return {arrau}            TO BE FURTHER WRIITEN DOWN LATER
     */
    postDataEntry(callback) {
      let result = null;
      // console.log(this.req.body);
      const postLogEntryDataQuery = {
        name: 'post-log-entry',
        text: 'INSERT INTO log_entry(created, subsystem, class,' +
          'type, run, author, title, log_entry_text, follow_ups) values ' +
          '($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [this.req.body.created, this.req.body.subsystem, this.req.body.class,
          this.req.body.type, this.req.body.run, this.req.body.author,
          this.req.body.title,
          this.req.body.logEntryText, this.req.body.followUps]
      };
      return new Promise((resolve, reject) => {
        database.getClient().query(postLogEntryDataQuery, (err) => {
          if (err) {
            Log.error(err);
            reject(err);
          }
        });
        database.getClient().query(postLogEntryDataQuery)
          .then(() => {
            result = 'Entry has been added to the database';
            callback(result);
            resolve(result);
          }).catch((ex) => reject(ex));
      });
    }

    /**
     * Method that handles the storage of files. It stores the file into a path
     * and returns the path of the file into the database
     * To be further developed due to middleware issues
     * @param  {request object} req The request object filled with data
     * @return {string}     path of the file
     */
    // fileStorage(req) {
    //   const uploadDir = path.join(__dirname, '/..', 'test', '/uploads/');
    //   if (req.file == null){
    //     return '';
    //   }
    //   let form = new formidable.IncomingForm();
    //   form.multiple = true;
    //   form.keepExtension = true;
    //   form.uploadDir = uploadDir;
    //   return new Promise((resolve, reject) => {
    //     form.parse(req, (err) => {
    //       if (err){
    //        reject(err);
    //      }

    //       Log.debug('No error detected. File is stored at: ' + req.file.path);
    //       resolve(file.path);
    //     });
    //     form.on('fileBegin', ((name, ) => {
    //       const reqFileName = req.file.name.split('.');
    //       req.file.path = path.join(uploadDir, '${fileName}');
    //     }));
    //   });
    // }
  }
  module.exports = {LogEntries};
})();
