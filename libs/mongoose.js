const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

// Connection URL
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;