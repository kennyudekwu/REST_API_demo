const Joi = require('Joi');

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi); // returns a function taking
// joi as an argument
}