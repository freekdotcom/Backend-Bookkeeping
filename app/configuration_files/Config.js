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
    const {Log} = require('@aliceo2/web-ui');
    const config = require('/etc/jiskerfet/jiskerfet-api/config.json');

    if(config == null | config == undefined){
      Log.error('The configuration file could not be found.')
    }

    return {
      getDatabaseConfiguration: () => {
        if(config.databaseIP == null){
          Log.error('The database IP could not be found.');
        }
        return config.databaseIP;
      },

      getServerConfiguration: () => {
        if(config.httpConf == null){
          Log.error('The server configuration could not be found.');
        }
        const args = process.argv.slice(2);
        config.httpConf.port = args[0];
        if(args[0] == null){
          config.httpConf.port = 8080;
        }
      	return config.httpConf;
      },

      getJsonWebTokenConfiguration: () => {
      	if(config.jwtConf == null){
          Log.error('The JSON Web Token configuration could not be found.');
        }
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
