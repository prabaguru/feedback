const db = require('_helpers/db');
const Customers = db.Customers;
module.exports = {
    createCustomer,
};



async function createCustomer(userParam) {
	 if (await Customers.findOne({ Mobile: userParam.Mobile })) {
        //throw 'Already registered';
        return;
    }else{
    const customer = new Customers(userParam);
    // save customer
    await customer.save();
	}
    
}

