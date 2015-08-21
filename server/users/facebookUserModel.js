var mongoose = require('mongoose');

var FacebookUserSchema = new mongoose.Schema({
  facebookDisplayName: {
    type: String,
    required: true
  },

  facebookID: {
    type: String,
    required: true
  },

  currentStreak: {
    type: Number,
    default: 0
  },

  longestStreak: {
    type: Number,
    default: 0
  },

  totalWins: {
    type: Number,
    default: 0
  }
});


module.exports = mongoose.model('facebookusers', FacebookUserSchema);
