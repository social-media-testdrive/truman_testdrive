//a function to animate any unclicked labels, used for error messaging
function animateUnclickedLabels() {
  if($('#audience_info').is(":hidden")){
    $('#audienceLabel').transition('bounce');
  }
  if($('#anonymous_info').is(":hidden")){
    $('#anonymousLabel').transition('bounce');
  }
  if($('#curate_info').is(":hidden")){
    $('#curateLabel').transition('bounce');
  }
};

$('#introduction_next').on('click', function () {
  $('#clickNextWarning').hide();
  $('#question').show();
  $('#question').transition('jiggle');
  if(!($('#question').is(":hidden") ||  $('#anonymous_info').is(":hidden") || $('#audience_info').is(":hidden") || $('#curate_info').is(":hidden"))){
    $('.ui.labeled.icon.button').addClass('green');
  }
});

$('#audience').on('click', function () {
    $('#audience_info').show();
    $('#audience').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#anonymous_info').is(":hidden") || $('#audience_info').is(":hidden")|| $('#curate_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

$('#anonymous').on('click', function () {
    $('#anonymous_info').show();
    $('#anonymous').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#anonymous_info').is(":hidden") || $('#audience_info').is(":hidden") || $('#curate_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

 $('#curate').on('click', function () {
    $('#curate_info').show();
    $('#curate').transition('tada');     
    if(!($('#question').is(":hidden") ||  $('#anonymous_info').is(":hidden") || $('#audience_info').is(":hidden") || $('#curate_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});


function startIntro(){
  if($('#question').is(":hidden")){
    //User has not clicked next
    $('#clickNextWarning').show();
    $('#introduction_next').transition('bounce');
  } else {
    var clickedAllLabels = ($('#anonymous_info').is(":visible") && $('#audience_info').is(":visible") &&  $('#curate_info').is(":visible"));
    if(clickedAllLabels == true){
      //everything is good to proceed
      $('#clickLabelsWarning').hide();
      window.location.href='/tutorial/cyberbullying';
    } else {
      //User has not clicked all the labels
      $('#clickLabelsWarning').show();
      animateUnclickedLabels();
    }
  }
};
