/*
 * @Author: Frederick van der Meulen
 * @Date:   2018-04-23 09:36:22
 * @Last Modified by:   Frederick van der Meulen
 * @Last Modified time: 2018-04-23 09:42:58
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
