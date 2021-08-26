const fs = require('fs');
const request = require('request');
const fetch = require('node-fetch');

let urlissue = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395';
let comments_per_page = 100

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      if(res && res.headers && res.headers['content-type'].substr(0, 5) === 'image'){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      }
      //console.log('content-length:', res.headers['content-length']);
    });
};


/*
function fetchImage(url, localPath) {
  var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if(allowedExtensions.exec(url)){

    console.log(url);
    console.log(localPath);

    request(url, function(err, response, body) {
      console.log(response.statusCode);
      if (response.statusCode === 200) {
        fs.write(localPath, response.body, function() {
          console.log('Successfully downloaded file ' + url);
        });
      }
    });
  }
}
*/

fs.mkdir('./cache_images', (err) => {
  if (err) {
    console.log("error occurred in creating new directory", err);
    return;
  }
});

fetch(urlissue, { method: "Get" })
  .then(res => res.json())
  .then((json) => {

    let comments_num = json.comments
    let pages = Math.ceil(comments_num / comments_per_page);
    for (let i = 1; i <= pages ; i++) {
      let urlcomments = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395/comments?per_page='+comments_per_page+'&page='+i;

      fetch(urlcomments, { method: "Get" })
        .then(res => res.json())
        .then((json2) => {

          json2.forEach(function(comment){
            var matches = comment.body.match(/\bhttps?::\/\/\S+/gi) || comment.body.match(/\bhttps?:\/\/\S+/gi);
            if(matches){
              matches.forEach(function(imageUrl){
                imageUrl = imageUrl.replace(")", "")
                var extension = imageUrl.split('.').pop();
                filename = "./cache_images/"+Buffer.from(imageUrl).toString('base64').replace(/\//g, 'ForwardSlash'); +"."+extension;
                download(imageUrl, filename, function(){console.log('download done')});
              })
            }

          });
        });
    }
  });
