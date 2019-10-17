const Shorten = require('./shorten');
const User = require('./user');

Shorten.belongsTo(User);
User.hasMany(Shorten);

module.exports = {
  Shorten,
  User,
};
