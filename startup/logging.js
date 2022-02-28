const winston = require('winston');
require('winston-mongodb'); // for logging to mongodb
require('express-async-errors'); // for logging to other transports maybe a logfile

module.exports = function () {
    // To handle uncaught exceptions and unhandled promise rejections outside the reach of winston; say errors
// that occur outside a req res processing pipeline we use:


// process.on('uncaughtException', ex => {
    // console.log('We got an uncaught exception');

    // Logging the error via winston; storing in the log file as well as mongodb
    // winston.error(ex.message, {metadata: ex });
    // As a best practice, We have to exit the process unpon error occurance
    // process.exit(1); // 1 meaning failure, 0 for success
// }); // However, a helper function 'winston.handleExceptions' can be used to catch uncaught exceptions
    // and rejections as well as store them in a specified transport (mongodb or log file)


// For unhandled promise rejections (old way of logging exceptions due to unhandled rejections)
// process.on('unhandledRejection', ex => {
//     console.log('We got an uncaught exception');

//     // Logging the error via winston; storing in the log file as well as mongodb
//     winston.error(ex.message, {metadata: ex });

// });

// To control transport to store specific unhandled error
winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

// In order to catch unhandled promise rejection from error connecting to the database
// which normally should be handled by the helper function but for some reason stopped working
// we listen for an "unhandledRejection" event and then throw an exception to be caught
// by the helper function of winston for handling exceptions and supposedly rejections

process.on('unhandledRejection', (ex) => {
    throw ex;
})
// Adding another 'transport' to our winston, so that our logs
// can be written to the added 'transport' or medium (file in
// this case)

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost/movie-db',
    // How to just log errors in mongo, not store debug messages or info messages
    // Although, by default, only the errors would be stored
    level: 'info'
}));
}