/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */

const Config = (() => {
  'use strict';
  let instance;

  function privateInit() {
    const config = require('./config.json');

    return {
      getDatabaseConfiguration: () => {
        return config.databaseIP;
      },

      getServerConfiguration: () => {
      	return config.httpConf;
      },

      getJsonWebTokenConfiguration: () => {
      	return config.jwtConf;
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
  }

})();

module.exports = {Config};
