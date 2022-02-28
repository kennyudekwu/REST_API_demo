const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: {

    // Another schema was used in place of embedding the customer
    // schema so as not to utilize all properties of the customer
    // schema

    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    required: true
  },

  // Array can be implemented here to save multiple movies
  // rented by the same customer in the same document
  // The custom built arrayGenerator seen in other modules will be utilized
  // here

  movie: {

    // We are not reusing the same movie schema for the same reason
    // as that for not including the customer schema above

    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },

  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },

  dateReturned: {
    type: Date
  },

  rentalFee: {
    type: Number,
    min: 0
  }
}));

function validateRentals(rental) {
  const schema = Joi.object({
      // Another form of handling the exception thrown when an invalid objectId
      // had been inputted is by using the 'joi-objectid' package, so as to
      // enable Joi know what response to throw to the client when such error is
      // encountered
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  });

  return schema.validate(rental);
}

// The module supposed to be preppended was omitted for no particular
// reason other than just to make the code neater.
// module.exports.Rental = Rental;
// module.exports.validateRental = validateRental;

exports.Rental = Rental;
exports.validateRentals = validateRentals;