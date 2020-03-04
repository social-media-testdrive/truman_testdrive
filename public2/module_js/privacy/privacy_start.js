
//a function to animate any unclicked labels, used for error messaging
function animateUnclickedLabels() {
  if($('#privacyConcept_info').is(":hidden")){
    $('#privacyLabel').transition('bounce');
  }
  if($('#settingsConcept_info').is(":hidden")){
    $('#settingsLabel').transition('bounce');
  }
  if($('#policyConcept_info').is(":hidden")){
    $('#privacyPolicyLabel').transition('bounce');
  }
  if($('#optOut_info').is(":hidden")){
    $('#optOutLabel').transition('bounce');
  }
};

$('#introduction_next').on('click', function () {
  $("#clickNextWarning").hide();
  $('#question').show();
  $('#question').transition('jiggle');
  if(!($('#question').is(":hidden") || $('#optOut_info').is(":hidden") || $('#settingsConcept_info').is(":hidden") || $('#policyConcept_info').is(":hidden") || $('#privacyConcept_info').is(":hidden"))){
    $('.ui.labeled.icon.button').addClass('green');
  }
});

$('#privacyConcept').on('click', function () {
    $('#privacyConcept_info').show();
    $('#privacyConcept').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#privacyConcept_info').is(":hidden") || $('#settingsConcept_info').is(":hidden")|| $('#policyConcept_info').is(":hidden") || $('#optOut_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

$('#settingsConcept').on('click', function () {
    $('#settingsConcept_info').show();
    $('#settingsConcept').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#privacyConcept_info').is(":hidden") || $('#settingsConcept_info').is(":hidden")|| $('#policyConcept_info').is(":hidden") || $('#optOut_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

 $('#privacyPolicyConcept').on('click', function () {
    $('#policyConcept_info').show();
    $('#privacyPolicyConcept').transition('tada');
    if(!($('#question').is(":hidden") ||  $('#privacyConcept_info').is(":hidden") || $('#settingsConcept_info').is(":hidden")|| $('#policyConcept_info').is(":hidden") || $('#optOut_info').is(":hidden"))){
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
});

$('#optOut').on('click', function () {
   $('#optOut_info').show();
   $('#optOut').transition('tada');
   if(!($('#question').is(":hidden") ||  $('#privacyConcept_info').is(":hidden") || $('#settingsConcept_info').is(":hidden")|| $('#policyConcept_info').is(":hidden") || $('#optOut_info').is(":hidden"))){
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
    var clickedAllLabels = ($('#privacyConcept_info').is(":visible") && $('#settingsConcept_info').is(":visible") &&  $('#policyConcept_info').is(":visible")  &&  $('#optOut_info').is(":visible"));
    if(clickedAllLabels == true){
      //everything is good to proceed
      $('#clickLabelsWarning').hide();
      window.location.href='/tut_guide/privacy';
    } else {
      //User has not clicked all the labels
      $('#clickLabelsWarning').show();
      animateUnclickedLabels();
    }
  }
};
