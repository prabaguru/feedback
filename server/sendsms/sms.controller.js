const express = require('express');
const router = express.Router();
const smsService = require('./sms.service');

// routes
router.post('/sendsms', sendsms);

module.exports = router;


function sendsms(req, res, next) {
    smsService.sendSMSCustomer(req.body)
    .then(() => res.status(200).json({ message: 'SMS sent Successfull' }))
    .catch(err => next(err));
}



