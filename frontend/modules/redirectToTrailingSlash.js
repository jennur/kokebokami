module.exports = (req, res, next) => {
  /*let url = req._parsedOriginalUrl;
  if (
    !url.search &&
    !req.url.endsWith("/")
  ) {
    res.writeHead(301, { Location: `${req.url}/` });
    return res.end();
  } */
  next();
};
