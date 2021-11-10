const express = require('express');
const router = express.Router();
const customerService = require('./customer.service');

// routes
router.post('/registerCustomers', registerCustomers);

module.exports = router;


function registerCustomers(req, res, next) {
    customerService.createCustomer(req.body)
    .then(() => res.status(200).json({ message: 'SMS sent Successfull' }))
    .catch(err => next(err));
}



