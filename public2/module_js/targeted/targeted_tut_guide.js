$('.ui.accordion').accordion();

$('.ui.accordion .title').on('click',function(){
  Voiceovers.pauseVoiceover();
  if(!$(this).hasClass('active')){
    let voiceoverKey = $(this).attr('data-voiceoverIndex');
    Voiceovers.resetVoiceoverSequenceCount();
    const voiceoverInfo = voiceoverMappings[voiceoverKey];
    setTimeout(function(){
      Voiceovers.playVoiceover(voiceoverInfo["files"],voiceoverInfo["delay"]);
    },voiceoverInfo["initialDelay"]);
  }
});

setTimeout(function(){
  $('.sub.header').transition('shake');
}, 1500);

setTimeout(function(){
  $('#point1').transition('jiggle');
}, 2500);

setTimeout(function(){
  $('#point2').transition('jiggle');
}, 3000);

setTimeout(function(){
  $('#point3').transition('jiggle');
}, 3500);

$('#point1_button').on('click', function () {
    $('#point2').click();
 });

 $('#point2_button').on('click', function () {
     $('#point3').click();
  });


$("input").change(function(){
  if (($('input:checked').length) ==
        ($('input').length)){
    $("#checkAllBoxesWarning").hide();
    $('.ui.big.labeled.icon.button.cybersim').addClass('green');
    //$("#infoMessage").show();
    //$("#infoMessage").transition('jiggle');

    $('.ui.big.labeled.icon.button.cybersim').transition('jiggle');
  }
  else{
    $('.ui.big.labeled.icon.button.cybersim').removeClass('green');
  }
});

$("#cyberSimButton").on('click', function() {
  if(($('input:checked').length) != ($('input').length)){
    $("#checkAllBoxesWarning").show();
  }
});
