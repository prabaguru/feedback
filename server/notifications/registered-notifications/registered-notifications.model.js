const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true, minlength: 10 },
  DOB: { type: String, required: false },
  notification: { type: String, required: true },
  notificationId: Schema.ObjectId,
  hospital_id: Schema.ObjectId,
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("RegisteredNotifications", schema);
