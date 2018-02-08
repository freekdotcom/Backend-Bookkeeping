(() =>{
  'use strict';
  const jsonUsers = require('./users.json');

  /**
  * Method for retrieving the correct user based on the Id
  * @param  {int} id - The id of the user
  * @return {string} the user thing
  */
  function getResponse(id) {
    for (const i in jsonUsers.Users) {
      if (i == id) {
        return jsonUsers.Users[i];
      }
    }
    return 'Error: The User does not exist.';
  }

  /**
  * @param  {int} id - The new id of the User
  * @param  {string} name - The name of the new User
  * @param  {int} age - The age of the new User
  * @return {string} - Returns the updated JSON with the users
  */
  function postResponse(id, name, age) {
    for (const i in jsonUsers.Users) {
      if (i == id) {
        return 'The user already exists.';
      }
    }
    jsonUsers.Users.push({'id': id, 'name': name, 'age': age});
    return jsonUsers.Users;
  }

  /**
  * @param {int} id - The id of the user
  * @return {string} The Json with the updated data
  */
  function putResponse(id) {
    return jsonUsers.Users[id];
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
