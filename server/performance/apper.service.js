const db = require('_helpers/db');
const APPFeedback = db.APPFeedback;
module.exports = {
    APPPerformance,getAllappPerformance,
};


async function APPPerformance(Params) {
    const APPFeedbackres = new APPFeedback(Params);
    await APPFeedbackres.save();
}

async function getAllappPerformance() {
    //return await APPFeedback.find().select();
    return await APPFeedback.find({'name':'Feedback'}).select('-name').sort({ 'createdDate' : 'desc'});
}