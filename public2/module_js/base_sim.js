let clickedHints = 0;
let closedHints = 0;
const numberOfHints = hintsList.length;

let jqhxrArray = new Array(); // this array will be handed to Promise.all
let startTimestamp = Date.now();
let pathArray = window.location.pathname.split('/');
const subdirectory1 = pathArray[1];
const subdirectory2 = pathArray[2];
let hintNumber = 0; // updates to match the most recently opened blue dot
let hintOpenTimestamp = Date.now(); // updates whenever a blue dot is opened
let closedHint = false;

// Automatically add unique card IDs to guided activity posts and comments
// Each post/comment must have an ID to have any actions on it written to the DB
function addCardIds(){
  let id = 1;
  let idString = "";
  $('.ui.fluid.card').each(function(){
     idString = `${subdirectory2}_${subdirectory1}_post${id}`;
    $(this).attr('postID', idString);
    // give comments IDs as well
    let commentID = 1;
    let commentIdString = "";
    $(this).find('.comment').not('.like').not('.flag').each(function(){
      commentIdString = `${subdirectory2}_${subdirectory1}_post${id}_comment${commentID}`;
      $(this).attr('commentID', commentIdString);
      commentID++;
    })
    id++;
  });
}

// Requires a boolean parameter indicating if the user clicked 'got it'
// It is very important that this parameter be correct when using this function,
// as it is an important distinction to the researchers.
function recordHintAction(userClickedGotIt){
  let cat = new Object();
  cat.subdirectory1 = subdirectory1;
  cat.subdirectory2 = subdirectory2;
  cat.dotNumber = hintNumber; // which hint was most recently interacted with
  cat.absoluteTimeOpened = hintOpenTimestamp; // timestamp of hint being opened
  cat.viewDuration = Date.now() - hintOpenTimestamp; // how long the hint was open for
  cat.clickedGotIt = userClickedGotIt;
  $.post("/bluedot", {
    action: cat, _csrf: $('meta[name="csrf-token"]').attr('content')
  });
};

// Rather than clicking "got it", the user hid the text by clicking elsewhere.
// This event still needs to be recorded as a blue dot action in the db.
function detectImproperlyClosedHint(event, enableDataCollection){
  var target = $(event.target);
  // Check if the click was outside of the tooltip and that a tooltip was open
  if (!target.closest('.introjs-tooltip').length && $('.introjs-tooltip').is(':visible')){
    // check if this tooltip belonged to a blue dot (as opposed to a tutorial step)
    if($('.introjs-hintReference').length){
      // record this hint action with parameter as false since the user did not click 'got it'
      Voiceovers.pauseVoiceover();
      if(enableDataCollection){
        recordHintAction(false);
      }
    }
  }
};

// showing the "Need some help? Make sure you are clicking 'got it!'"
// guidance message
function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(closedHints != numberOfHints){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#cyberTransButton').css('margin-bottom', '10em');
    }
  }
};

// show "There are still more dots to find" message if the user clicks "let's
// continue" without closing all of the dots first
function errorCheck(){
  if(closedHints != numberOfHints){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
};

// initialize the blue dots (aka 'hints')
function startHints(enableDataCollection){
  // use the customErrorCheck function if one is provided
  if(typeof customErrorCheck !== 'undefined'){
    $('#cyberTransButton').on('click', customErrorCheck);
  } else {
    $('#cyberTransButton').on('click', errorCheck);
  }

  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: hintsList
  });

  hints.addHints();

  // for providing guidance message on clicking "got it!"
  // Called when user clicks on one of the hints
  hints.onhintclick(function(e) {
    const oldhintNumber = hintNumber;
    hintNumber = $(e).attr('data-step'); // update the current hint number
    hintOpenTimestamp = Date.now(); // update the timestamp for opening a hint
    clickedHints++;
    if (!$('.introjs-tooltip').is(':visible')) { //prior to clicking on the hint, no other hint is open
      Voiceovers.playVoiceover(hintsList[hintNumber].audioFile);
    } else { //prior to clicking on the hint, another hint is open
      Voiceovers.pauseVoiceover();
        if (hintNumber !== oldhintNumber){
          Voiceovers.playVoiceover(hintsList[hintNumber].audioFile);
        }
    }
    if(clickedHints >= numberOfHints){
      if(clickedHints !== 1){
        //show the guidance message, user probably doesn't know to click "got it"
        if($('#removeHidden').is(":hidden")){
          $('#removeHidden').transition('fade');
          $('#cyberTransButton').css('margin-bottom', '10em');
        } else {
          $('#removeHidden').transition('bounce');
        }
      }
    }
  });
  // Called when a single hint is removed from page (e.g. when user clicks on “Got it” button)
  hints.onhintclose(function(stepID){
    // record this hint action with parameter as true since the user clicked 'got it'
    Voiceovers.pauseVoiceover();
    if(enableDataCollection){
      recordHintAction(true);
    }

    // if a customOnHintCloseFunction is provided, use it
    if(typeof customOnHintCloseFunction !== 'undefined'){
      customOnHintCloseFunction(stepID);
    } else {
      closedHints++;
      clickedHints = 0; // reset this because it's used to remind users to actually close hints
      if($('#removeHidden').is(":visible")){
        $('#removeHidden').transition('fade');
        if($('#clickAllDotsWarning').is(":hidden")){
          $('#cyberTransButton').css("margin-bottom", "4em");
        }
      }
      if(closedHints == numberOfHints) {
        if($('#clickAllDotsWarning').is(':visible')){
          $('#clickAllDotsWarning').transition('fade');
          $('#cyberTransButton').css("margin-bottom", "4em");
        }
        $( "#cyberTransButton" ).addClass("green");
      }
    }
  });

  document.body.hints = hints;
  // if a user is on the page for some time, they may not be clicking "got it"
  // on the dots. Show the help message suggesting that action.
  setInterval(showHelp, 120000);
};

