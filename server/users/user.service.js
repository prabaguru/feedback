const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const nodemailer = require("nodemailer");
const User = db.User;
const mongoose = require("mongoose");
module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  sdelete,
  delete: _delete,
  updateAllStatus,
  Sendreport,
};

async function Sendreport(obj) {
  await main(obj.mes, obj.email).catch(console.error);
}

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const { hash, ...userWithoutHash } = user.toObject();
    const token = jwt.sign({ sub: user.id }, config.secret);
    updateLastLogin(user._id);
    return {
      ...userWithoutHash,
      token,
    };
  }
}

async function updateLastLogin(id) {
  await User.findByIdAndUpdate(id, { lastLogin: Date.now() });
}

async function getAll() {
  return await User.find({ role: "SUPER-ADMIN" }).select("-hash");

  //return await User.find().select('-hash');
}

async function getById(id) {
  return await User.find({ hospital_id: id }).select("-hash");
}

async function create(userParam) {
  // validate
  if (await User.findOne({ email: userParam.email })) {
    throw "This email address has been already registered";
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  if (userParam.firstName === "Weisermanner") {
    user.role = "Weisermanner";
  }
  // save user
  await user.save();
  let mes =
    "<b>Registration Successful - Find Below the details of your registration </b><p>Username:&nbsp;" +
    userParam.email +
    "</p><p>Password:&nbsp;" +
    userParam.password +
    "</p><p>Role:" +
    userParam.role +
    "</p><p>Registration Type:" +
    userParam.regType +
    "</p><p>Login URL: www.gudwil.live</p>";
  main(mes, userParam.email).catch(console.error);
}

async function update(id, userParam) {
  //var userId = mongoose.Schema.Types.ObjectId(id);
  const user = await User.findById(userParam.id);
  // validate
  if (!user) throw "User not found";
  // if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
  //     throw 'Username "' + userParam.username + '" is already taken';
  // }

  // hash password if it was entered
  if (userParam.password) {
    userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
  if (userParam.password) {
    let mes =
      "<b>Password change Successful  </b><p>Username:&nbsp;" +
      user.email +
      "</p><p>New Password:&nbsp;" +
      userParam.password +
      "</p><p>Login URL: www.gudwil.live</p>";
    main(mes, user.email).catch(console.error);
  }
}

async function sdelete(id) {
  await User.findByIdAndUpdate(id, { status: false });
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function updateAllStatus(id, flag) {
  await User.updateMany(
    { hospital_id: { $in: [id] } },
    { $set: { status: flag } },
    { multi: true }
  );
  await User.findByIdAndUpdate(id, { status: flag });
}

// async..await is not allowed in global scope, must use a wrapper
async function main(mes, email) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
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
