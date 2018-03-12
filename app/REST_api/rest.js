/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const database = require('./../database/database');


  async function getAllResponses() {
    let allEntries = await database.getAllLogEntries();
    return allEntries;
  }

  /**
   * Method for retrieving the correct user based on the Id
   * @param  {int} id - The id of the user
   * @return {string} the user thing
   */
  async function getSingleResponse(id) {
    let oneEntry = await database.getSingleLogEntry(id);
    return oneEntry;
  }

  function filePromise(file, multerFile) {
    return new Promise((resolve, reject) => {
      try {
        if (file == null) {
          res.end('File does not exist.');
        }

        let file = __dirname + '/' + file.filename;
        fs.rename(file, multerFile, function(err) {
          if (err) {
            console.log(err);
            res.send(500);
          } else {
            resolve(true);
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * @param  {int} id - The new id of the User
   * @param  {string} name - The name of the new User
   * @param  {int} age - The age of the new User
   * @return {string} - Returns the updated JSON with the users
   */
  async function postResponse(created, subsystem, Class, type, run,
    author, title, logEntryText, followUps, filepath) {
    let newEntriesList = await database.postLogEntry(created, subsystem, Class, type, run,
      author, title, logEntryText, followUps, filepath);
    return newEntriesList;
  }

  module.exports = { getAllResponses, getSingleResponse, postResponse, filePromise };
})();