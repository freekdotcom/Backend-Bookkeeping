/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
*
* This software is distributed under the therms of the
* GNU General Public Licence version 3 (GPL) version 3,
* copied verbatim in the file "LICENSE"
*
*/
(() => {
  'use strict';
  const assert = require('assert');
  const myHello = require('../app/foo');
  const rest = require('../app/rest');
  const jsonUsers = require('../app/users.json');
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
    it('should successfully retrieve the correct user based on the id', function() {
      const outputTest = rest.getResponse(0);
      assert.equal(jsonUsers.Users[0], outputTest);
    });
  });
})();
