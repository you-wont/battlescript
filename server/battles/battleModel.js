var mongoose = require('mongoose'),
    Q        = require('q'),
    crypto   = require('crypto');
    fs       = require('fs');


var BattleSchema = new mongoose.Schema({
  
  roomhash: {
    type: String
  },

  challengeLevel: {
    type: Number,
    default: 8
  },

  challengeName: {
    type: String
  }
  
});

BattleSchema.methods.generateHash = function () {
  var rand = Math.random().toString();
  var shasum = crypto.createHash('sha1');
  shasum.update(rand);
  return shasum.digest('hex').slice(0, 10);
};

BattleSchema.methods.pickChallenge = function (challengeLevel) {
  var challengeName;
  var filePath = __dirname + '/../challenges/level-' + challengeLevel;
  console.log("FILEPATH: ", filePath);
  // fs.readFile(filePath, function(err, data){
  //   var challenges = data.toString().split('\n');

  //   // pick random challenge
  // })

  return "sum-of-intervals";
};

BattleSchema.pre('save', function (next) {
  var roomhash = this.generateHash();
  this.roomhash = roomhash;

  //select a specific challenge
  this.challengeName = this.pickChallenge(this.challengeLevel);

  next();
});

module.exports = mongoose.model('battles', BattleSchema);