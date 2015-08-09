var duelController = require('./duelController.js');

module.exports = function (app) {
  app.get('/getduel', duelController.getDuel);
  app.post('/attemptduel', duelController.attemptDuel);
};