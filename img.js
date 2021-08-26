
function getPages(){
  var url = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395';
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

    console.log(pages);
    console.log(current_page);
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

function checkvalidImg(url){

  var ext = url.split('.').pop();
  if(ext == 'jpg' || ext == 'png' || ext == 'gif' || ext =='webp'){
    return true;
  }
  return false;
}

function getCommentsPage(){
  var photoHTML = "";
  var url = 'https://api.github.com/repos/awesomeWM/awesome/issues/1395/comments?per_page='+comments_per_page+'&page='+current_page;
  $.getJSON(url, function(data){
    $.each(data,function(i,comment) {

      var matches = comment.body.match(/\bhttps?::\/\/\S+/gi) || comment.body.match(/\bhttps?:\/\/\S+/gi);
      photoHTML += '';

      if(matches){
        $.each(matches,function(i,photo) {
          photo = photo.replace(")", "")
          if(checkvalidImg(photo)){
            photoHTML += '<div class="col-lg-3 col-md-4 col-xs-6 thumb"> <a href="'+photo+'" class="fancybox" rel="ligthbox"> <img  src="'+photo+'" class="zoom img-fluid "  alt=""> </a> By '+ comment.user.login +' </div>';
          }
        });
      }

      photoHTML += '';
    });
    $('#photos').html(photoHTML);
    $(".fancybox").fancybox({
      openEffect: "none",
      closeEffect: "none"
    });

    $(".zoom").hover(function(){
      $(this).addClass('transition');
    }, function(){
      $(this).removeClass('transition');
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


