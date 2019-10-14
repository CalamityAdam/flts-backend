const router = require('express').Router();
module.exports = router;

// router.use('/shorten', require('./shorten'))
router.use('/shorten', require('./shorten'));

router.use((req, res, next) => {
  // that slug doesnt exist
  console.log('oops');
});
