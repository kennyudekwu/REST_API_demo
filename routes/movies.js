const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genres');
const {Movie, validateMovie} = require('../models/movies');
const mongoose = require('mongoose');

router.post('/', auth, (req, res) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

      createMovie(req.body.title, req.body.genreId,
        req.body.numberInStock, req.body.dailyRentalRate, req, res)
        .then(result => res.send(result));

  });

async function createMovie(title, array, numberInStock, dailyRentalRate, req, res) {
    console.log(array);
    const genres = await generateArray(array, req, res);
    const movie = new Movie({
      title : title,
      genre : genres,
      numberInStock : numberInStock,
      dailyRentalRate : dailyRentalRate
    });

    const result = await movie.save();
    console.log(result);
    return result;
  }


async function generateArray(array, req, res){
    const objects = [];
        // console.log('Starting for loop...');
    for(let i = 0; i < array.length; i++){
        // console.log('First iteration...');

        const genre = await Genre.findById(array[i]);
        console.log(genre);

        if(!genre) return res.status(400)
        .send('Invalid genre item at index '+i);

        objects.push(genre);
    }

    // console.log(objects);
    console.log(objects);
    return objects;
}

    module.exports = router

// async function test(){
//     const genre = await Genre.findById("60d28bf0d2241749686ec063");
//     console.log(genre);
// }

// test();
// generateArray(["60d28bf0d2241749686ec063","60d3418878bdcf2a1ca1e986"])

// TO DO Today

// Create other route handlers for the other http request to be sent
