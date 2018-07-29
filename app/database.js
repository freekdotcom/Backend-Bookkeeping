/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const Database = (() => {
  'use strict';
  let instance;

  /**
   * Initializes the database
   * @return {database} Returns the database singleton
   */
  function privateInit() {
    const pg = require('pg');
    const {Log} = require('@aliceo2/web-ui');
    const Config = require('./configuration_files/Config.js').Config;
    const config = Config.getInstance();
    const client = new pg.Client(config.getDatabaseConfiguration());
    client.connect()
      .then(() => Log.debug('Database connected.'))
      .catch((e) => Log.error(e.stack));

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
module.exports = {Database};
