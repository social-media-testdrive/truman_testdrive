let clickedHints = 0;
let closedHints = 0;
const numberOfHints = hintsList.length;

let pathArray = window.location.pathname.split('/');
const subdirectory1 = pathArray[1];
const subdirectory2 = pathArray[2];
let hintNumber = 0;
let hintOpenTimestamp = Date.now();
let closedHint = false;

function addCardIds(){
  let id = 1;
  let idString = "";
  $('.ui.card').each(function(){
     idString = `${subdirectory2}SimPost${id}`;
    $(this).attr('simPostNumber', idString);
    id++;
  });
}


//showing the "Need some help?" guidance message
function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(closedHints != numberOfHints){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#cyberTransButton').css('margin-bottom', '10em');
    }
  }
};

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

function startHints(){
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

  //for providing guidance message
  hints.onhintclick(function(e) {
    hintNumber = $(e).attr('data-step');
    hintOpenTimestamp = Date.now();
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
    let cat = new Object();
    cat.subdirectory1 = subdirectory1;
    cat.subdirectory2 = subdirectory2;
    cat.dotNumber = hintNumber;
    cat.viewDuration = Date.now() - hintOpenTimestamp;
    cat.clickedClose = true;

    $.post("/bluedot", {
      action: cat, _csrf: $('meta[name="csrf-token"]').attr('content') });
    if(typeof customOnHintCloseFunction !== 'undefined'){
      customOnHintCloseFunction(stepID);
    } else {
      closedHints++;
      clickedHints = 0;
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

  setInterval(showHelp, 120000);
};


function startIntro(){

  var intro = introJs().setOptions({
    'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false,
    'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });
    intro.setOptions({
      steps: stepsList
    });
    intro.start().onexit(function(){
      startHints();
      // an eventsAfterHints function isn't always defined
      try{
        eventsAfterHints();
      }catch(error){
        console.log("No defined events after hints.");
        console.error(error);
      }

    });
};

$(window).on("load", function(){
  addCardIds();
  try {
    startIntro();
  } catch (error) {
    console.log("No intro. Try starting hints.");
    console.error(error);
    try {
      startHints();
      try{
        eventsAfterHints();
      }catch(error){
        console.log("No defined events after hints.");
        console.error(error);
      }
    } catch (error) {
      console.log("No hints.");
      console.error(error);
    }
  }
});
