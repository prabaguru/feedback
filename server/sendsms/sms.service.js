const db = require('_helpers/db');
var twilio = require('twilio');
const sms = db.SMS;
module.exports = {
    sendSMSCustomer,
};


// Find your account sid and auth token in your Twilio account Console.
var client = new twilio('AC68b49474928a5c0688f403a7161cf068', '40eda8d3d0555c73249f274dcad7229e');
var bLink;


async function sendSMSCustomer(userParam) {
	 if(userParam.department=='OPD'){
	 	bLink = 'https://stackoverflow.com';
	 }else{
	bLink = 'https://google.com';
	 }
	 	 await client.messages.create({
  to: "+91"+userParam.mobile,
  from: "+19285639006",
  body: "Give us your feedback at" + bLink
});
    
}

