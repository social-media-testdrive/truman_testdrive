let actionArray = new Array(); // this array will be handed to Promise.all
const audioChannel = new Audio(); // the audio channel for voiceovers
const pathArray = window.location.pathname.split('/');

function animateUnclickedLabels() {
  $('.keyTermDefinition').each(function(){
    if($(this).is(":hidden")){
      $(this).siblings('.keyTermLabel').transition('bounce');
    }
  })
};

function clickGotIt(){
  if ($('.keyIdeasSegment').is(":hidden")) {
    //User has not yet clicked next
    $('#clickNextWarning').show();
    $('.showKeyTermsButton').transition('bounce');
  } else {
    //determine if all the labeles are clicked
    if ($(".keyTermDefinition:hidden").length === 0) {
      //everything is good to proceed
      $('#clickLabelsWarning').hide();
      Promise.all(actionArray).then(function(){
        window.location.href='/tutorial/' + pathArray[2];
      });
    } else {
      //User has not clicked all the labels
      $('#clickLabelsWarning').show();
      animateUnclickedLabels();
    }
  }
};

function logActionInDB (actionType, keyIdea = '') {
  // log action in db
  const cat = new Object();
  cat.subdirectory1 = pathArray[1];
  cat.subdirectory2 = pathArray[2];
  cat.actionType = actionType;
  if(keyIdea !== ''){
    cat.vocabTerm = keyIdea;
  }
  cat.absoluteTimestamp = Date.now();
  const jqxhr = $.post("/startPageAction", {
    action: cat,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  actionArray.push(jqxhr);
};

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

$(window).on("load", function() {

  addVoiceovers();

  $('.showLearnSectionButton').on('click', function () {
    $('#clickNextWarning').hide();
    $('.learnSegment').show();
    $('.learnSegment .ui.header').transition('jiggle');
    $('.showLearnSectionButton').hide();
    logActionInDB('next_showLearnSection');
  });

  $('.showKeyTermsButton').on('click', function () {
    $('#clickNextWarning').hide();
    $('.showKeyTermsButton').css('display', 'none');
    $('.keyIdeasSegment').show();
    $('.keyIdeasSegment').transition('jiggle');
    if($(".keyTermDefinition:hidden").length === 0){
      $('.ui.labeled.icon.button').addClass('green');
    }
    logActionInDB('next_showKeyIdeas');
  });

  $('.keyTerm').on('click', function (event) {
    $(event.target).closest('.keyTerm').children('.keyTermDefinition').show();
    $(event.target).closest('.keyTerm').transition('tada');
    if ($(".keyTermDefinition:hidden").length === 0) {
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
    const vocabTerm = $(event.target).closest('.keyTerm').children('.keyTermLabel').text();
    logActionInDB('keyIdea', vocabTerm);
  });

});
