let clickedHints = 0;
let closedHints = 0;
const numberOfHints = hintsList.length;

//showing the "Need some help?" guidance message
function showHelp() {
  if ($('#removeHidden').is(":hidden")) {
    if (closedHints != numberOfHints) {
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#cyberTransButton').css('margin-bottom', '10em');
    }
  }
};

function errorCheck() {
  if (closedHints != numberOfHints) {
    //show the message normally the first time
    if ($('#clickAllDotsWarning').is(":hidden")) {
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "10em");
    } else {
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
};

function startHints() {
  if (typeof customErrorCheck !== 'undefined') {
    $('#cyberTransButton').on('click', customErrorCheck);
  } else {
    $('#cyberTransButton').on('click', errorCheck);
  }

  window.scrollTo(0, 0);

  var hints = introJs().setOptions({
    hints: hintsList
  });

  hints.addHints();

  //for providing guidance message
  hints.onhintclick(function () {
    clickedHints++;
    if (clickedHints >= numberOfHints) {
      if (clickedHints !== 1) {
        //show the guidance message, user probably doesn't know to click "got it"
        if ($('#removeHidden').is(":hidden")) {
          $('#removeHidden').transition('fade');
          $('#cyberTransButton').css('margin-bottom', '10em');
        } else {
          $('#removeHidden').transition('bounce');
        }
      }
    }
  });
  hints.onhintclose(function (stepID) {
    if (typeof customOnHintCloseFunction !== 'undefined') {
      customOnHintCloseFunction(stepID);
    } else {
      closedHints++;
      clickedHints = 0;
      if ($('#removeHidden').is(":visible")) {
        $('#removeHidden').transition('fade');
        if ($('#clickAllDotsWarning').is(":hidden")) {
          $('#cyberTransButton').css("margin-bottom", "4em");
        }
      }
      if (closedHints == numberOfHints) {
        if ($('#clickAllDotsWarning').is(':visible')) {
          $('#clickAllDotsWarning').transition('fade');
          $('#cyberTransButton').css("margin-bottom", "4em");
        }
        $("#cyberTransButton").addClass("green");
      }
    }
  });

  document.body.hints = hints;

  setInterval(showHelp, 120000);
};


function startIntro() {

  var intro = introJs().setOptions({
    'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false,
    'showStepNumbers': false, 'showBullets': false, 'scrollToElement': true,
    'doneLabel': 'Done &#10003'
  });
  intro.setOptions({
    steps: stepsList
  });

  intro.onafterchange(function(){
    hideHelpMessage();
  })

  intro.start().onexit(function () {
    hideHelpMessage();
    startHints();
    // an eventsAfterHints function isn't always defined
    try {
      eventsAfterHints();
    } catch (error) {
      console.log("No defined events after hints.");
      console.error(error);
    }
  });

  document.body.intro = intro;
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

$(window).on("load", function () {
  try {
    startIntro();
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
          if(document.body.intro._currentStep === 0){
            showHelpMessage();
          }
        }, 4000);
      }
    });
  } catch (error) {
    console.log("No intro. Try starting hints.");
    console.error(error);
    try {
      startHints();
      try {
        eventsAfterHints();
      } catch (error) {
        console.log("No defined events after hints.");
        console.error(error);
      }
    } catch (error) {
      console.log("No hints.");
      console.error(error);
    }
  }
});
