const path = require('path');
const multer = require('multer');
const Config = require('./config');

const UPLOAD_SETTINGS = {
  storage: multer.diskStorage({ 
    destination: (req, file, cb) => cb(null, 'resources'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  }),
  limits: {
    fileSize: Config.maxUploadSize
  }
};

/**
 * Checking API key validity
 */
const isApiKeyInHeadersValid = (headers) => {
  const apiKey = headers[Config.apiKeyHeader];
  return (apiKey === Config.apiKey);
};

/**
 * Get multer upload object
 */
const getUploadFileHandler = () => (
  multer(UPLOAD_SETTINGS)
    .single(Config.fileFormFieldKey)
);

/**
 * Parse the request and generate base resources URL
 * @param {*} req 
 */
const getResourceBaseUrlFromRequest = (req) => (
  req.protocol + '://' + req.get('host') + '/resources/'
);

module.exports = {
  isApiKeyInHeadersValid,
  getUploadFileHandler,
  getResourceBaseUrlFromRequest
};
