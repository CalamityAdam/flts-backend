const router = require('express').Router();
const { Shorten } = require('../db/models');
module.exports = router;

// GET /api/shorten/  return all active redirects
router.get('/', async (req, res, next) => {
  try {
    const allSlugs = await Shorten.findAll({
      attributes: ['slug', 'redirect', 'id', 'expiration', 'createdAt'],
    });
    res.json(allSlugs);
  } catch (err) {
    next(err);
  }
});

// GET /api/shorten/:slug  get one redirect and respond with the accoding
// redirect
router.get('/:slug', async (req, res, next) => {
  try {
    const shorten = await Shorten.findOne({
      where: { slug: req.params.slug },
    });
    if (shorten) {
      // * found the slug
      // * check for expiration. if 0: permanent link, skip check
      if (!shorten.isActive()) {
        // ! expired
        Shorten.destroy({ where: { id: shorten.id } });
        return res.json({ message: 'expired or incorrect link' });
      }
      //* still valid
      return res.json({ redirect: shorten.redirect });
    } else {
      // ! slug doesn't exist
      return res.json({ message: 'expired or incorrect link' });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/shorten/ - create a new redirect/shorten
router.post('/', async (req, res, next) => {
  try {
    // TODO: sanitize these
    let { expiration, redirect, slug, userId } = req.body;
    if (!slug) {
      //* slug not provided, auto-generate one
      slug = (Date.now() * Math.random()).toString(36).substr(0, 5);
    }
    //* convert the expiration time from minutes to ms
    expiration = expiration * 60000;
    userId = userId || null;

    const newShorten = await Shorten.create({
      redirect,
      slug,
      expiration,
      userId,
    });
    // ! if create fails, error will be thrown and handled by catch
    res.json(newShorten);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).send('custom name taken');
    } else {
      next(err);
    }
    next(err);
  }
});

// DELETE /api/shorten/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const shorten = await Shorten.findByPk(req.params.id);
    if (shorten) {
      await shorten.destroy();
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});
