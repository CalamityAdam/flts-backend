const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./db');
const PORT = process.env.PORT || 4000;
const app = express();
module.exports = app;

if (process.env.NODE_ENV !== 'production') require('./secrets')

const createApp = () => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );

  app.use('/api', require('./api'));

  app.use((err, req, res, next) => {
    // res.json('oops')
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
};

const startListening = () => {
  const server = app.listen(PORT, () => {
    console.log('App running on port ' + PORT);
  });
};

const syncDb = () => db.sync();

async function bootApp() {
  await syncDb();
  await createApp();
  await startListening();
}

bootApp();
