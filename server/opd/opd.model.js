const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  OPDVisitedorOPDConsultationNumber: { type: String, required: false },
  Reception: { type: Number, required: true },
  Staff_Courtesy: { type: Number, required: true },
  Ability_to_answer_your_Queries: { type: Number, required: true },
  General_Comfort_and_Cleanliness: { type: Number, required: true },
  Waiting_time_for_Doctor: { type: Number, required: true },
  Care_by_Nurse: { type: Number, required: true },
  Care_by_Doctor: { type: Number, required: true },
  Laboratory_Service: { type: Number, required: true },
  Pharmacy_Service: { type: Number, required: true },
  Comments: { type: String, required: false },
  Willyourevisitus: { type: String, required: false },
  WillyourecommendUs: { type: String, required: false },
  Howdidyouknowaboutus: { type: String, required: false },
  Email: { type: String, required: true },
  Name: { type: String, required: true },
  Mobile: { type: Number, required: true },
  DOB: { type: String, required: false },
  Age: { type: Number, required: false },
  Pincode: { type: Number, required: false },
  hospital_Id: Schema.ObjectId,
  Gender: { type: String, required: false },
  Willyousharehospitallink: { type: String, required: false },
  //specialityVisited: { type: String, required: false },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("OPDFeedback", schema);
