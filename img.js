const useCacheJson = false;

function getPages(){
  var url = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395';
  if(useCacheJson){
    url = './cache_jsons/issue.json';
  }
  var pag = '';

  $.getJSON(url, function(data){
    console.log(data)
    var comments_num = data.comments
    var pages = Math.ceil(comments_num / comments_per_page);
    pag += '<nav aria-label="...">';
    pag += '<ul class="pagination" >';
    pag += '';

    if(current_page==1){
      pag += '<li class="page-item disabled">';
    }
    else{
      pag += '<li class="page-item">';
    }
    pag += '<a class="page-link" href="/?page=1" tabindex="-1">Previous</a>';

    pag += '</li>';
    for (let i = 1; i <= pages ; i++) {

      if(current_page == i){
        pag += '<li class="page-item active"> <a class="page-link" href="/?page='+i+'">'+i+' <span class="sr-only">(current)</span></a> </li>';
      }
      else{
        pag +='<li class="page-item"><a class="page-link" href="?page='+i+'">'+i+'</a></li>';
      }
    }

    if(current_page>=pages){
      pag += '<li class="page-item disabled">';
    }
    else{
      pag += '<li class="page-item">';
    }
    pag += '<a class="page-link" href="/?page='+pages+'">Next</a>';

    pag += '</ul>';
    pag += '</nav>';

    $('.pag').html(pag);
  });

}

function urlExists(url, callback){
  $.ajax({
    type: 'HEAD',
    url: url,
    success: function(){
      console.log("success??")
      callback(true);
    },
    error: function() {
      callback(false);
    }
  });
}

function checkvalidImg(url){

  var ext = url.split('.').pop();
  if(ext == 'jpg' || ext == 'png' || ext == 'gif' || ext =='webp'){
    return true;
  }
  return false;
}

function getCommentsPage(){
  var photoHTML = "";
  const imgreg= /!\[(.*?)\]\((.*?)\)/gim
  const regexMdImg = /!\[([^\[]+)\](\(.*\))/gm
  //const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm
  const regexMdLinks = /(?:__|[*#])|\[(.*?)\]\((.*?)\)/gm
  $.getJSON("./cache_jsons/thumbs.json", function(){
  })
    .always(function(thumbs) {

      var url = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395/comments?per_page='+comments_per_page+'&page='+current_page;
      if(useCacheJson){
        url = `./cache_jsons/comments_page_${current_page}.json`;
      }

      $.getJSON(url, function(data){
        $.each(data,function(i,comment) {

          var matches = comment.body.match(regexMdImg)
          photoHTML += '';

          if(matches){

            $.each(matches,function(i,photo) {

              const singleMatch = /!\[([^\[]+)\]\((.*)\)/
              var text = singleMatch.exec(photo)
              photo = text[2];

              if(checkvalidImg(photo)){
                cache_file = "thumb_"+encodeURIComponent(photo);
                cache_file2 = encodeURIComponent(cache_file);
                var thumb_img = photo;
                if(Array.isArray(thumbs) && thumbs.includes(cache_file)){
                  thumb_img = `./thumb_images/${cache_file2}`;
                }

                var body = comment.body;
                body = body.replace(imgreg,'');
                body = body.replace(regexMdLinks, '<a href="$2">$1</a>');

                photoHTML += `
                  <div class="col-lg-3 col-md-4 col-xs-6 thumb">

                    <div class="card shadow mb-3" style="xwidth: 18rem;">
                      <a href="${photo}" class="fancybox"
                      data-fancybox="gallery"

                      rel="ligthbox" title="By ${comment.user.login}" >
                      <img src="${thumb_img}" class="zoom img-fluid card-img-top"alt="">
                      </a>

                      <div class="card-body">
                        <h5 class="card-title">By ${comment.user.login}</h5>
                        <a href="${comment.html_url}" class="">see on github</a>
                        <p class="card-text">${body}</p>
                      </div>

                    </div>

                  </div>
                    `;

              }

            });
          }

          photoHTML += '';
        });
        $('#photos').html(photoHTML);

        Fancybox.bind('[data-fancybox="gallery"]', {
          Toolbar: {
            display: [
              { id: "prev", position: "center" },
              { id: "counter", position: "center" },
              { id: "next", position: "center" },
              "zoom",
              "fullscreen",
              "close",
            ],
          },
        });
      });
    });
}

var current_page = 1;
var comments_per_page = 50;

var urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('page')){
  current_page = urlParams.get('page');
}

$(document).ready(function() {

  getPages();
  getCommentsPage();

});
