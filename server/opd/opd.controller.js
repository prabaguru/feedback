const express = require('express');
const router = express.Router();
const opdService = require('./opd.service');

// routes
router.post('/opdFeedback', opdFeedback);
router.get('/getById', getById);

module.exports = router;


function opdFeedback(req, res, next) {
    opdService.createFeedback(req.body)
    .then(() => res.status(200).json({ message: 'Feedback Successfull' }))
    .catch(err => next(err));
}

function getById(req, res, next) {
    opdService.getById(req.query.id)
    .then(user => res.json(user))
    .catch(err => next(err));
}


