const mongoose = require('mongoose')
const settings = require('./settings')

mongoose.connect(settings.mongodb_uri)
  .then(() => console.log('MongoDB connect.'))
  .catch((err) => console.log('MongoDB Fail to connect. ', err))

const db = mongoose.connection
db.on('error', (err) => console.log('MongoDB error! ', err))

module.exports = db