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
 * Checking the API key
 */
app.use(function(req, res, next) {
  const apiKey = req.headers[Config.apiKeyHeader];
  if (apiKey !== Config.apiKey) {
    return res.status(401).json({ error: 'Wrong api key!' });
  }
  next();
});

/**
 * Uploading new resource endpoint
 */
app.post('/upload', function (req, res) {
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

app.listen(3002, () => {
  console.log(`Content server listening on port 3002`);
});
