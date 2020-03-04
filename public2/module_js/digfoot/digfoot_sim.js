function openPostDigfootSim(){
  $('input[type=checkbox]').prop('checked',false);
  $('#digfoot_sim_modal').modal('show');
}

function startIntro(){

    var hints;
    clickCount = 0;
    counter = 0;
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
    intro.setOptions({
      steps: [
        {
          element: document.querySelectorAll('#step1')[0],
          intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
          position: "left",
          scrollTo: 'tooltip'
        }

      ]
    });

    intro.start().onexit(function() {
      hints = introJs().addHints();

      hints.onhintclick(function() {
          clickCount++;
          if(clickCount > 5){
            //show the guidance message, user probably doesn't know to click "got it"
            if($('#removeHidden').is(":hidden")){
              $('#removeHidden').transition('fade');
              $('#cyberTransButton').css('margin-bottom','10em');
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
         if($('#clickAllDotsWarning').is(":hidden")){
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
       }
       if(counter == 5) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
         $( ".cybertrans" ).addClass("green");
       }
      });



      //error messaging
      $('#cyberTransButton').on('click', function() {
        if(counter != 5){
          //show the message normally the first time
          if($('#clickAllDotsWarning').is(":hidden")){
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "10em");
          }else{
            //otherwise, bounce the message to draw attention to it
            $('#clickAllDotsWarning').transition('bounce');
          }
        }
      });

      //showing the "Need some help?" guidance message after a total of 2 minutes
      setInterval(function(){
        if($('#removeHidden').is(":hidden")){
          if(counter != 5){
            //user does not know to click blue dots
            $('#removeHidden').transition('fade');
            $('#cyberTransButton').css('margin-bottom', '10em');
          }
        }
      },120000);

    });

    $('#cyberTransButton').on('click', function(){
      if($('#removeHidden').is(":visible") || $('#clickAllDotsWarning').is(":visible")){
        $('#cyberTransButton').css('margin-bottom', '10em');
      }else{
        $('#cyberTransButton').css('margin-bottom', '4em');
      }
    });
  };

  $(window).on("load", function() {startIntro();});
