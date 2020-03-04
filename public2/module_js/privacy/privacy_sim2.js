var privacy_sim2_counter = 0;
function startIntro(){
  var hints;
  clickCount = 0;
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003', 'tooltipClass':'blueTooltip' });
    intro.setOptions({
      steps: [
        {
          intro: "Now that we have learned about the <b>ASK method</b>, let’s try analyzing a Privacy Policy!"
        },
        {
          intro: "This is TestDrive’s Privacy Policy. See if you can find out what information TestDrive collects about you when you use it."
        },
        {
          intro: "Click on the blue dots &nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; to learn more..."
        }
      ]
    });
  intro.start().onexit(function() {

    hints = introJs().addHints();

    hints.onhintclick(function() {
        clickCount++;
        if(clickCount >= 4){
          //show the guidance message, user probably doesn't know to click "got it"
          if($('#removeHidden').is(":hidden")){
            $('#removeHidden').transition('fade');
            $('#privacytutorial').css("margin-bottom", "10em");
          } else {
            $('#removeHidden').transition('bounce');
          }
        }
    });

    hints.onhintclose(function(e) {
     privacy_sim2_counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
       if($('#clickAllDotsWarning').is(":hidden")){
         $('#privacytutorial').css("margin-bottom", "4em");
       }
     }
     if(privacy_sim2_counter == 4) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#privacytutorial').css("margin-bottom", "4em");
       }
       $( ".privacytutorial" ).addClass("green");
     }
    });

    //error messaging
    $('#privacytutorial').on('click', function() {
      if(privacy_sim2_counter != 4){
        //show the message normally the first time
        if($('#clickAllDotsWarning').is(":hidden")){
          $('#clickAllDotsWarning').transition('fade');
          $('#privacytutorial').css("margin-bottom", "10em");
        }else{
          //otherwise, bounce the message to draw attention to it
          $('#clickAllDotsWarning').transition('bounce');
        }
      }
    });

    //showing the "Need some help?" guidance message after a total of 2 minutes
    setInterval(function(){
      if($('#removeHidden').is(":hidden")){
        if(privacy_sim2_counter != 4){
          //user does not know to click blue dots
          $('#removeHidden').transition('fade');
          $('#privacytutorial').css('margin-bottom', '10em');
        }
      }
    },120000);


  });
};


$(window).on("load", function() {startIntro();});
