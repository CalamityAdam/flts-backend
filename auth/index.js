const router = require('express').Router();
const User = require('../db/models/user');
module.exports = router;

// POST /auth/login - login existing user
router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      console.log('No such user found:', req.body.email);
      res.status(400).send('Wrong username and/or password');
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email);
      res.status(400).send('Wrong username and/or password');
    } else {
      const userObj = {
        id: user.id,
        email: user.email,
      };
      req.login(user, (err) => (err ? next(err) : res.json(userObj)));
    }
  } catch (err) {
    next(err);
  }
});

// POST /auth/signup - register new user
router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const userObj = {
      id: user.id,
      email: user.email,
    };
    req.login(userObj, (err) => (err ? next(err) : res.json(userObj)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).send('User already exists');
    } else {
      next(err);
    }
  }
});

// POST /auth/silentauth - signin/login with sesion id
router.post('/silentauth', async (req, res, next) => {
  try {
    const sessionId = req.session.id;
    const { name, check } = req.body;
    if (name === process.env.SILENT_AUTH_NAME) {
      if (check === process.env.SILENT_AUTH_CHECK) {
        const [user] = await User.findOrCreate({
          where: {
            sessionId,
          },
        });
        const userObj = {
          id: user.id,
        };
        req.login(userObj, (err) => (err ? next(err) : res.json(userObj)));
      }
    }
  } catch (err) {
    console.log('err in silent auth with session id:', req.session.id);
    next(err);
  }
});

// POST /auth/logout - log out user
router.post('/logout', (req, res) => {
  req.logout();
  // req.session.destroy();
  res.status(205).send('success');
});

// force session destory... do not use!
router.get('/do-not-use-super-secret-force-logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(205).send('success');
});

router.get('/me', (req, res) => {
  res.json(req.user);
});

router.use('/google', require('./google'));
