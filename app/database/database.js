/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const getQuery = {
  name: 'fetch-all-log-entries',
  text: 'SELECT * FROM log_entry LIMIT 10'
};

const Database = (() => {
  'use strict';
  let instance;

  /**
   * Initializes the database
   * @return {database} Returns the database singleton
   */
  function privateInit() {
    const pg = require('pg');
    const {Log} = require('@aliceo2/aliceo2-gui');
    const config = require('./../configuration_files/config.json');
    const conString = config.databaseIP;
    const client = new pg.Client(conString);
    client.connect();
    return {
      getAllLogEntries: function() {
        let results = [];
        return new Promise((resolve, reject) => {
          try {
            client.query(getQuery, (err) => {
              if (err) {
                Log.error(err);
                reject(err);
              }
            });
            client.query(getQuery)
              .then((res) => {
                results = res.rows;
                client.end();
                resolve(results);
              })
              .catch((e) => reject(e));
          } catch (ex) {
            reject(ex);
          }
        });
      },

      getSingleLogEntry: function(id) {
        let result = null;
        const getSingleLogEntryQuery = {
          name: 'fetch-log-entry',
          text: 'SELECT * FROM log_entry WHERE run_id = $1',
          values: [id]
        };
        return new Promise((resolve, reject) => {
          client.query(getSingleLogEntryQuery, (err) => {
            if (err) {
              Log.error(err);
              reject(err);
            }
          });
          client.query(getSingleLogEntryQuery)
            .then((res) => {
              result = res.rows;
              client.end();
              resolve(result);
            }).catch((e) => reject(e));
        });
      },

      postLogEntry: function(created, subsystem, Class, type, run, author, title,
        logEntryText, followUps, filePath) {
        const postLogEntryQuery = {
          name: 'post-log-entry',
          text: 'INSERT INTO log_entry(created, subsystem, class,' +
            'type, run, author, title, log_entry_text, follow_ups, saved_file_path) values ' +
            '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
          values: [created, subsystem, Class, type, run,
            author, title, logEntryText, followUps, filePath]
        };

        return new Promise((resolve, reject) => {
          // filling in the req params
          client.query(postLogEntryQuery, (err) => {
            if (err) {
              Log.error(err);
              reject(err);
            }
          });
          client.query(postLogEntryQuery).then((res) => {
            res.end('Log entry is added to database');
            client.end();
            resolve(res);
          }).catch((e) => reject(e));
        });
      }
    };
  }
  return {
    getInstance: () => {
      if (!instance) {
        instance = privateInit();
      }
      return instance;
    }
  };
})();
module.exports = {Database};
