const { error } = require('winston');
// const winston = require('winston');

module.exports = function ( err, req, res, next) {
    // Log Exception

    // Logging Levels:
    // error
    // warn
    // info
    // verbose
    // debug
    // silly

    // If a certain level is choosen say, "level : warn" in the transport
    // storing the log (say mongodb), error and warn will be saved on mongodb.
    // If level was changed to debug, all levels down to debug will be saved in
    // mongodb : error, warn, info, verbose and debug

    // Creating an object to explicitly define what we want in our metadata
    // let logMeta = {
    //     message: err.message,
    //     name: err.name,
    //     stack: err.stack
    // }

    // winston.error(err.message, {metadata: logMeta });

    // However, to have the default err object stored as the metadata, we
    // pass in "err" as the value for the object argument containing the
    // "metadata" property unlike before where one could just send the
    // "err" object as the second argument to the winston's error()
    // method

    error(err.message, {metadata: err }); // This stores the error in the logfile created
                                     // via the winston object in index.js

    // winston.log(err.message, err); - This logs the error on the console

    // console.log(err); - Manual, less-technical way of logging the errors 😁
    res.status(500).send('Something failed.');
}