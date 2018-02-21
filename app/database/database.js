const pg = require('pg');
const conString = 'postgres://cernfrederick:frederick01@localhost:5432/cernfrederick';

/**
 * [GetAllLogEntries description] testing the database function
 * @return {array} All the results from the database.
 */
function GetAllLogEntries() {
  const results = [];
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise(resolve => {
    query = client.query('SELECT * FROM log_entry');
    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      client.end();
      resolve(results);
    });
  });
}

/**
 * [GetSingleLogEntry description]
 * @param {[type]} runID [description]
 * @return {[type]} the log entry
 */
function GetSingleLogEntry(runID) {
  let result = null;
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise(resolve => {
    query = client.query('SELECT * FROM log_entry WHERE run_id = $1', [runID]);
    query.on('row', (row) => {
      result = row;
    });

    query.on('end', () => {
      client.end();
      resolve(result);
    });
  });
}

/**
 * To post a log entry
 * @param {[type]} bunches          [description]
 * @param {[type]} scheme           [description]
 * @param {[type]} fill             [description]
 * @param {[type]} energyPerBeam    [description]
 * @param {[type]} intensityPerBeam [description]
 * @return {[type]} the log entry

 */
function PostLogEntry(bunches, scheme, fill, energyPerBeam, intensityPerBeam) {
  let results = null;
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise(resolve => {
    // filling in the req params
    client.query('INSERT INTO log_entry(bunches, scheme, fill,' +
      'energy_per_beam, intensity_per_beam) values ($1, $2, $3, $4, $5)'
        [bunches, scheme, fill, energyPerBeam, intensityPerBeam]);
    // proof that it succeeded.
    query = client.query('SELECT * FROM log_entry ORDER BY run_id ASC');
    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      client.end();
      resolve(results);
    });
  });
}

module.exports = {GetAllLogEntries, GetSingleLogEntry, PostLogEntry};
