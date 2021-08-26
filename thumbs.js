const thumb = require('node-thumbnail').thumb;
const fs = require('fs');

fs.mkdir('./thumb_images', (err) => {
  if (err) {
    console.log("error occurred in creating new directory", err);
    return;
  }
});

var options = {
  prefix: 'thumb_',
  suffix: '',
  width: 400,
  concurrency: 2,
  quiet: false, // if set to 'true', console.log status messages will be supressed
  overwrite: true,
  skip: true, // Skip generation of existing thumbnails
  ignore: true, // Ignore unsupported files in "dest"
  source: 'cache_images', // could be a filename: dest/path/image.jpg
  destination: 'thumb_images'
};

thumb(options, function(files, err, stdout, stderr) {
  console.log('All done!');
});
