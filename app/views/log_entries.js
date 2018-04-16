/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the therms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() =>{
  'use strict';

  /**
   * Renders the string
   * @param  {array} result The result from earlier
   * @return {string}        the convert result
   */
  function render(result) {
    return JSON.stringify(result);
  }

  module.exports = {render};
})();
