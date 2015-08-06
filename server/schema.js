var Sequelize = require('sequelize');
var sequelize = new Sequelize('tunefuldb', "root", "");

var User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

User.sync()

exports.User = User;