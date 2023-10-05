function clickGotIt(){
  if ($('.reviewSegment').is(":hidden")) {
    //User has not yet clicked next
    $('.clickNextWarning').show();
    $('.showReviewSectionButton').transition('bounce');
  } else {
    //everything is good to proceed
    $('#clickLabelsWarning').hide();
    Voiceovers.pauseVoiceover();
    const pathArray = window.location.pathname.split('/');
    window.location.href=`/${nextPage}/${pathArray[2]}`;
  }
};

$(window).on("load", function() {
  Voiceovers.addVoiceovers();

  $('.showReviewSectionButton').on('click', function(){
    $('.reviewSegment').show();
    $('.reviewSegment').transition('jiggle');
    $('.clickNextWarning').hide();
    $('.showReviewSectionButton').css('display','none');
    $('.gotItButton').addClass('green');
  })
});
