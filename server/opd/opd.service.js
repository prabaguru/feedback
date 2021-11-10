const db = require('_helpers/db');
const OPDFeedback = db.OPDFeedback;
module.exports = {
    createFeedback,getById
};



async function createFeedback(opdParam) {
    const opdFeedback = new OPDFeedback(opdParam);
    // save OpdFeedback
    await opdFeedback.save();
}

async function getById(id) {
    //let count= await OPDFeedback.find({'hospital_Id':id}).count({});
    let count= await OPDFeedback.find({'hospital_Id':id}).sort({ 'createdDate' : 'desc'});
    return count;
}


