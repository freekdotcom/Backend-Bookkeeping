/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const Database = require('./../database/database.js').Database;
  const database = Database.getInstance();
  const {JwtToken, Log} = require('@aliceo2/web-ui');
  const Config = require('./../configuration_files/Config.js').Config;
  const config = Config.getInstance();
  const jwt = new JwtToken(config.getJsonWebTokenConfiguration());
  const bcrypt = require('bcrypt');

  /**
   * The user model class
   */
  class User {
    /**
     * The constructor of the user model
     * @param  {request} req The given request
     */
    constructor(req) {
      this.req = req;
    }

    /**
     * The autentication method for the users. TODO: Implement SAMS
     * @param  {return} callback Returns the JWToken
     * @return {JWToken} The JSONWebToken
     */
    postUserAuthentication(callback) {
      let result = undefined;
      const userAuthenticationQuery = 'SELECT email, password FROM users.users WHERE email = $1';
      const userAuthenticationQueryValues = [this.req.body.email];
      return new Promise((resolve, reject) => {
        if (this.req.body.email == undefined ||
          this.req.body.password == undefined) {
          reject(['No email address or password is filled in. Please try again.', 403]);
        }
        database.getClient().query(userAuthenticationQuery,
          userAuthenticationQueryValues).then((res) => {
          result = res.rows;
          if (result[0].password == undefined) {
            reject(['The password or emailaddress could not be found. Please try again.', 403]);
          }
          bcrypt.compare(this.req.body.password, result[0].password, (err, res) => {
            if (res) {
              const token = jwt.generateToken(res.id, res.name);
              callback(token);
              resolve(token);
            } else {
              Log.error(err);
              reject(['The password or emailaddress could not be found. Please try again', 403]);
            }
          });
        }).catch((err) => {
          Log.error('Internal failure. Cause: ' + err);
          reject('Internal failure. Cause: ' + err, 500);
        });
      });
    }
  }
  module.exports = {User};
})();
