const config = require("config.json");
const db = require("_helpers/db");
const nodemailer = require("nodemailer");
const RegNotifications = db.RegisteredNotifications;
module.exports = {
  getById,
  create,
};

async function getById(id) {
  return await RegNotifications.find({ hospital_id: id });
}

// async function getNotificationsById(id) {
//   return await RegNotifications.find({ hospital_id: id });
// }

// async function createRegNoti(Param) {
//   const notifi = new RegNotifications(Param);
//   // save
//   await notifi.save();
//   // let mes =
//   //   "Your Email to ";
//   // main(mes, Param.email).catch(console.error);
// }

async function create(Param) {
  const notifi = new RegNotifications(Param);

  // save
  await notifi.save();
  let mes = `<p>Dear Sir / Madam,</p> <p>Thank you for booking ${Param.notification} note. Our health care team will connect with You shortly.`;
  main(mes, Param.email).catch(console.error);
}

// async..await is not allowed in global scope, must use a wrapper
async function main(mes, email) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    type: "SMTP",
    host: "smtp.gmail.com",
    //port: 465,
    //secure: true, // true for 465, false for other ports
    auth: {
      user: "gudwil.matters@gmail.com", // generated ethereal user
      pass: "GudWill10on10$$$", // generated ethereal password
    },
  });
  //console.log(email);
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "gudwil.matters@gmail.com", // sender address
    to: email, // list of receivers
    subject: "GUDWIL-LIVE - Note Booking", // Subject line
    html: mes,
  });
}
