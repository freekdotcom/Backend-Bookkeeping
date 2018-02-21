const pg = require('pg');
const conString = 'postgres://cernfrederick:frederick01@localhost:5432/cernfrederick';
const winston = require('winston');
const results = [];

/**
 * [getInformationFromDatabase description] testing the database function
 * @return {array} All the results from the database.
 */
function getInformationFromDatabase() {
  const client = new pg.Client(conString);
  client.connect();
  const query = client.query('SELECT * FROM log_entry');

  query.on('row', (row) => {
    results.push(row);
  });

  query.on('end', () => {
    client.end();
    winston.log(results);
  });
  return results;
}
module.exports = {getInformationFromDatabase};
