const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name:{
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true
    },
    isGold:{
        type: Boolean,
        default: false
    },
    phone:{
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true
    }
  });

const Customer = mongoose.model('Customer', customerSchema);

// Used in conjuction with the database schema in order to respond with http codes; whether error or successful
function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(3).max(50).required(),
    isGold: Joi.boolean()
  });

  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;