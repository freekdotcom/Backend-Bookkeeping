const pg = require('pg');
const conString = 'postgres://cernfrederick:frederick01@localhost:5432/cernfrederick';

/**
 * [getAllLogEntries description] testing the database function
 * @return {array} All the results from the database.
 */
function getAllLogEntries() {
  const results = [];
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise((resolve, reject) => {
    query = client.query('SELECT * FROM log_entry');
    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      client.end();
      resolve(results);
    });
    reject(new Error('Error with Database query'));
  });
}

/**
 * [getSingleLogEntry description]
 * @param {[type]} runID [description]
 * @return {[type]} the log entry
 */
function getSingleLogEntry(runID) {
  let result = null;
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise((resolve, reject) => {
    query = client.query('SELECT * FROM log_entry WHERE run_id = $1', [runID]);
    query.on('row', (row) => {
      result = row;
    });

    query.on('end', () => {
      client.end();
      resolve(result);
    });
    reject(new Error('Error with Database query'));
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
function postLogEntry(bunches, scheme, fill, energyPerBeam, intensityPerBeam) {
  const results = [];
  const client = new pg.Client(conString);
  client.connect();
  let query = null;
  return new Promise((resolve, reject) => {
    // filling in the req params
    client.query('INSERT INTO log_entry(bunches, scheme, fill,' +
      'energy_per_beam, intensity_per_beam) values ($1, $2, $3, $4, $5)',
    [bunches, scheme, fill, energyPerBeam, intensityPerBeam]);
    // proof that it succeeded.
    query = client.query('SELECT * FROM log_entry');
    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      client.end();
      resolve(results);
    });
    reject(new Error('Error with Database query'));
  });
}

module.exports = {getAllLogEntries, getSingleLogEntry, postLogEntry};
