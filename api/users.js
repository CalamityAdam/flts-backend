const router = require('express').Router();
const { User, Shorten } = require('../db/models');
const isSelfOrAdmin = require('../middlewares/isSelfOrAdmin');
module.exports = router;

// GET /api/users/
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'phoneNumber', 'sessionId'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/:userId
router.get('/:userId', isSelfOrAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    const shortens = await Shorten.findAllActiveByUser(user.id);
    if (user) {
      res.json({ user: { id: user.id, email: user.email }, shortens });
    }
  } catch (err) {
    next(err);
  }
});
