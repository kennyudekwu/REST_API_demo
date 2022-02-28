const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true
    }
  });

const Genre = mongoose.model('genre', genreSchema);


// Used in conjuction with the database schema in order to respond with http codes; whether error or successful
function validateGenre(genre) {
    const schema = Joi.object({
      name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
  }

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
module.exports.genreSchema = genreSchema;