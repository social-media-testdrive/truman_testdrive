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
  clickCount = 0;
  counter=0;
  //for providing guidance message
  hints.onhintclick(function() {
      clickCount++;
      if(clickCount >= 2){
        //show the guidance message, user probably doesn't know to click "got it"
        if($('#removeHidden').is(":hidden")){
          $('#removeHidden').transition('fade');
          $('#finishSim').css("margin-bottom", "10em");
        } else {
          $('#removeHidden').transition('bounce');
        }
      }
  });

  hints.onhintclose(function() {
     counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
       $('#finishSim').css("margin-bottom", "4em");
     }
     if(counter == 2) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
           $('#finishSim').css("margin-bottom", "4em");
       }
       $("#finishSim").addClass("green");
     }
  });
};

function errorCheck(){
  if(counter != 2){
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

$(window).on("load", function() {startHints();});
$('#finishSim').on('click', function() {errorCheck()});
