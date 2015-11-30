/**
 * Mailer Component for Password Management Suite
 * @type {[type]}
 */
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host:'relay-admin.campuseai.org',
  port:25
});
var mailOptionsSample = {
    from: 'pwmsadmin@quicklaunchsso.com',
    to: 'ran_van@quicklaunchsso.com',
    subject: 'Testing from node',
    html: 'Hi <b>Ranjith madhavan</b><br/> This is a test mail from Nodejs <br/><br/>Regards<br/>PWMS Admin<br/>'  
}
exports.sendMail = function(mailOptions) {
  if (!mailOptions.from) {
    mailOptions.from = "donotreply@quicklaunchsso.com"
  }
  return new Promise(function(resolve, reject){
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        reject(error)
      }
      resolve(info.response);
    });
  });
}