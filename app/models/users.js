// /*
//  * @Author: Frederick van der Meulen
//  * @Date:   2018-04-24 09:20:44
//  * @Last Modified by:   Frederick van der Meulen
//  * @Last Modified time: 2018-04-26 09:06:06
//  */
// (() => {
//   'use strict';
//   const Database = require('./../database/database.js').Database;
//   const database = Database.getInstance();
//   const { Log, JwtToken } = require('@aliceo2/web-ui');
//   const Config = require('./../configuration_files/Config.js').Config;
//   const config = Config.getInstance();

//   const passwordHash = require('password-hash');
//   const user = require('./../configuration_files/UserExample.json');


//   class User {

//     constructor(req) {
//       this.req = req;
//     }

//     postUserAuthentication(callback) {
//       return new Promise((resolve, reject) => {
//         if (this.req.body == undefined) {
//           callback(['The body is undefined!', false]);
//           reject(['The password or the user name is missing!', false]);
//         }

//         if (this.req.body.name == undefined || this.req.body.password == undefined) {
//           callback(['The password or the user name is missing!', false]);
//           reject(['The password or the user name is missing!', false]);
//         }
//         if (this.req.body.name == user.user.name
//           && passwordHash.verify(this.req.body.password, user.user.password)) {
//           const jwt = new JwtToken(config.getJsonWebTokenConfiguration());
//           const token = jwt.generateToken(user.id, user.name);
//           jwt.verify(token).then(() => {
//             Log.info('The token is verified');
//             callback([token, true]);
//             resolve([token, true]);
//           }).catch(() => {
//             Log.error('The token could not be verified');
//             reject('Token not verified')
//           });

//         } else {

//         }
//       })

//       //
//     }
//   }
//   module.exports = { User };
// })();
