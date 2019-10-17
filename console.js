const repl = require('repl');
const { Shorten, User } = require('./db/models');
const db = require('./db');

// uncomment this to wipe DB
db.sync({ force: true });
// db.sync();

const replServer = repl.start({
  prompt: 'FTLS > ',
});

replServer.context.db = db;
replServer.context.Shorten = Shorten;
replServer.context.User = User;
