/* const puppeteer = require("puppeteer");
 */
export default async function(req, res, next) {
  // req is the Node.js http request object
  console.log("PageScraper:", req.url);
  /* let url = req.getUrl;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const body = await page.evaluate(() => {
      return document.querySelector("body").innerHTML;
    });
    console.log(body);
    res.end(JSON.stringify(body));
    await browser.close();
  } catch (error) {
    console.log(error);
    res.end(error.message);
  } */
  res.end("Heya");
  next();
  // res is the Node.js http response object
  // next is a function to call to invoke the next middleware
  // Don't forget to call next at the end if your middleware is not an endpoint!
}
/* const express = require('express')
const app = express()

app.use('/', require('.......'))

module.exports = { path: '/api', handler: app } */
