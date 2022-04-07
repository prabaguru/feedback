const config = require("config.json");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
  OPDFeedback: require("../opd/opd.model"),
  APPFeedback: require("../performance/apper.model"),
  IPDFeedback: require("../ipd/ipd.model"),
  Customers: require("../customers/customer.model"),
  SMS: require("../sendsms/sms.model"),
  Notifications: require("../notifications/notifications.model"),
  RegisteredNotifications: require("../notifications/notifications.model"),
};
