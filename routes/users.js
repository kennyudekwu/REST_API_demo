const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _= require('lodash'); // importing the lodash library with so many
                            // in-built functions for handling objects and
                            // arrays
const {User, validateUser} = require('../models/users');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/me', auth, async (req, res) => {
// We extract the user id from the jwt payload of the authorised user in
// other to prevent illicit retrieval of info. of other users by simply
// entering their id as parameters to the api endpoint "/:id"
const user = await User.findById(req.user._id).select('-password');
console.log(user);
// The above code is basically one way of returning a response to the
// client without sending the password of the client
res.send(user);
// OR
// res.send(_.pick(user, ['_id', 'name', 'email']));
})

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // make sure the user is not already registered

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered. ');

    /* If there isn't any user with such email, the value stored to 'user'
    will be null; needing us to store the value for the new user being
    created. In this case we reassign the value of 'user' to the object
    containing the information passed by the client in the JSON payload */

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    // OR in other to not capture unuseful data in the json request payload
    // we can use this instead:
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);

    // Alter the password property of the user (document) and save the encrypted
    // or hashed password in the database
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // In order to exclude some properites from being sent to the client,
    // use the lodash library. Specifically, the pick method is used. As
    // name suggest, the utility functions returns an object with the
    // properties designated to be picked from an object, in this case,
    // the user object

    const token = user.generateAuthToken();
    // Returning the token in the header of the response because it shouldn't be returned in the body
    // of the response as it is not a property of the object created or stored
    // res.send(token);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  });

module.exports = router;