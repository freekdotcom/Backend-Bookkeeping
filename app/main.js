/* Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 *
 */
(() => {
  'use strict';
  const {HttpServer, Log} = require('@aliceo2/web-ui');
  Log.configure({winston: {file: 'error.log'}});
  const Config = require('./configuration_files/Config.js').Config;
  const config = Config.getInstance();
  const logEntry = require('./models/log_entries');
  const user = require('./models/users');
  const regex = /^(.*\.(?!(gif|GIF|png|PNG|jpeg|JPEG|txt|TXT|doc|DOC)$))?[^.]*$/i;
  const fs = require('fs');

  /**
   * Handles any error related to the end-points.
   * Returns an JSON object with the error message and error code.
   * @param  {res} res    the response
   * @param  {error} error the rejected promise
   * @param {integer} errorCode The error code
   */
  function errorHandling(res, error, errorCode) {
    Log.error(error);
    res.status(errorCode);
    const resArray = [];
    const JsonErrorMessage = ({
      error_code: errorCode,
      error_message: error
    });
    resArray.push(JsonErrorMessage);
    res.send(resArray);
  }

  // Checks if the server is not being run in root,
  // and if it is run in root,
  // changes the UID of the process.
  const uId = parseInt(process.env.SUDO_UID);
  if (uId) {
    process.setuid(uId);
    Log.debug('Server\'s UID is now ' + process.getuid());
  } else {
    Log.debug('Server\'s UID is not root.');
  }

  let httpServer = new HttpServer(config.getServerConfiguration(),
    config.getJsonWebTokenConfiguration());

  // Retrieves log entries based upon run id and a second parameter
  // The second parameter could be user, subsystem or type of log entry
  httpServer.get('/run/:runId/((s/:subsystem)|(u/:user)|(t/:type))', (req, res) => {
    Object.keys(req.params)
      .forEach((key) => req.params[key] === undefined && delete req.params[key]);
    const entries = new logEntry.LogEntries(req);
    entries.getEntries((result) => {
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error[0], error[1]);
    });
  });

  // Retrieves a file from a log entry
  httpServer.get('/:logEntryId/file', (req, res) => {
    const file = new logEntry.LogEntries(req);
    file.getLogEntryFile((result) => {
      const filePath = result.file_path;
      res.download(filePath, ((err) => {
        if (err) {
          errorHandling(res, err, 502);
        }
      }));
    }).catch((error) => {
      errorHandling(res, error[0], error[1]);
    });
  });

  // Gets a single entry from the database based upon ID
  httpServer.get('/:logEntryId', (req, res) => {
    const single = new logEntry.LogEntries(req);
    single.getLogEntry((result) => {
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error[0], error[1]);
    });
  });

  // Creates a log entry and then adds it to the database.
  httpServer.post('/run/:runId/:subsystem/:class/:user', (req, res) => {
    const post = new logEntry.LogEntries(req);
    post.postLogEntry((result) => {
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error[0], error[1]);
    });
  });


  // Test if the file is allowed to be uploaded and uploads
  // the file if the file is allowed.
  httpServer.post('/:logEntryId/upload', (req, res) => {
    if (regex.test(req.file.originalname)) {
      fs.unlinkSync(req.file.path);
      errorHandling(res, 'The file extension is not allowed', 403);
    }
    const postFile = new logEntry.LogEntries(req);
    postFile.postFileEntry((result) => {
      res.status(204);
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error[0], error[1]);
    });
  });

  // Login for the users
  httpServer.post('/login', (req, res) => {
    const postUser = new user.User(req);
    postUser.postUserAuthentication((result) => {
      res.send(result);
    }).catch((error) => {
      errorHandling(res, error[0], error[1]);
    });
  });

  // Bad path handler, instead of a HTML page
  httpServer.get('/*', (req, res) => {
    errorHandling(res, 'Bad path', 404);
  });
})();
