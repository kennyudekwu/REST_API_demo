const {genreSchema} = require('./genres');
const mongoose = require('mongoose');
const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi)
// Joi.objectId = require('joi-objectid')(Joi)

const Movie = new mongoose.model('Movie', new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
      },
      genre: {
        type: [genreSchema],
        required: true
      },
      numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
}));

// Used in conjuction with the database schema in order to respond with http codes; whether error or successful
function validateMovie(movie) {
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
      // To check for the existence of the genre in the Genre collections, we pass
      // the object id of the id we are trying to add
      genreId: Joi.array()
      .items(Joi.string())
      .required(),
      numberInStock: Joi.number(),
      dailyRentalRate: Joi.number()
    });

    return schema.validate(movie);
  }

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
module.exports.genreSchema = genreSchema;


