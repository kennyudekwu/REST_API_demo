const auth = require('../middleware/auth');
const {Rental, validateRentals} = require('../models/rentals');
const {Movie} = require('../models/movies');
const {Customer} = require('../models/customers');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

// Fawn is a class with an "init" method we have to call to be able to
// use it, getting ready the variables needed for processing by other
// methods defined within the class

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

// Using the "embedded" asynchronous function as opposed to make already
// created asynchronous function created outside and later called and
// waited for via the "then" convention

router.post('/', auth, async (req, res) => {
  const { error } = validateRentals(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // In order to handle the exception thrown upon passing of an invalid _id,
  // perform the following:
//   if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
//   return res.status(400).send('Invalid customer');

  const customer = await Customer.findById(req.body.customerId); // Validates the input as either an id or not before querrying the db
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId); // Validates the input as either an id or not before querrying the db
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // Creating an instance (Transaction) and then performing an action
  // on all the underlisted operations; treating these operations as a
  // single unit

    new Fawn.Task()
    // saving the rental - first operation
    .save('rentals', rental)

    // updating the number of stock of movies left
    .update('movies', { _id : movie._id }, {
        // using the increment property to decrease the number of the
        // available movie of that name in stock
        $inc : { numberInStock: -1 }
    })
    .run();


//   rental = await rental.save();

//   movie.numberInStock--;
//   movie.save();

  res.send(rental);
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router;

