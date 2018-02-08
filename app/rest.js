(() =>{
	'use strict';
	var jsonUsers = require('./users.json');
	var express = require('express');

	/**
	 * Method for retrieving the correct user based on the Id
	 * @param  {The id of the User}
	 * @return {THe user with the matching Id}
	 */
	function getResponse(id){
		for(var i in jsonUsers.Users){
			if(i == id){
				return jsonUsers.Users[i];
			}
		}	
		return " Error: The User does not exist.";
	}

	/**
	 * @param  {The new id of the User}
	 * @param  {The name of the new User}
	 * @param  {The age of the new User}
	 * @return {Returns the updated JSON with the users}
	 */
	function postResponse(id, name, age){
		for(var i in jsonUsers.Users){
			if(i == id){
				return "The user already exists.";
			}
		}
		jsonUsers.Users.push({"id" : id, "name" : name, "age" : age});
		return jsonUsers.Users;
	}

	function putResponse(){
		
	}

	/**
	 * @param  {The id of the user that's going to be deleted}
	 * @return {Returns the updated JSON with the users}
	 */
	function deleteResponse(id){
		for(var i in jsonUsers.Users){
			if(i == id){
				jsonUsers.Users.splice(0,id);
				return jsonUsers.Users;
			}
		}

	}

	  module.exports = {getResponse};
	  module.exports = {postResponse}

})();