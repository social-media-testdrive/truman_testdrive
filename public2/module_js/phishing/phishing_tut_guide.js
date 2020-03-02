function animateUnchecked(){
  if($("#checkbox1").is(":not(:checked)")){
    $("#item1").transition('bounce');
  }
  if($("#checkbox2").is(":not(:checked)")){
    $("#item2").transition('bounce');
  }
  if($("#checkbox3").is(":not(:checked)")){
    $("#item3").transition('bounce');
  }
};

function checkStatus(){
  if (($('input:checked').length) ==
        ($('input').length)){
    $("#checkAllWarning").hide();
    $('.ui.big.labeled.icon.button').addClass('green');
    $('.ui.big.labeled.icon.button').transition('jiggle');
  }
  else{
    $('.ui.big.labeled.icon.button').removeClass('green');
  }
};

function clickGotIt(){
  if (($('input:checked').length) == ($('input').length)){
        window.location.href='/sim/phishing';
  }
  else{
    $('#checkAllWarning').show();
    animateUnchecked();
  }
};

setTimeout(function(){
  $('.sub.header').transition('shake');
}, 1500);


$("input").change(function(){ checkStatus(); });
$("#phishingTutGuideButton").on('click', function() { clickGotIt() });
