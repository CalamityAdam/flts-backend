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

/**
 * instanceMethods
 */
Shorten.prototype.isActive = function() {
  // if expiration is 0, this is permanant, return true
  if (!this.expiration) return true;
  return (Number(this.createdAt) + this.expiration >= Date.now());
};

/**
 * class methods
 */
Shorten.findAllActiveByUser = async function(userId) {
  const all = await Shorten.findAll({ where: { userId } });
  return all
    .filter((shorten) => shorten.isActive())
    .map(({slug, redirect, expiration, id, createdAt}) => (
      { slug, redirect, expiration, id, createdAt }
    ));
};

Shorten.findAllActive = async function() {
  const all = await Shorten.findAll();
  return all
    .filter((shorten) => shorten.isActive())
    .map(({slug, redirect, expiration, id, createdAt }) => (
      { slug, redirect, expiration, id, createdAt }
    ));
};

Shorten.purge = async function() {
  const all = await Shorten.findAll();
  all.forEach(async (shorten) => {
    if (!shorten.isActive()) {
      await shorten.destroy();
    }
  });
};
