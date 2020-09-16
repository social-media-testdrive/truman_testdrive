const pathArray = window.location.pathname.split('/');
const audioChannel = new Audio();

function playVoiceover(audioFile) {
  const subdirectory2 = pathArray[2];
  if (audioFile !== '') {
    audioChannel.src = `/audioFiles/${subdirectory2}/${audioFile}`;
    let playVoiceoverPromise = audioChannel.play();
    if (playVoiceoverPromise !== undefined) {
      playVoiceoverPromise.catch(error => {
        if (error.name === 'NotAllowedError') {
          console.log(`** Browser has determined that audio is not allowed to play yet. **`);
        } else {
          console.log(error)
        }
      });
    }
  } else {
    console.log(`** No audio filename provided for step ${index}. If this is expected, then ignore this message. **`);
  }
};

function addVoiceovers() {
  for (const element in voiceoverMappings) {
    $(element).on('click', function(){
      playVoiceover(voiceoverMappings[element]);
    });
  }
};

function clickGotIt(){
  if ($('.reviewSegment').is(":hidden")) {
    //User has not yet clicked next
    $('.clickNextWarning').show();
    $('.showReviewSectionButton').transition('bounce');
  } else {
    //everything is good to proceed
    $('#clickLabelsWarning').hide();
    audioChannel.pause();
    window.location.href=`/trans_script/${pathArray[2]}`;
  }
};

$(window).on("load", function() {
  addVoiceovers();

  $('.showReviewSectionButton').on('click', function(){
    $('.reviewSegment').show();
    $('.reviewSegment').transition('jiggle');
    $('.clickNextWarning').hide();
    $('.showReviewSectionButton').css('display','none');
    $('.gotItButton').addClass('green');
  })
});
