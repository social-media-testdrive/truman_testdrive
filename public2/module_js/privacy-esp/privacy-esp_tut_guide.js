// adds bounce animation to any unchecked boxes
function animateUnchecked(){
  $('.requiredCheckboxInput').each(function(){
    if ($(this).is(':not(:checked)')) {
      $(this).closest('.requiredCheckbox').transition('bounce')
    }
  });
};

$(window).on('load', function() {



  Voiceovers.addVoiceovers();
  $('#tut_guide_start').on('click', function() {
    const hiddenSegment = $(this).siblings('.basic.segment');
    $(hiddenSegment).removeClass('hidden');
    $(hiddenSegment).children('.header').transition('jiggle')
    $(this).css('display','none');
    $('#clickStartWarning').hide();
  });

  $('#tut_guide_next').on('click', function () {
    $('#clickNextWarning').hide();
    $('#instructionSegment').show();
    $('#askQuestion').show();
    $('#askQuestion').transition('jiggle');
  });

  $("input").change(function(){
    if (($('.requiredCheckboxInput:checked').length) === ($('.requiredCheckboxInput').length)){
      $("#checkAllWarning").hide();
      $('.ui.big.labeled.icon.button.cybersim2').addClass('green');
      $('.ui.big.labeled.icon.button.cybersim2').transition('jiggle');
    } else {
      $('.ui.big.labeled.icon.button.cybersim2').removeClass('green');
    }
  });

  $("#privacyTutGuideButton").on('click', function() {
    if (!$(this).hasClass('green')){
      if($('#tut_guide_start').siblings('.segment').is(':hidden')){
        $('#clickStartWarning').show();
        $('#tut_guide_start').transition('bounce');
      } else if ($("#instructionSegment").is(":visible")) {
        $('#checkAllWarning').show();
        animateUnchecked();
      } else {
        $('#clickNextWarning').show();
        $('#tut_guide_next').transition('bounce');
      }
    }
  });
});
