var Battle = require('./battleModel.js'),
    Q    = require('q');

module.exports = {

  // use on the server only
  addBattleRoom: function (cb) {
    Battle.create({}, function(err, battleRoom) {
      if (err) console.log(err);

      cb(battleRoom.roomhash);
    });
  },

  checkvalidbattleroom: function(req, res, err) {
    Battle.findOne({roomhash: req.body.hash}, function(err, room) {
      room === null ? res.send(false) : res.send(true);
    });
  }
};