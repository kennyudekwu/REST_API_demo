const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _= require('lodash'); // importing the lodash library with so many
                            // in-built functions for handling objects and
                            // arrays
const {User} = require('../models/users');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // make sure the user is already registered

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password. ');

    // "bcrypt.compare()" checks that the passed in password corresponds to the
    // hashed password stored in the database.

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password. ');

    // Generating a json web token to be returned to the client
    // jwt.sign({<client public property>},<privateKey>)
    // The <privateKey> is stored on the server as an environment variable
    // The <client public property> is a property of the client gotten from the
    // returned object from the database.

    // Wrong way to add the privateKey to create the jwt because that way the key is exposed
    //  token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey');

    // Instead, we declare the key as an environment variable and call it as thus:
    const token = user.generateAuthToken(); // This token method was created in
                                            // in the user object so that once we
                                            // need to add any properties of the
                                            // user to the payload, we can do so
                                            // just editing this method and not having
                                            // to edit the ".sign()" method in every
                                            // module where it's used

    res.send(token);
    // We return the token in the header of the response once a user is created
  });

  function validateUser(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
  }

module.exports = router;