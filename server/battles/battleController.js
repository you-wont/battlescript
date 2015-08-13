var Battle = require('./battleModel.js'),
    Q    = require('q');

module.exports = {
  addBattleRoom: function (cb) {
    console.log('adding a battle room on the server!');

    Battle.create({}, function(err, battleRoom) {
      if (err) console.log(err);

      cb(battleRoom.roomhash);
    });
  }
};