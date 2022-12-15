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
  if (($('input.checkbox:checked').length) ==
        ($('input.checkbox').length)){
    $("#checkAllWarning").hide();
    $('.ui.big.labeled.icon.button').addClass('green');
    $('.ui.big.labeled.icon.button').transition('jiggle');
  }
  else{
    $('.ui.big.labeled.icon.button').removeClass('green');
  }
};

function clickGotIt(){
  if ($('.reviewSegment').is(':hidden')){
    $('.clickNextWarning').show();
    $('.showReviewSectionButton').transition("bounce");
  } else if (($('input.checkbox:checked').length) == ($('input.checkbox').length)){
    window.location.href='/sim/phishing';
  } else {
    $('#checkAllWarning').show();
    animateUnchecked();
  }
};

setTimeout( function(){
  $('.sub.header').transition('shake');
}, 1500);

$(window).on("load", function(){
  Voiceovers.addVoiceovers();
  $("input.checkbox").change( function() {
    checkStatus();
  });
  $("#phishingTutGuideButton").on('click', function() {
    clickGotIt()
  });
  $('.showReviewSectionButton').on('click', function(){
    $('.reviewSegment').show();
    $('.clickNextWarning').hide();
    $('.showReviewSectionButton').css('display','none');
    $('.gotItButton').addClass('green');
  })
})
