const express = require('express');
const router = express.Router();
const ipdService = require('./ipd.service');

// routes
router.post('/ipdFeedback', ipdFeedback);
router.get('/getById', getById);
module.exports = router;


function ipdFeedback(req, res, next) {
    ipdService.createFeedback(req.body)
    .then(() => res.status(200).json({ message: 'Feedback Successfull' }))
    .catch(err => next(err));
}

function getById(req, res, next) {
    ipdService.getById(req.query.id)
    .then(user => res.json(user))
    .catch(err => next(err));
}



