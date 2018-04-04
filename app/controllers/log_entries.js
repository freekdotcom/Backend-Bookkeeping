/*
* @Author: Frederick van der Meulen
* @Date:   2018-03-26 09:48:27
* @Last Modified by:   Frederick van der Meulen
* @Last Modified time: 2018-04-04 11:00:11
*/
const bodyParser = require('body-parser').json();
const multer = require('multer');
const upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
});

module.exports.controller = ((httpServer) => {
  httpServer.get('/all/entries', async (req, res) => {
    res.render('log/entries');
  });

  httpServer.get('/single/entry', async (req, res) => {
    res.render('log/entry/:id');
  });

  httpServer.post('/post/entry', bodyParser,
    upload.single('file'), async (req, res) => {
      res.render('log/entry');
    });
});
