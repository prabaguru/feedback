const axios = require("axios");
module.exports.sendSMS = async function (obj) {
  let key = "c8799b6ce5a546d65f9af7fe82ae42ce626ae8bdaf12c994";
  let token = "d8feca523bd8edbef6b22c146a32deb9512a003436eaf59d";
  let domain = "@api.exotel.in";
  let sid = "weisermannerhealthcare1";
  const formUrlEncoded = (x) =>
    Object.keys(x).reduce(
      (p, c) => p + `&${c}=${encodeURIComponent(x[c])}`,
      ""
    );
  url = `https://${key}:${token}${domain}/v1/Accounts/${sid}/Sms/send.json`;
  await axios
    .post(
      url,
      formUrlEncoded({
        From: obj.From,
        To: obj.To,
        Body: obj.Body,
        DltEntityId: obj.dltentityid,
        DltTemplateId: obj.dlttemplateid,
        SmsType: "transactional_opt_in",
      }),
      {
        withCredentials: true,
        headers: {
          Accept: "application/x-www-form-urlencoded",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`);
      //console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
};
