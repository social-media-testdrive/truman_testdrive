const cdn = "https://dhpd030vnpk29.cloudfront.net/";
const pathArray = window.location.pathname.split('/');

function startIntro(){
  const modNameNoDashes = pathArray[2].replace('-','');
  $.post("/moduleProgress", {
    module: modNameNoDashes,
    status: 'started',
    _csrf: $('meta[name="csrf-token"]').attr('content')
  }).then(function(){
    window.location.href='/start/' + pathArray[2];
  })
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
