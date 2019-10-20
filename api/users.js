const router = require('express').Router();
const { User, Shorten } = require('../db/models');
module.exports = router;

// GET /api/users/
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'phoneNumber'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    const redirects = await Shorten.findAllActiveByUser(user.id);
    if (user) {
      res.json({ user: { id: user.id, email: user.email }, redirects });
    }
  } catch (err) {
    next(err);
  }
});
