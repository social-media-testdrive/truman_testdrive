$('.ui.accordion').accordion({
  onOpen: function(){
    Voiceovers.pauseVoiceover();
    let voiceoverKey = $(this).prev('.title').attr('data-voiceoverIndex');
    Voiceovers.resetVoiceoverSequenceCount();
    const voiceoverInfo = voiceoverMappings[voiceoverKey];
    setTimeout(function(){
      Voiceovers.playVoiceover(voiceoverInfo["files"],voiceoverInfo["delay"]);
    },voiceoverInfo["initialDelay"]);
  },
  onClosing: function(){
    Voiceovers.pauseVoiceover();
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


$('#point1_button').on('click', function () {

  $('#point2').transition('jiggle');
  $('#point2').click();

});



$("input").change(function(){
  if (($('input:checked').length) ==
        ($('input').length)){
    $("#checkAllBoxesWarning").hide();
    $('.ui.big.labeled.icon.button.cybersim').addClass('green');
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
