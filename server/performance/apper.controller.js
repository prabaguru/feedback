const express = require("express");
const router = express.Router();
const oppService = require("./apper.service");
// routes

router.post("/appPerformance", appPerformance);
router.get("/getAllappPerformance", GetAllappPerformance);
router.post("/sendSMS", sendSMS);
module.exports = router;

function sendSMS(req, res, next) {
  oppService
    .sendSMS(req.body)
    .then((data) =>
      res.status(200).json({ data: data, message: "SMS sent successfully." })
    )
    .catch((err) => next(err));
}

function appPerformance(req, res, next) {
  oppService
    .APPPerformance(req.body)
    .then(() => res.status(200).json({ message: "Feedback Successfull" }))
    .catch((err) => next(err));
}

function GetAllappPerformance(req, res, next) {
  oppService
    .getAllappPerformance()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}
