const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  HowdidyoucometoknowaboutUs: { type: String, required: true },
  Reception: { type: Number, required: true },
  StaffCourtesy: { type: Number, required: true },
  AbilitytoansweryourQueries: { type: Number, required: true },
  GeneralComfortandCleanliness: { type: Number, required: true },
  CarebyNurse: { type: Number, required: true },
  nurses: { type: String, required: false },
  CarebyDoctor: { type: Number, required: true },
  doctors: { type: String, required: false },
  LaboratoryService: { type: Number, required: true },
  PharmacyService: { type: Number, required: true },
  FoodService: { type: Number, required: true },
  AdmissionProcess: { type: Number, required: true },
  DischargeProcess: { type: Number, required: true },
  RoomServiceFacilities: { type: Number, required: true },
  CostVsService: { type: Number, required: true },
  Comments: { type: String, required: false },
  WillyourecommendUs: { type: String, required: false },
  Email: { type: String, required: true },
  Name: { type: String, required: true },
  Age: { type: Number, required: false },
  Pincode: { type: Number, required: false },
  Mobile: { type: Number, required: true },
  DOB: { type: String, required: false },
  Gender: { type: String, required: false },
  hospital_Id: Schema.ObjectId,
  IPDCONSULTATIONNo: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("IPDFeedback", schema);
