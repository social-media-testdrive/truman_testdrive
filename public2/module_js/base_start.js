let actionArray = new Array(); // this array will be handed to Promise.all
const pathArray = window.location.pathname.split('/');

function animateUnclickedLabels() {
  $('.keyTermDefinition').each(function(){
    if($(this).is(":hidden")){
      $(this).siblings('.keyTermLabel').transition('bounce');
    }
  })
};

function clickGotIt(){
  if($('.learnSegment').is(':hidden')){
    //User has not yet clicked next
    $('#clickNextWarning').show();
    $('.showLearnSectionButton').transition('bounce');
  }
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

function logActionInDB (enableDataCollection, actionType, keyIdea = '') {
  // check if data collection is enabled first
  if (!enableDataCollection) {
    return;
  }
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

$(window).on("load", async function() {

  Voiceovers.addVoiceovers();
  const enableDataCollection = await $.get('/isDataCollectionEnabled');
  $('.showLearnSectionButton').on('click', function () {
    $('#clickNextWarning').hide();
    $('.learnSegment').show();
    $('.learnSegment .ui.header').transition('jiggle');
    $('.showLearnSectionButton').parent('.ui.segment').hide();
    logActionInDB(enableDataCollection, 'next_showLearnSection');
  });

  $('.showKeyTermsButton').on('click', function () {
    $('#clickNextWarning').hide();
    $('.showKeyTermsButton').css('display', 'none');
    $('.keyIdeasSegment').show();
    $('.keyIdeasSegment').transition('jiggle');
    if($(".keyTermDefinition:hidden").length === 0){
      $('.ui.labeled.icon.button').addClass('green');
    }
    logActionInDB(enableDataCollection, 'next_showKeyIdeas');
  });

  $('.keyTerm').on('click', function (event) {
    $(event.target).closest('.keyTerm').children('.keyTermDefinition').show();
    $(event.target).closest('.keyTerm').transition('tada');
    if ($(".keyTermDefinition:hidden").length === 0) {
      $('#clickLabelsWarning').hide();
      $('.ui.labeled.icon.button').addClass('green');
    }
    const vocabTerm = $(event.target).closest('.keyTerm').children('.keyTermLabel').text();
    logActionInDB(enableDataCollection, 'keyIdea', vocabTerm);
  });

});
