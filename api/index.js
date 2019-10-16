const router = require('express').Router();
module.exports = router;

router.use('/shorten', require('./shorten'));
router.use('/users', require('./users'));

router.use((req, res, next) => {
  // that slug doesnt exist
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
