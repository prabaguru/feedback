const express = require("express");
const router = express.Router();
const userService = require("./user.service");

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", getAll);
//router.get('/current', getCurrent);
router.get("/getById", getById);
router.get("/getByIdWeis", getByIdWeis);
router.put("/update", update);
router.put("/sdelete", sdelete);
router.delete("/delete", _delete);
router.put("/updateAllStatus", updateAllStatus);
router.put("/Sendreport", Sendreport);

module.exports = router;

function Sendreport(req, res, next) {
  userService
    .Sendreport(req.body)
    .then(() => res.status(200).json({ message: "Report Sent Successfully" }))
    .catch((err) => next(err));
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) => {
      if (user && user.status == true) {
        res.json(user);
      } else {
        res.status(400).json({ message: "Username or password is incorrect" });
      }
    })
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.status(200).json({ message: "Registration Successfull" }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

// function getCurrent(req, res, next) {
//     userService.getById(req.user.sub)
//     .then(user => user ? res.json(user) : res.sendStatus(404))
//     .catch(err => next(err));
// }

function getById(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => res.json(user))
    .catch((err) => next(err));
}

function getByIdWeis(req, res, next) {
  userService
    .getById(req.query.id)
    .then((user) => res.json(user))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.status(200).json({ message: "Update Successfull" }))
    .catch((err) => next(err));
}

function sdelete(req, res, next) {
  userService
    .sdelete(req.body.id)
    .then(() => res.json({ message: "Deleted Successfully" }))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "Deleted Successfully" }))
    .catch((err) => next(err));
}

function updateAllStatus(req, res, next) {
  userService
    .updateAllStatus(req.body.id, req.body.flag)
    .then(() => res.json({ message: "Update Successfull" }))
    .catch((err) => next(err));
}
