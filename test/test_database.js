/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const TestDatabase = (() => {
  'use strict';
  let instance;

  /**
   * Initializes the database
   * @return {database} Returns the database singleton
   */
  function privateInit() {
    const pg = require('pg');
    const {Log} = require('@aliceo2/web-ui');
    const Config = require('../app/configuration_files/Config.js').Config;
    const config = Config.getInstance();
    const client = new pg.Client(config.getDatabaseConfiguration());
    client.connect()
      .then(() => {
        client.query('ALTER USER cernfrederick SET SEARCH_PATH TO test;')
          .then(() => Log.debug('Test database connected.'))
          .catch((err) => 'Could not set Search path to test. Cause: ' + err);
      }).catch((e) => Log.error(e.stack));

    return {
      getClient: function() {
        return client;
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
module.exports = {TestDatabase};
