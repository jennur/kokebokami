module.exports = (req, res, next) => {
  let url = req._parsedOriginalUrl;
  let firstPath = req.url.split("/").filter(path => path !== "")[0];
  if (firstPath !== "api" && !url.search && !req.url.endsWith("/")) {
    res.writeHead(301, { Location: `${req.url}/` });
    return res.end();
  }
  next();
};
