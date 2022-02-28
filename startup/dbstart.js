const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true})
.then(() => {
    console.log(`Database connected successfully to ${db}`);
    winston.info(`Database connected successfully to ${db}`);
});
// .catch(err => console.error('Could not connect to database')); // there is a method in 'index.js' that handles
                                                                  // unhandled promise rejections if there will be any

}