//a function to animate any unclicked labels, used for error messaging
function animateUnclickedLabels() {
  if($('#digital_footprint_info').is(":hidden")){
    $('#digitalFootprintLabel').transition('bounce');
  }
  if($('#audience_digfoot_info').is(":hidden")){
    $('#audienceDigfootLabel').transition('bounce');
  }
  if($('#oversharing_info').is(":hidden")){
    $('#oversharingLabel').transition('bounce');
  }
};

$('#introduction_next').on('click', function () {
  $('#clickNextWarning').hide();
  $('#question').show();
  $('#question').transition('jiggle');
  if(!($('#question').is(":hidden") ||  $('#oversharing_info').is(":hidden") || $('#digital_footprint_info').is(":hidden") || $('#audience_digfoot_info').is(":hidden"))){
    $('.ui.labeled.icon.button').addClass('green');
  }
});

$('#oversharing').on('click', function () {
    $('#oversharing_info').show();
    $('#oversharing').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#digital_footprint_info').is(":hidden") || $('#audience_digfoot_info').is(":hidden")|| $('#oversharing_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

$('#digital_footprint').on('click', function () {
    $('#digital_footprint_info').show();
    $('#digital_footprint').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#digital_footprint_info').is(":hidden") || $('#audience_digfoot_info').is(":hidden")|| $('#oversharing_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

$('#audence_digfoot').on('click', function () {
  $('#audience_digfoot_info').show();
  $('#audence_digfoot').transition('tada');
  if(!($('#question').is(":hidden") ||  $('#digital_footprint_info').is(":hidden") || $('#audience_digfoot_info').is(":hidden")|| $('#oversharing_info').is(":hidden"))){
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
    var clickedAllLabels = ($('#audience_digfoot_info').is(":visible") && $('#digital_footprint_info').is(":visible") &&  $('#oversharing_info').is(":visible"));
    if(clickedAllLabels == true){
      //everything is good to proceed
      $('#clickLabelsWarning').hide();
      window.location.href='/tutorial/digfoot';
    } else {
      //User has not clicked all the labels
      $('#clickLabelsWarning').show();
      animateUnclickedLabels();
    }
  }
};
