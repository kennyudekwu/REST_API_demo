const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
  // Implementing protected API calls by searching for a jwt in the header
  // of a request
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.')

  try{
    const decoded = jwt.verify(token, config.get('jwtPrivateKey')); // Returns the json payload after the token has been decoded
    req.user = decoded;
    // console.log('auth running..')
    next(); // Transfers control to the next middleware funciton which is "express.json()"
            // which would handle the "req, res" processing
  }
  catch(ex){
      res.status(400).send('Invalid token.');
  }
}

module.exports = auth;