// initialize the tutorial sequence, if there is one. The blue dots get initialized
// in this function after the tutorial exits.

function startIntro(enableDataCollection){

  var intro = introJs().setOptions({
    steps: stepsList,
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  // *************** code copied over from base_introStep.js *******************
  intro.onbeforechange (function() {
    try {
      additionalOnBeforeChange($(this));
    } catch (error) {
      if ( !(error instanceof ReferenceError) ) {
        console.log("There has been an unexpected error:");
        console.log(error);
      }
    }
    if(!enableDataCollection){
      // if data collection is disabled, skip the rest of the code in this function
      return;
    }
    let leavingStep = 0;
    if($(this)[0]._direction === "forward") {
      leavingStep = ($(this)[0]._currentStep - 1);
    } else if ($(this)[0]._direction === "backward"){
      leavingStep = ($(this)[0]._currentStep + 1);
    } else {
      console.log(`There was an error in calculating the step number.`);
    }
    let totalTimeOpen = Date.now() - startTimestamp;
    let cat = new Object();
    cat.subdirectory1 = subdirectory1;
    cat.subdirectory2 = subdirectory2;
    cat.stepNumber = leavingStep;
    cat.viewDuration = totalTimeOpen;
    cat.absoluteStartTime = startTimestamp;
    if(leavingStep !== -1){
      const jqxhr = $.post("/introjsStep", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
      jqhxrArray.push(jqxhr);
    }
  });

  intro.onafterchange(function(){
    Voiceovers.playVoiceover(stepsList[$(this)[0]._currentStep].audioFile);
    startTimestamp = Date.now();
    hideHelpMessage();
  });

  intro.onbeforeexit(function(){
    hideHelpMessage();
    Voiceovers.pauseVoiceover();
    try {
      additionalOnBeforeExit();
    } catch (error) {
      if ( !(error instanceof ReferenceError) ) {
        console.log("There has been an unexpected error:");
        console.log(error);
      }
    }
    if (enableDataCollection) {
      let leavingStep = $(this)[0]._currentStep;
      let totalTimeOpen = Date.now() - startTimestamp;
      let cat = new Object();
      cat.subdirectory1 = subdirectory1;
      cat.subdirectory2 = subdirectory2;
      cat.stepNumber = leavingStep;
      cat.viewDuration = totalTimeOpen;
      cat.absoluteStartTime = startTimestamp;
      const jqxhr = $.post("/introjsStep", {
        action: cat,
        _csrf: $('meta[name="csrf-token"]').attr('content')
      });
      jqhxrArray.push(jqxhr);
    }
    Promise.all(jqhxrArray).then(function() {
      // changed from base_introStep.js
      startHints(enableDataCollection);
      try{
        eventsAfterHints();
      } catch(error) {
        if ( !(error instanceof ReferenceError) ) {
          console.log("There has been an unexpected error:");
          console.log(error);
        }
      }
    });
  })
  // **************************************************************************

  intro.start();

  return intro;
};

function isTutorialBoxOffScreen(bottomOffset){
  if (window.scrollY > bottomOffset) {
    return true;
  } else {
    return false;
  }
}

function hideHelpMessage(){
  if($('#clickNextHelpMessage').is(':visible')){
    $('#clickNextHelpMessage').transition('fade');
  }
}

function showHelpMessage(){
  if($('#clickNextHelpMessage').is(':hidden')){
    $('#clickNextHelpMessage').transition('fade down');
  }
}

$(window).on("load", function(){
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
  addCardIds(); // required for data to record properly
  // reference: https://stackoverflow.com/a/3028037
  $(document).click(function(event) {
    detectImproperlyClosedHint(event, enableDataCollection)
  });
  try {
    // a tutorial sequence isn't always present. If it isn't, startHints() needs
    // to be called manually.
    const intro = startIntro(enableDataCollection);
    const tooltipTopOffset = $('.introjs-tooltip').offset().top;
    const tooltipBottomOffset = tooltipTopOffset + $('.introjs-tooltip').outerHeight();
    let scrolledAway = false;
    // When the user scrolls, check that they haven't missed the first tooltip.
    // If the tooltip is scrolled out of the viewport and the user is still on
    // the first tooltip step after 4 seconds, show a help message.
    $(window).scroll(function(){
      // only want to do this once, so check that scrolledAway is false
      if (isTutorialBoxOffScreen(tooltipBottomOffset) && (!scrolledAway)) {
        scrolledAway = true;
        setTimeout(function(){
          if(intro._currentStep === 0){
            showHelpMessage();
          }
        }, 4000);
      }
    });
  } catch (error) {
    if ( !(error instanceof ReferenceError) ) {
      console.log("There has been an unexpected error:");
      console.log(error);
    }
    try {
      startHints(enableDataCollection);
      try{
        // an eventsAfterHints function isn't always defined, so call it if it
        // exists
        eventsAfterHints();
      } catch(error) {
        if ( !(error instanceof ReferenceError) ) {
          console.log("There has been an unexpected error:");
          console.log(error);
        }
      }
    } catch (error) {
      if ( !(error instanceof ReferenceError) ) {
        console.log("There has been an unexpected error:");
        console.log(error);
      }
    }
  }
});
