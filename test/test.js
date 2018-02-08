(() => {
  'use strict';
  const assert = require('assert');
  const myHello = require('../app/foo');
  const rest = require('../app/rest');
  const jsonUsers = require('../app/users.json')


  /*describe('Test', function() {
    it('should say hello before something', function() {
      assert.equal(myHello.hello('test'), 'hello test');
    });
  }); */

  describe('Get', function(){
  	it('should retrieve the correct user based on the id', function(){
  		var outputTest = rest.getResponse(0);
  		assert.equal(jsonUsers[0], outputTest);
  	})
  });





})();
