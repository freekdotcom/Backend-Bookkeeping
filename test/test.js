/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  // const assert = require('assert');
  const expect = require('chai').expect;
  const database = require('../app/database/database');
  describe('Database promises', () => {
    describe('GET ALL promise ', () => {
      it('should return a Promise', () => {
        const promisedGet = database.getAllLogEntries();
        expect(promisedGet.then).to.be.a('Function');
      });
    });
    describe('GET SINGLE promise', () => {
      it('should return a Promise', () => {
        const promisedGet = database.getSingleLogEntry(1);
        expect(promisedGet.then).to.be.a('Function');
      });
    });
    describe('POST promise', () => {
      it('should return a Promise', () => {
        const promisedPost = database.postLogEntry('test', 'test',
          'test', 'test', 'test', 'test', 'test', 'test', 'test');
        expect(promisedPost.then).to.be.a('Function');
      });
    });
  });
})();
