const gm = require('gm');
const fs = require('fs');
const Config = require('../config');

const BLUR_FACTOR = 12;
const QUALITY = 80;
const THUMB_EXT = '_thumb.jpg';

fs.readdir(Config.resourceLocation, (err, files) => {

  if (err) {
    console.error('Error getting resource files', err);
    process.exit(1);
  }

  files = _removeThumbFiles(files);

  for (let file of files) {
    let filePath = Config.resourceLocation + file;
    filePath = filePath.replace(/([^:]\/)\/+/g, "$1");
    let image = gm(filePath);
    image.blur(0, BLUR_FACTOR);
    image.quality(QUALITY).write(filePath + THUMB_EXT, (err) => {
      console.log(`Image ${filePath}`);
      if (err) {
        console.error('Error processing image', err);
      } else {
        console.log('Success');
      }
    });
  }

});

const _removeThumbFiles = (files) => {
  return files.filter(file => false === file.endsWith(THUMB_EXT));
};
