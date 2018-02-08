(() => {
  'use strict';
  const assert = require('assert');
  const myHello = require('../app/foo');
  const rest = require('../app/rest');
  var jsonUsers = require('../app/users.json')

  /**
   * @param  {[type]}
   * @return {[type]}
   */
  describe('Test', function() {
    it('should say hello before something', function() {
      assert.equal(myHello.hello('test'), 'hello test');
    });
  }); 

/**
 * A test to check if it's possible to retrieve an user from the JSON
 */
  describe('Get', function() {
  	it('should successfully retrieve the correct user based on the id', function(){
  		var outputTest = rest.getResponse(0);
  		assert.equal(jsonUsers.Users[0], outputTest);
  	});
  });

  /*describe('Post', function(){
  	it('should add another user to the JSON successfully', function(){

  	})
  }) */

})();