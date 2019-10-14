const router = require('express').Router();
const { Shorten } = require('../db/models');
module.exports = router;

// GET /api/shorten/  return all active redirects
router.get('/', async (req, res, next) => {
  try {
    const allSlugs = await Shorten.findAll({
      attributes: ['slug', 'redirect', 'id'],
    });
    res.json(allSlugs);
  } catch (err) {
    next(err);
  }
});

// GET /api/shorten/:slug  get one redirect and respond with the accoding redirect
router.get('/:slug', async (req, res, next) => {
  try {
    // TODO: add expiration check to destroy old redirects and respond accordingly
    const redirect = await Shorten.findOne({
      where: { slug: req.params.slug },
    });
    if (redirect) {
      // found the slug
      res.json({ redirect: redirect.redirect })
    } else {
      // slug doesn't exist
      res.json({ message: 'Custom name not found' })
    }
  } catch (err) {
    next(err);
  }
});

// POST /api/shorten/  create a new redirect
router.post('/', async (req, res, next) => {
  try {
    let { expiration, redirect, slug } = req.body
    console.log(req.body)
    if (!slug) {
      // slug not provided, auto-generate one
      slug = Math.random().toString(36).substr(2, 5)
    }
    console.log(slug)
    // convert the expiration time from minutes to ms
    expiration = expiration * 60000
    
    const newShorten = await Shorten.create({
      redirect, slug, expiration
    })
    
    res.json(newShorten)
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('slug taken')
    } else {
      next(err)
    }
    
    
    next(err)
  }
})
