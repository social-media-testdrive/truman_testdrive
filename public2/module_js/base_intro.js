const cdn = "https://dhpd030vnpk29.cloudfront.net/";
const pathArray = window.location.pathname.split('/');

function startIntro(){
  window.location.href='/start/' + pathArray[2];
};

$(window).on('load', function() {
  const moduleName = pathArray[2];
  $.getJSON('/json/moduleInfo.json', function(data) {
    $("#cardImage").attr("src", cdn + data[moduleName]["image"]);
    $("#cardTitle").text(data[moduleName]["title"]);
  });
});

$("#learn, #practice, #explore, #reflect").on('click',
  function() {
    $(this).transition('tada');
  }
);
