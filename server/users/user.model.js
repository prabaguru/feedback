const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  firstName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: Number, required: true, minlength: 10 },
  hash: { type: String, required: true },
  regType: { type: String, required: false },
  hospital_id: Schema.ObjectId,
  role: { type: String, required: false },
  status: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  address: { type: String, required: false },
  Pincode: { type: String, required: false },
  Hname: { type: String, required: false },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
