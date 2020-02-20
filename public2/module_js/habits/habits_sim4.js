//activating a normal dropdown (the one used in the habits module activity page)
$('.ui.selection.dropdown').dropdown();

var literacy_counter = 0;

function startIntro(){
  var hints = introJs().addHints();
  var clickCount = 0;

  //for providing guidance message
  hints.onhintclick(function(hintElement, item, stepId) {
      //console.log('hint clicked', hintElement, item, stepId);
      clickCount++;
      if(clickCount > 5){
        //show the guidance message, user probably doesn't know to click "got it"
        if($('#removeHidden').is(":hidden")){
          $('#removeHidden').transition('fade');
        } else {
          $('#removeHidden').transition('bounce');
        }
      }
  });

  $('button.ui.big.labeled.icon.button.cybertrans').on('click', function(){
    if(literacy_counter != 4){
      //show the message normall the first time
      if($('#notificationWarning').is(":hidden")){
        $('#notificationWarning').transition('fade');
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#notificationWarning').transition('bounce');
      }
    }
  });

  hints.onhintclose(function(e) {
    clickCount = 0; //The user knows to click "got it"
    if($('#removeHidden').is(":visible")){
      $("#removeHidden").transition('fade');
    }
    literacy_counter++;
    if(literacy_counter == 4) {
     $('button.ui.big.labeled.icon.button.cybertrans').addClass('green');
     if($('#notificationWarning').is(":visible")){
       $("#notificationWarning").transition('fade');
     }
    }
  });

  //showing the "Need some help?" guidance message after 40 seconds per blue dot (assuming the user doesn't know to click "Got it")
  setTimeout(function(){
    if($('#removeHidden').is(":hidden")){
      if(literacy_counter != 4){
        //user does not know to click blue dots
        $('#removeHidden').transition('fade');
      }
    }
  },120000);
};


$(window).on("load", function() {
  startIntro();
});
