const auth = require('../middleware/auth')
const {Customer, validateCustomer} = require('../models/customers');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/movie-db', {useNewUrlParser: true,  useUnifiedTopology: true})
// .then(() => console.log('Database connected successfully...'))
// .catch(err => console.error('Could not connect to database'));


router.get('/', (req, res) => {
  getCustomer().then(result =>{
    console.log('Customer from post with id method: ', result)
    res.send(result);
  }).catch(err => {
    console.log('Error: ', err.message);
    res.status(500).send('An error has just caused the server to malfunction');
    });

});

router.post('/', auth, (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // console.log(error.details[0].message); Test for error logging on console

  // const customer = {
  //   id: customers.length + 1,
  //   name: req.body.name
  // };
  // genres.push(genre);

    createCustomer(req.body.name, req.body.phone, req.body.isGold).then(result => res.send(result));
    // .catch(err => {
    //   console.log('Error: ', err.message);
    //   res.status(400).send(err);
    // });
});

router.put('/:id', auth, (req, res) => {
  // const genre = genres.find(c => c.id === parseInt(req.params.id));
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  updateCustomer(req.params.id, req.body.name, req.body.phone, req.body.isGold).then(result =>
    {
      if(!result) return res.status(404).send('The customer with the given ID was not found.');
      console.log(result);
      res.send(result);
    }).catch(err => {
      console.log('Error: ', err.message);
      res.status(500).send('An error has just caused the server to malfunction');
      });
    // .catch(err => { // Optional because the validateCustomer method wil return the validation error
    // console.log(err.message);
    // });

});

router.delete('/:id', auth, (req, res) => {
  // const customer = customers.find(c => c.id === parseInt(req.params.id));

  removeCustomer(req.params.id).then(result => {
    if (!result) return res.status(404).send('The customer with the given ID was not found.');
    res.send(result);
  }).catch(err => {
    console.log('Error: ', err.message);
    res.status(500).send('An error has just caused the server to malfunction');
    });

  // const index = customers.indexOf(customer);
  // customers.splice(index, 1);
});

router.get('/:id', (req, res) => {
  // const customer = customers.find(c => c.id === parseInt(req.params.id));

  getCustomer(req.params.id).then(result => {
  if (!result) return res.status(404).send('The customer with the given ID was not found.');
  console.log('Customer from post with id method: ', result);
  res.send(result);
  }).catch(err => {
     console.log('Error: ', err.message);
     res.status(500).send('An error has just caused the server to malfunction');
     });
  // No need for the catch method because there would be no need for validation, as the id isn't a field to be
  // explicitly provided by the user for storage of documents. We can only check the database for presence of
  // the provided id, and then perform whatever operation is needed of the system.
});



async function getCustomer(id = ""){
  if ( id !== "") {
  const customers = await Customer
  .findById(id).sort({name : 1}).select();

  console.log(customers);
  return customers;
  }

  else {
  const customers = await Customer
  .find().sort({name : 1}).select();

  console.log(customers);
  return customers;
  }
}

async function createCustomer(name, phone, isGold = false){


  const customer = new Customer({

    name: name,
    phone: phone,
    isGold: isGold
  });
    const result = await customer.save();
    console.log(result);
    return result;
  }


async function removeCustomer(id){

    return await Customer.findByIdAndDelete(id);

}

async function updateCustomer(id, name, phone, isGold = false){

  const result = await Customer.findByIdAndUpdate(id, {
    $set:{
        name: name,
        phone: phone,
        isGold: isGold

    }
    } , { new : true });
    console.log(result);
    return result;
}

module.exports = router;