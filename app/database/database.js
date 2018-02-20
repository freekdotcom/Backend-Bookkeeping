const pg = require('pg');
const conString = 'postgres://cernfrederick:frederick01@localhost:5432/cernfrederick';
const winston = require('winston');
const results = [];

/**
 * [getSomething description] testing the database function
 *
 */
function getSomething() {
  const client = new pg.Client(conString);
  client.connect();
  const query = client.query('SELECT * FROM log_entry');
  query.on('row', (row) => {
    results.push(row);
    winston.log('info', row);
  });
}

module.exports = {getSomething};
