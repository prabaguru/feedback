require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("_helpers/jwt");
const errorHandler = require("_helpers/error-handler");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cors());
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use("/users", require("./users/users.controller"));
app.use("/opd", require("./opd/opd.controller"));
app.use("/ipd", require("./ipd/ipd.controller"));
app.use("/performance", require("./performance/apper.controller"));
app.use("/sendsms", require("./sendsms/sms.controller"));
app.use("/customers", require("./customers/customer.controller"));
app.use("/notifications", require("./notifications/notifications.controller"));
app.use(
  "/regnotifications",
  require("./notifications/registered-notifications/registered-notifications.controller")
);
// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
