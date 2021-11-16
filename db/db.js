const Sequelize = require('sequelize');
// const pkg = require('../package.json');

const databaseName = 'flts-backend';

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: true,
    },
  }
);

module.exports = db;
