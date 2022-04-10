const config = require("config.json");
const db = require("_helpers/db");
const nodemailer = require("nodemailer");
const Notifications = db.Notifications;
module.exports = {
  getAll,
  getById,
  create,
  update,
  sdelete,
  delete: _delete,
  getNotificationsById,
  getNotificationsByIdNoJwt,
};

async function getAll() {
  return await Notifications.find();
}

async function getById(id) {
  return await Notifications.findOne({ _id: id });
}

async function getNotificationsById(id) {
  return await Notifications.find({ hospital_id: id });
}

async function getNotificationsByIdNoJwt(id) {
  return await Notifications.find({ hospital_id: id, status: true });
}

async function create(Param) {
  // validate
  if (await Notifications.findOne({ templatename: Param.templatename })) {
    throw "Name already exist";
  }

  const notifi = new Notifications(Param);

  // save
  await notifi.save();
  // let mes =
  //   "<b>Registration Successful - Find Below the details of your registration </b><p>Notificationsname:&nbsp;" +
  //   Param.email +
  //   "</p><p>Password:&nbsp;" +
  //   Param.password +
  //   "</p><p>Role:" +
  //   Param.role +
  //   "</p><p>Registration Type:" +
  //   Param.regType +
  //   "</p><p>Login URL: www.gudwil.live</p>";
  // main(mes, Param.email).catch(console.error);
}

async function update(id, Param) {
  const data = await Notifications.findById(Param.id);
  // validate
  if (!data) throw "Not found";

  // copy Param properties to user
  Object.assign(data, Param);
  await data.save();
}

async function sdelete(id) {
  await Notifications.findByIdAndUpdate(id, { status: false });
}

async function _delete(id) {
  await Notifications.findByIdAndRemove(id);
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
    subject: "GUDWIL-LIVE - Registration", // Subject line
    html: mes,
  });
}
