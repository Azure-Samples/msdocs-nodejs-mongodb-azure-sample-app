import sgMail from "@sendgrid/mail";
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default (to, subject, html) => {
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM,
    subject: subject,
    html: html,
  };

  sgMail.send(msg);
};
