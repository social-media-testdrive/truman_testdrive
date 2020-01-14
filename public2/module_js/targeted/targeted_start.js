//a function to animate any unclicked labels, used for error messaging
function animateUnclickedLabels() {
  if($('#audience_info').is(":hidden")){
    $('#audienceLabel').transition('bounce');
  }
  if($('#private_information_info').is(":hidden")){
    $('#privateInformationLabel').transition('bounce');
  }
  if($('#risky_info').is(":hidden")){
    $('#riskyLabel').transition('bounce');
  }
};

$('#introduction_next').on('click', function () {
  $('#clickNextWarning').hide();
  $('#question').show();
  $('#question').transition('jiggle');
  if(!($('#question').is(":hidden") ||  $('#private_information_info').is(":hidden") || $('#audience_info').is(":hidden") || $('#risky_info').is(":hidden"))){
    $('.ui.labeled.icon.button').addClass('green');
  }
});

$('#audience').on('click', function () {
    $('#audience_info').show();
    $('#audience').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#private_information_info').is(":hidden") || $('#audience_info').is(":hidden")|| $('#risky_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

$('#private_information').on('click', function () {
    $('#private_information_info').show();
    $('#private_information').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#private_information_info').is(":hidden") || $('#audience_info').is(":hidden") || $('#risky_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

 $('#risky').on('click', function () {
    $('#risky_info').show();
    $('#risky').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#private_information_info').is(":hidden") || $('#audience_info').is(":hidden") || $('#risky_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});


function startIntro(){
    if($('#question').is(":hidden")){
      //User has not clicked next
      $('#clickNextWarning').show();
      $('#introduction_next').transition('bounce');
    }else{
      var clickedAllLabels = ($('#audience_info').is(":visible") && $('#private_information_info').is(":visible") &&  $('#risky_info').is(":visible"));
      if(clickedAllLabels == true){
        //everything is good to proceed
        $('#clickLabelsWarning').hide();
        window.location.href='/tutorial/targeted';
      } else {
        //User has not clicked all the labels
        $('#clickLabelsWarning').show();
        animateUnclickedLabels();
      }
    }
    };
