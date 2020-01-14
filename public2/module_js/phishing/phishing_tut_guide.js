//function to animate unchecked boxes, used with error messaging.
function animateUnchecked(){
  if($("#input1").is(":not(:checked)")){
    console.log("input 1 is unchecked");
    $("#protip1").transition('bounce');
  }
  if($("#input2").is(":not(:checked)")){
    console.log("input 2 is unchecked");
    $("#protip2").transition('bounce');
  }
};

setTimeout(function(){
  $('.sub.header').transition('shake');
}, 1500);

setTimeout(function(){
  $('#point1').transition('jiggle');
}, 2500);

$("input").change(function(){
  if (($('input:checked').length) ==
        ($('input').length)){
    $("#checkAllWarning").hide();
    $('.ui.big.labeled.icon.button').addClass('green');
    $('.ui.big.labeled.icon.button').transition('jiggle');
  }
  else{
    $('.ui.big.labeled.icon.button').removeClass('green');
  }
});

$("#phishingTutGuideButton").on('click', function() {
  if (($('input:checked').length) == ($('input').length)){
        window.location.href='/sim/phishing';
  }
  else{
    $('#checkAllWarning').show();
    animateUnchecked();
  }
})
