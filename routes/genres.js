// const asyncMiddleWare = require('../middleware/async');
// The express-async-errors package handles this

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const {Genre, validateGenre} = require('../models/genres');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/movie-db', {useNewUrlParser: true,  useUnifiedTopology: true})
// .then(() => console.log('Database connected successfully...'))
// .catch(err => console.error('Could not connect to database'));


router.get('/', (req, res) => {
  throw new Error('Testing logging error via winston');
  getGenre().then(result =>{
    // console.log('Genre from post without id method: ', result)
    res.send(result);
  });

});

// "auth" passed in is a middleware function to be executed before the
// "(req, res)" middleware function -> "express.json()"
router.post('/', auth, (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log(error.details[0].message); Test for error logging on console

  // const genre = {
  //   id: genres.length + 1,
  //   name: req.body.name
  // };
  // genres.push(genre);

    createGenre(req.body.name).then(result => res.send(result))
    // .catch(err => {
    //   console.log('Error: ', err.message);
    //   res.status(400).send(err);
    // });
});

router.put('/:id', auth, (req, res) => {
  // const genre = genres.find(c => c.id === parseInt(req.params.id));
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  updateGenre(req.params.id, req.body.name).then(result =>
    {
      if(!result) return res.status(404).send('The genre with the given ID was not found.');
      console.log(result);
      res.send(result);
    })

});

router.delete('/:id', [auth, admin], (req, res) => {
  // const genre = genres.find(c => c.id === parseInt(req.params.id));

  removeGenre(req.params.id).then(result => {
    if (!result) return res.status(404).send('The genre with the given ID was not found.');
    res.send(result);
  })
  // const index = genres.indexOf(genre);
  // genres.splice(index, 1);
});

router.get('/:id', (req, res) => {
  // const genre = genres.find(c => c.id === parseInt(req.params.id));

  getGenre(req.params.id).then(result => {
  if (!result) return res.status(404).send('The genre with the given ID was not found.');
  console.log('Genre from post with id method: ', result);
  res.send(result);
  })
  // No need for the catch method because there would be no need for validation, as the id isn't a field to be
  // explicitly provided by the user for storage of documents. We can only check the database for presence of
  // the provided id, and then perform whatever operation is needed of the system.
});



async function getGenre(id = ""){
  if ( id !== "") {
  const genres = await Genre
  .findById(id).sort({name : 1}).select();

  console.log(genres);
  return genres;
  }

  else {
  const genres = await Genre
  .find().sort({name : 1}).select();

  console.log(genres);
  return genres;
  }
}

async function createGenre(name){
  console.log('Creating genre...');

  const movie = new Genre({

    name: name
  });

    console.log('Running try block');
    const result = await movie.save();
    console.log(result);
    return result;
  }


async function removeGenre(id){

    return await Genre.findByIdAndDelete(id);

}

async function updateGenre(id, name){

  const result = await Genre.findByIdAndUpdate(id, {
      $set:{
          name: name
      }
    } , { new : true });

    console.log(result);

    return result;
}

module.exports = router;