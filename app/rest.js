(() =>{
	'use strict';
	var jsonUsers = require('./users.json');
	var express = require('express');



	/**
		Function to handle all the GET responses from the main call.
	*/
	function getResponse(id){
		for(var i in jsonUsers.Users){
			if(i == id){
				return jsonUsers.Users[i];
			}
		}	
	}

	/**
		Function for all the POST responses from the main call.
	*/
	function postResponse(id, name, age){
		for(var i in jsonUsers.Users){
			if(i == id){
				return null;
			}
		}
		jsonUsers.Users.push({"id" : id, "name" : name, "age" : age});
		return jsonUsers.Users;
	}

	function putResponse(){
		
	}

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