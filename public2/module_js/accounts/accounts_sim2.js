let numberOfDots = 0;
let closeCount = 0;
let clickCount = 0;

function clickHint(){
  clickCount++;
  if(clickCount >= numberOfDots){
    //show the guidance message, user probably doesn't know to click "got it"
    if($('#removeHidden').is(":hidden")){
      $('#removeHidden').transition('fade');
      $('#finishSim').css("margin-bottom", "10em");
    } else {
      $('#removeHidden').transition('bounce');
    }
  }
};

function closeHint(){
  closeCount++;
  clickCount = 0;
  if($('#removeHidden').is(":visible")){
    $('#removeHidden').transition('fade');
    $('#finishSim').css("margin-bottom", "4em");
  }
  if(closeCount == numberOfDots) {
    if($('#clickAllDotsWarning').is(':visible')){
      $('#clickAllDotsWarning').transition('fade');
      $('#finishSim').css("margin-bottom", "4em");
    }
    $("#finishSim").addClass("green");
  }
};

//showing the "Need some help?" guidance message after 2 minutes
function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(closeCount != numberOfDots){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#continueSim').css('margin-bottom', '10em');
    }
  }
};

function startHints(){
  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: [
      {
        hint: `Fill out the profile information. Remember to not share too many
          details about who you are.`,
        element: '#generalStep',
        hintPosition: 'top-middle'
      },
      {
        hint: `Start off by sharing only a little bit of information about
          yourself. You can always add more information later but it is
          difficult to remove information.`,
        element: '#generalStep',
        hintPosition: 'top-right'
      }
    ]
  });
  hints.addHints();
  numberOfDots = hints._introItems.length;
  hints.onhintclick(clickHint);
  hints.onhintclose(closeHint);
  setInterval(showHelp, 60000);

};

function errorCheck(){
  if(closeCount != numberOfDots){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#finishSim').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
  if ($("#finishSim").hasClass("green")) {
    window.location.href = "/trans/accounts"
  }
};

$(window).on("load", startHints);
$('#finishSim').on('click', errorCheck);
