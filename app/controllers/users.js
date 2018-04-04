/*
* @Author: Frederick van der Meulen
* @Date:   2018-04-04 09:35:57
* @Last Modified by:   Frederick van der Meulen
* @Last Modified time: 2018-04-04 10:59:30
*/

module.exports.controller = ((httpServer) => {
  httpServer.get('/current/user', async (req, res) => {
    res.end('THERE ARE NO USERS DUMMY');
  });
});
