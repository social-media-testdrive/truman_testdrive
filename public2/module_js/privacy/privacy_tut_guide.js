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
  if($("#input3").is(":not(:checked)")){
    console.log("input 3 is unchecked");
    $("#protip3").transition('bounce');
  }
};

$('#tut_guide_next').on('click', function () {
  $('#clickNextWarning').hide();
  $('#hiddenEye').show();
  $('#askQuestion').show();
  $('#askQuestion').transition('jiggle');
});

setTimeout(function(){
  $('.sub.header').transition('shake');
}, 1500);

setTimeout(function(){
  $('#point1').transition('jiggle');
}, 2500);



$('#point3_button').on('click', function () {
  if (($('input:checked').length) ==
      ($('input').length)){
    $('.ui.big.labeled.icon.button.cybersim2').addClass('green');
    $('.ui.big.green.labeled.icon.button.cybersim2').transition('jiggle');
  }
  else {
    $('.ui.message').addClass('visible')
    .delay(3000)
    .queue(function() {
      $(this).removeClass('visible').dequeue();
    });
  }
});

$("input").change(function(){
  if (($('input:checked').length) ==
        ($('input').length)){
    $("#checkAllWarning").hide();
    $('.ui.big.labeled.icon.button.cybersim2').addClass('green');
    $('.ui.big.labeled.icon.button.cybersim2').transition('jiggle');
  }
  else{
    $('.ui.big.labeled.icon.button.cybersim2').removeClass('green');
  }
});

$("#privacyTutGuideButton").on('click', function() {
  if (($('input:checked').length) == ($('input').length)){
    //do nothing
  }
  else{
    if($("#hiddenEye").is(":visible")){
      $('#checkAllWarning').show();
      animateUnchecked();
    }else{
      $('#clickNextWarning').show();
      $('#tut_guide_next').transition('bounce');
    }
  }
});
