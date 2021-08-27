const thumb = require('node-thumbnail').thumb;
const rimraf = require("rimraf");
const fs = require('fs');

rimraf.sync("./thumb_images");
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
  quiet: false, // if set to 'true', console.log status messages will be supressed
  overwrite: true,
  skip: false, // Skip generation of existing thumbnails
  ignore: true, // Ignore unsupported files in "dest"
  source: 'cache_images', // could be a filename: dest/path/image.jpg
  destination: 'thumb_images'
};

thumb(options, function(files, err, stdout, stderr) {
  console.log('All done!');
  // list all files in the directory
  fs.readdir('./thumb_images', (err, files) => {
    if (err) {
      throw err;
    }

    // convert JSON object to string
    const data = JSON.stringify(files);

    // write JSON string to a file
    fs.writeFile('./cache_jsons/thumbs.json', data, (err) => {
      if (err) {
        throw err;
      }
    });

    // files object contains all files names
    // log them on console
    files.forEach(file => {
      console.log(file);
    });
  });
});


