const db = require("_helpers/db");
const APPFeedback = db.APPFeedback;
const sms = require("../smsFlow.js");
module.exports = {
  APPPerformance,
  getAllappPerformance,
  sendSMS,
};

function sendSMS(userParam) {
  return sms.sendSMS(userParam);
}

async function APPPerformance(Params) {
  const APPFeedbackres = new APPFeedback(Params);
  await APPFeedbackres.save();
}

async function getAllappPerformance() {
  //return await APPFeedback.find().select();
  return await APPFeedback.find({ name: "Feedback" })
    .select("-name")
    .sort({ createdDate: "desc" });
}
