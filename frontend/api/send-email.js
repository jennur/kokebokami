"use strict";
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const axios = require("axios");

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
  let receiverEmail = await axios
    .get(
      `https://${process.env.PROJECT_ID}.firebaseio.com/users/${data.receiverID}.json?auth=${process.env.DATABASE_SECRET}`
    )
    .then(user => {
      if (user.data) return user.data.email;
      else "";
    })
    .catch(error => console.log("Error getting user:", error));
  // send mail with defined transport object
  transporter.sendMail(
    {
      from: '"Kokebokami" <noreply@kokebokami.com>', // sender address
      to: receiverEmail, // list of receivers
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
