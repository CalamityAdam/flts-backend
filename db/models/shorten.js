const Sequelize = require('sequelize');
const db = require('../db');

const Shorten = db.define('shorten', {
  slug: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  redirect: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  expiration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Shorten;
