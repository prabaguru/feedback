const express = require('express');
const router = express.Router();
const oppService = require('./apper.service');

// routes

router.post('/appPerformance', appPerformance);
router.get('/getAllappPerformance', GetAllappPerformance);

module.exports = router;


function appPerformance(req, res, next) {
    oppService.APPPerformance(req.body)
    .then(() => res.status(200).json({ message: 'Feedback Successfull' }))
    .catch(err => next(err));
}

function GetAllappPerformance(req, res, next) {
    oppService.getAllappPerformance()
    .then(users => res.json(users))
    .catch(err => next(err));
}


