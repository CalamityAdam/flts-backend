const Sequelize = require('sequelize');
// const pkg = require('../package.json');

const databaseName = 'flts-backend';

const db = new Sequelize(`postgres://localhost:5432/${databaseName}`, {
  logging: false,
});

module.exports = db;

