/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
*
* This software is distributed under the therms of the
* GNU General Public Licence version 3 (GPL) version 3,
* copied verbatim in the file "LICENSE"
*
*/
(() =>{
  'use strict';
  const jsonUsers = require('./users.json');

  /**
  * Method for retrieving the correct user based on the Id
  * @param  {int} id - The id of the user
  * @return {string} the user thing
  */
  function getResponse(id) {
    let jsonUser;
    jsonUsers.Users.forEach(function(user) {
      if (user.id == id) {
        jsonUser = user;
      }
    });

    return jsonUser;
  }

  /**
  * @param  {int} id - The new id of the User
  * @param  {string} name - The name of the new User
  * @param  {int} age - The age of the new User
  * @return {string} - Returns the updated JSON with the users
  */
  function postResponse(id, name, age) {
    jsonUsers.Users.forEach(function(user) {
      if (user.id == id) {
        return 'The user already exists';
      }
    });

    jsonUsers.Users.push({'id': id, 'name': name, 'age': age});
    return jsonUsers.Users;
  }

  /**
  * @param {int} id - The id of the user
  * @return {string} The Json with the updated data
  */
  function putResponse(id) {
    let jsonUser;
    jsonUsers.Users.forEach(function(user) {
      if (user.id == id) {
        jsonUser = user;
      }
    });
    return jsonUser;
  }

  /**
  * @param  {int} id - The id of the user that's going to be deleted
  * @return {string} - Returns the updated JSON with the users
  */
  function deleteResponse(id) {
    for (const i in jsonUsers.Users) {
      if (i == id) {
        jsonUsers.Users.splice(0, id);
        return jsonUsers.Users;
      }
    }
  }

  module.exports = {getResponse, postResponse, putResponse, deleteResponse};
})();
