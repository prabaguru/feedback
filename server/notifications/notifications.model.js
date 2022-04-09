const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  templatename: { type: String, required: true },
  content: { type: String, required: true },
  hospital_id: Schema.ObjectId,
  hospital_name: { type: String, required: true },
  status: { type: Boolean, default: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Notifications", schema);
