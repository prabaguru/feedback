const express = require("express");
const router = express.Router();
const notificationService = require("./notifications.service");

// routes
router.post("/create", create);
router.get("/getall", getAll);
router.get("/getById", getById);
router.get("/getNotificationsById", getNotificationsById);
router.get("/getNotificationsByIdNoJwt", getNotificationsByIdNoJwt);
router.put("/update", update);
router.put("/sdelete", sdelete);
router.delete("/delete", _delete);

module.exports = router;

function create(req, res, next) {
  notificationService
    .create(req.body)
    .then(() => res.status(200).json({ message: "Created Successfully" }))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  notificationService
    .getAll()
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  notificationService
    .getById(req.query.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getNotificationsById(req, res, next) {
  notificationService
    .getNotificationsById(req.user.sub)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getNotificationsByIdNoJwt(req, res, next) {
  notificationService
    .getNotificationsByIdNoJwt(req.query.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function update(req, res, next) {
  notificationService
    .update(req.params.id, req.body)
    .then(() => res.status(200).json({ message: "Update Successfull" }))
    .catch((err) => next(err));
}

function sdelete(req, res, next) {
  notificationService
    .sdelete(req.body.id)
    .then(() => res.json({ message: "Deactivated Successfully" }))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  notificationService
    .delete(req.params.id)
    .then(() => res.json({ message: "Deleted Successfully" }))
    .catch((err) => next(err));
}
