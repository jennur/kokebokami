"use strict";
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");

app.use(express.json());

app.post("/", (req, res) => {
  sendEmail(req.body).catch(console.error);
  return res.status(200).json({ body: req.body });
});

async function sendEmail(data) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    secureConnection: false,
    port: 587,
    tls: {
      ciphers: "SSLv3"
    },
    auth: {
      user: "contact@kokebokami.com", // email
      pass: process.env.EMAIL_PASSWORD // password
    }
  });

  // send mail with defined transport object
  transporter.sendMail(
    {
      from: '"Kokebokami" <noreply@kokebokami.com>', // sender address
      to: data.email, // list of receivers
      subject: data.subject, // Subject line
      text: data.message, // plain text body
      html: `${data.message}`, // html body
      sendmail: true
    },
    function(error, info) {
      if (error) {
        return console.log("Error:", error);
      }
      console.log("Message sent: %s", info.response);
    }
  );
}

module.exports = {
  path: "/api/send-email",
  handler: app
};
