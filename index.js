const express = require('express');
const Helper = require('./helper');
const Config = require('./config');

const app = express();

/**
 * Expose static resources
 */
app.use(Config.resourceLocation, express.static('resources'));

/**
 * Upload resource endpoint
 */
app.post('/resources/upload', function (req, res) {
  if (! Helper.isApiKeyInHeadersValid(req.headers)) {
    return res.status(401).json({ error: 'Wrong api key!' });
  }

  const upload = Helper.getUploadFileHandler();
  upload(req, res, function (err) {
    if (err) {
      console.error(err, 'File was not uploaded!');
      res.status(500).send('Couldnt upload the file');
      return false;
    }
    const resourceUrl = Helper.getResourceBaseUrlFromRequest(req) + req.file.filename;
    res.status(200).send(resourceUrl);
  });
});

app.listen(3002, () => {
  console.log(`Content server listening on port 3002`);
});
