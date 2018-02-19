const initOptions = {
  error: (error, e) => {
    if (e.cn) {
      console.log('CN:', e.cn);
      console.log('EVENT:', error.message || error);
    }
  }
};

const pgp = require('pg-promise')(initOptions);
const db = pgp('postgres://CERNTester:frederick01@CERNTester:5432/log_entry');

function testDatabase() {
  db.one('SELECT $1 AS value', 123)
    .then(function(data) {
      console.log('DATA:', data.value);
    })
    .catch(function(error) {
      console.log('ERROR:', error);
    });
}

module.exports = {testDatabase};
