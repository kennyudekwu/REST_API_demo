const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
name:{
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
},

email:{
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
},

password:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
},

isAdmin: Boolean
});

// Creating a method "generateAuthToken()" for objects created off this model
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      // calling the email method to make sure the email is a valid email
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(user);
  }

  // The module supposed to be preppended was omitted for no particular
  // reason other than just to make the code neater.
  // module.exports.Rental = Rental;
  // module.exports.validateRental = validateRental;

  exports.User = User;
  exports.validateUser = validateUser;

