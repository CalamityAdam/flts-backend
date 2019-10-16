const router = require('express').Router();
const { Shorten } = require('../db/models');
module.exports = router;

// GET /api/shorten/  return all active redirects
router.get('/', async (req, res, next) => {
  try {
    const allSlugs = await Shorten.findAll({
      attributes: ['slug', 'redirect', 'id', 'expiration'],
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
    const redirect = await Shorten.findOne({
      where: { slug: req.params.slug },
    });
    if (redirect) {
      // * found the slug
      //* check for expiration
      if (Number(redirect.createdAt) + redirect.expiration <= Date.now()) {
        // ! expired
        await Shorten.destroy({ where: { id: redirect.id } });
        return res.json({ message: 'expired or incorrect link' });
      } else {
        //* still valid
        return res.json({ redirect: redirect.redirect });
      }
    } else {
      // ! slug doesn't exist
      return res.json({ message: 'expired or incorrect link' });
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/shorten/  create a new redirect
router.post('/', async (req, res, next) => {
  try {
    // TODO: check these
    let { expiration, redirect, slug } = req.body;
    if (!slug) {
      //* slug not provided, auto-generate one
      slug = Math.random()
        .toString(36)
        .substr(2, 5);
    }
    //* convert the expiration time from minutes to ms
    expiration = expiration * 60000;

    const newShorten = await Shorten.create({
      redirect,
      slug,
      expiration,
    });
    // ! if create fails, error will be thrown and handled by catch
    res.json(newShorten);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('slug taken');
    } else {
      next(err);
    }
    next(err);
  }
});
