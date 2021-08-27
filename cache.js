const fs = require('fs');
const rimraf = require("rimraf");
const request = require('request');
const fetch = require('node-fetch');

let urlissue = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395';
let comments_per_page = 100
let page_limit = 2

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    if(res && res.headers && res.headers['content-type'].substr(0, 5) === 'image'){
      console.log('content-type:', res.headers['content-type']);
      request(uri).pipe(fs.createWriteStream("./cache_images/"+filename))
        .on('close', callback)
        .on('error', function(){
          console.log('error downloading:', uri);
        });
    }
    else{
      console.log('NOPE url:', uri);
      if(res && res.headers && res.headers['content-type']){
      console.log('    content-type:', res.headers['content-type']);
      }
    }
  });
};

rimraf.sync("./cache_images");
fs.mkdir('./cache_images', (err) => {
  if (err) {
    console.log("error occurred in creating new directory", err);
    return;
  }
});

fetch(urlissue, { method: "Get" })
  .then(res => res.json())
  .then((json) => {

    // convert JSON object to string
    const data = JSON.stringify(json);

    // write JSON string to a file
    fs.writeFile('./build/cache_jsons/issue.json', data, (err) => {
      if (err) {
        throw err;
      }
    });

    let comments_num = json.comments
    let pages = Math.ceil(comments_num / comments_per_page);
    if( page_limit > 0 && page_limit < pages){
      pages = page_limit;
    }
    for (let i = 1; i <= pages ; i++) {
      let urlcomments = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395/comments?per_page='+comments_per_page+'&page='+i;

      fetch(urlcomments, { method: "Get" })
        .then(res => res.json())
        .then((json2) => {

          // convert JSON object to string
          const data2 = JSON.stringify(json2);

          // write JSON string to a file
          fs.writeFile('./build/cache_jsons/comments_page_'+i+'.json', data2, (err) => {
            if (err) {
              throw err;
            }
          });


          json2.forEach(function(comment){
            var matches = comment.body.match(/\bhttps?::\/\/\S+/gi) || comment.body.match(/\bhttps?:\/\/\S+/gi);
            if(matches){
              matches.forEach(function(imageUrl){
                imageUrl = imageUrl.replace(")", "")
                var extension = imageUrl.split('.').pop();
                var filename2 = encodeURIComponent(imageUrl); // + "." + extension;
                console.log(filename2);
                download(imageUrl, filename2, function(){console.log('download done')});
              })
            }

          });
        });
    }
  });
