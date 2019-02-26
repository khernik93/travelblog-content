const express = require('express');
const path = require('path');
const multer = require('multer');
const Config = require('./config');

const app = express();

/**
 * Expose static files
 */
app.use(express.static('resources'));

/**
 * File upload config
 */
const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, 'resources')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

/**
 * Uploading new resource endpoint
 */
app.post('/upload', function (req, res) {
  if (! _isApiKeyHeaderValid(req)) {
    return res.status(401).json({ error: 'Wrong api key!' });
  }
  const upload = multer({storage}).single('file');
  upload(req, res, function (err) {
    if (err) {
      console.error(err, 'File was not uploaded!');
      res.status(500).send('Internal server error');
      return false;
    }
    const url = _getResourceBaseUrl() + req.file.filename;
    res.status(200).send(url);
  });
});

const _getResourceBaseUrl = () => (
  req.protocol + '://' + req.get('host') + '/resources/'
);

/**
 * Checking API key validity
 */
const _isApiKeyHeaderValid = () => {
  const apiKey = req.headers[Config.apiKeyHeader];
  return (apiKey === Config.apiKey);
};

app.listen(3002, () => {
  console.log(`Content server listening on port 3002`);
});
