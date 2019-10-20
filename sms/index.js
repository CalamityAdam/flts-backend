const router = require('express').Router();
const { Shorten, User } = require('../db/models');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const isValidUrl = require('../lib/isValidUrl');
module.exports = router;

const FRONTEND_APP_URL =
  process.env.NODE_ENV === 'production' ?
    'https://adumb.dev' :
    'http://localhost:3000';

// TODO try/catch
router.post('/', async (req, res, next) => {
  try {
    const { Body: redirect, From: phoneNumber } = req.body;
    const twiml = new MessagingResponse();
    if (isValidUrl(redirect)) {
      const slug = (Date.now() * Math.random()).toString(36).substr(0, 5);
      const expiration = 0;
      const user = await User.findOrCreate({
        where: { phoneNumber },
      });
      const newShorten = await Shorten.create({
        redirect,
        slug,
        expiration,
        userId: user.id,
      });
      const resMessage =
        `here's your short link:\n${FRONTEND_APP_URL}/${slug}.`;
      twiml.message(resMessage);
      res.writeHead(200, { 'Content-Type': 'text/xml' });
    } else {
      twiml.message('Please send ONLY a valid URL\nex:https://www.google.com.');
      res.writeHead(200, { 'Content-Type': 'text/xml' });
    }
    res.end(twiml.toString());
  } catch (err) {
    console.log('sms error', err);
    const twiml = new MessagingResponse();
    twiml.message("We're sorry, our system is not feeling well.. 🤒");
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
});
