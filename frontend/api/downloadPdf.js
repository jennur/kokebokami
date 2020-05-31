var express = require("express");
var router = express.Router();

const PDFDocument = require("pdfkit");

module.exports = function(req, res) {
  console.log("Req:", req.body);
  var myDoc = new PDFDocument({ bufferPages: true });

  let buffers = [];
  myDoc.on("data", buffers.push.bind(buffers));
  myDoc.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "Content-disposition": "attachment;filename=test.pdf"
      })
      .end(pdfData);
  });

  myDoc
    .font("Times-Roman")
    .fontSize(12)
    .text(`this is a test text`);
  myDoc.end();
};
