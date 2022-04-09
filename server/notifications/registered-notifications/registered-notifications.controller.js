const express = require("express");
const router = express.Router();
const regnotificationService = require("./registered-notifications.service");

// routes
router.post("/create", create);
router.get("/getById", getById);
module.exports = router;

function create(req, res, next) {
  regnotificationService
    .create(req.body)
    .then(() => res.status(200).json({ message: "Created Successfully" }))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  regnotificationService
    .getById(req.user.sub)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
