const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
const sessionStore = new SequelizeStore({ db });
const PORT = process.env.PORT || 4000;
const app = express();
// const socketio = require('socket.io');
module.exports = app;

if (process.env.NODE_ENV !== 'production') require('./secrets');

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    const userObj = {
      id: user.id,
      email: user.email,
    };
    done(null, userObj);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  app.use(cors({
    origin: ['http://localhost:3000', /\.adumb\.dev$/],
    credentials: true,
  }));
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'XvPI2vEpNbcrW2c4Iosz',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: new Date(1699999999999),
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));

  /**
   * handle any incorrect paths
   */
  app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  /**
   * final error handling
   */
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`gettin jiggy on port ${PORT}`),
  );

  // set up our socket control center
  // const io = socketio(server);
  // require('./socket')(io);
};

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}

bootApp();
