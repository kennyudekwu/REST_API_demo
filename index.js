require('express-async-errors'); // for logging to other transports maybe a logfile

const winston = require('winston');
const express = require('express');
const app = express();

// To load the routes module and have a single reference to the app object,
// we pass 'app' as an object to the function imported from the routes
// folder handling all the routes

// initializing routes from another file for better (cleaner) code design
require('./startup/routes')(app); // returns a function which we then pass
                                 // app into in order to have that single
                                 // app reference

// initializing database from another file for better (cleaner) code design
require('./startup/dbstart')();

require('./startup/logging')();

require('./startup/config')();

require('./startup/validation')();

// Testing uncaught exception and promise rejection handler
// const p = Promise.reject(new Error('Something failed miserably'));
// p.then(() => console.log('Done'));
// throw new Error('Something failed during startup');

app.get('/', (req, res)=>{
    res.send('Welcome to the Genre API');
});

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));