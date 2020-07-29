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

// Automatically add unique card IDs to guided activity posts
// Each post must have an ID to have any actions on it written to the DB
function addCardIds(){
  let id = 1;
  let idString = "";
  $('.ui.card').each(function(){
     idString = `${subdirectory2}_${subdirectory1}_post${id}`;
    $(this).attr('postID', idString);
    // give comments IDs as well
    let commentID = 1;
    let commentIdString = "";
    $(this).find('.comment').not('.like').not('.flag').each(function(){
      console.log(`Comment ${commentID} of post ${id}`);
      commentIdString = `${subdirectory2}_${subdirectory1}_post${id}_comment${commentID}`;
      $(this).attr('commentID', commentIdString);
      commentID++;
    })
    id++;
  });
}

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
function startHints(){
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
  //
  hints.onhintclick(function(e) {
    hintNumber = $(e).attr('data-step'); // update the current hint number
    hintOpenTimestamp = Date.now(); // update the timestamp for opening a hint
    clickedHints++;
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
  hints.onhintclose(function(stepID){
    // *********************** record the hint data ****************************
    let cat = new Object();
    cat.subdirectory1 = subdirectory1;
    cat.subdirectory2 = subdirectory2;
    cat.dotNumber = hintNumber; // which hint was most recently interacted with
    cat.absoluteTimeOpened = hintOpenTimestamp; // timestamp of hint being opened
    cat.viewDuration = Date.now() - hintOpenTimestamp; // how long the hint was open for
    cat.clickedClose = true; // this is always going to be true on posting for now

    $.post("/bluedot", {
      action: cat, _csrf: $('meta[name="csrf-token"]').attr('content')
    });
    // ************************************************************************

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

function startIntro(){

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
    startTimestamp = Date.now();
  });

  intro.onbeforeexit(function(){
    try {
      additionalOnBeforeExit();
    } catch (error) {
      if ( !(error instanceof ReferenceError) ) {
        console.log("There has been an unexpected error:");
        console.log(error);
      }
    }
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
    Promise.all(jqhxrArray).then(function() {
      // changed from base_introStep.js
      startHints();
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
};

$(window).on("load", function(){
  addCardIds(); // required for data to record properly
  try {
    // a tutorial sequence isn't always present. If it isn't, startHints() needs
    // to be called manually.
    startIntro();
  } catch (error) {
    if ( !(error instanceof ReferenceError) ) {
      console.log("There has been an unexpected error:");
      console.log(error);
    }
    try {
      startHints();
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
