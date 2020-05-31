const express = require("express");
const app = express();
const downloadPdf = require("./downloadPdf.js");
const bodyParser = require("body-parser");
//app.use(app.router);
express.json();
express.urlencoded({ extended: false });
module.exports = { path: "/api", handler: app };

app.get("/download-pdf", downloadPdf);

/* module.exports = function(moduleOptions) {
  // Add middleware only with `nuxt dev` or `nuxt start`
  if (this.options.dev || this.options._start) {
    this.addServerMiddleware("~/api/");
  }
}; */
