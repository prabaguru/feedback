const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  templatename: { type: String, required: true },
  content: { type: String, required: true },
  hospital_id: Schema.ObjectId,
  status: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
});

const regschema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: Number, required: true, minlength: 10 },
  dob: { type: Number, required: false },
  notification: { type: String, required: true },
  notificationId: Schema.ObjectId,
  hospital_id: Schema.ObjectId,
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Notifications", schema);
module.exports = mongoose.model("RegisteredNotifications", regschema);
