const db = require('_helpers/db');
const IPDFeedback = db.IPDFeedback;
module.exports = {
    createFeedback,
    getById,
};



async function createFeedback(ipdParam) {
    const opdFeedback = new IPDFeedback(ipdParam);
    // save OpdFeedback
    await opdFeedback.save();
}

async function getById(id) {
    let count= await IPDFeedback.find({'hospital_Id':id}).sort({ 'createdDate' : 'desc'});
    return count;
}

