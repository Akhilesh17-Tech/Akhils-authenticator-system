const nodeMailer = require("../config/nodemailer");

exports.newResetLink = (passwordToken) => {
  let htmlString = nodeMailer.renderTemplate(
    { password_token: passwordToken },
    "/reset_link.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: "akhilsdevelopment@gmail.com",
      to: passwordToken.user.email,

      subject: "Reset password for Authenticator!",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail : ", err);
        return;
      }
      console.log("Reset link sent", info);
      return;
    }
  );
};
