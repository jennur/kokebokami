"use strict";
const express = require("express");
const app = express();
const axios = require("axios");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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

  const msg = {
      to: receiverEmail,
      from: '"Kokebokami" <noreply@kokebokami.com>',
      subject: data.subject,
      text: data.message,
      html: data.message,
      sendmail: true
  }
  try {
    await sgMail.send(msg)
    console.log("Message sent");
    return { status: 200, message: "mail accepted for delivery" };
  } catch (error) {
    console.log("Error in sgMail:", error.message);
      return { status: 500, message: error.message };
  }
}

module.exports = {
  path: "/api/send-email",
  handler: app
};
