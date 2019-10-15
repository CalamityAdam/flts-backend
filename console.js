const repl = require('repl');
const { Shorten } = require('./db/models')
const db = require('./db')

// db.sync({ force: true })
db.sync()

const replServer = repl.start({
  prompt: "FTLS > ",
});

replServer.context.db = db
replServer.context.Shorten = Shorten
