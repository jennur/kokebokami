"use strict";
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const axios = require("axios");

app.use(express.json());

const validHosts = [
  "http://localhost:3000",
  "https://kokebokami-development.herokuapp.com",
  "https://kokebokami-staging.herokuapp.com",
  "https://www.kokebokami.com",
  "https://kokebokami.com"
];
app.post("/", async (req, res) => {
  let origin = req.headers.origin;
  if (validHosts.indexOf(origin) > -1) {
    let response = await sendEmail(req.body);
    return res.status(response.status).json({ message: response.message });
  } else return res.status(403).json({ message: "Access denied" });
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

  let receiverEmail = "";
  if (data.receiverID) {
    receiverEmail = await axios
      .get(
        `https://${process.env.PROJECT_ID}.firebaseio.com/users/${data.receiverID}.json?auth=${process.env.DATABASE_SECRET}`
      )
      .then(user => {
        if (user.data) return user.data.email;
        return false;
      })
      .catch(error => console.log("Error getting user:", error));
  } else if (data.email) {
    receiverEmail = data.email;
  }

  // send mail with defined transport object

  return transporter
    .sendMail({
      from: '"Kokebokami" <noreply@kokebokami.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: data.subject, // Subject line
      text: data.message, // plain text body
      html: `${data.message}`, // html body
      sendmail: true
    })
    .then(info => {
      console.log("Message sent: %s", info.response);
      return { status: 200, message: "mail accepted for delivery" };
    })
    .catch(error => {
      console.log("Error in with transporter:", error.message);
      return { status: 500, message: error.message };
    });
}

module.exports = {
  path: "/api/send-email",
  handler: app
};
