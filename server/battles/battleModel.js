var mongoose = require('mongoose'),
    Q        = require('q'),
    crypto   = require('crypto');


var BattleSchema = new mongoose.Schema({
  
  roomhash: {
    type: String
  }
  
});

BattleSchema.methods.generateHash = function () {
  var rand = Math.random().toString();
  var shasum = crypto.createHash('sha1');
  shasum.update(rand);
  return shasum.digest('hex').slice(0, 10);
};

BattleSchema.pre('save', function (next) {
  var roomhash = this.generateHash();
  this.roomhash = roomhash;
  next();
});

module.exports = mongoose.model('battles', BattleSchema);