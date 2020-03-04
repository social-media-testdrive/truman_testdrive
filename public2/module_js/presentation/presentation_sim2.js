function startIntro(){
    var hints;
    var literacy_counter = 0;
    clickCount = 0;

    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#blueDotStep')[0],
            intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
            scrollTo: 'tooltip',
            position: 'right'
          }

        ]
      });

    intro.start().onexit(function() {

      hints = introJs().addHints();

      hints.onhintclick(function() {
          clickCount++;
          if(clickCount >= 3){
            //show the guidance message, user probably doesn't know to click "got it"
            if($('#removeHidden').is(":hidden")){
              $('#removeHidden').transition('fade');
              $('#cyberTransButton').css("margin-bottom", "10em");
            } else {
              $('#removeHidden').transition('bounce');
            }
          }
      });

      hints.onhintclose(function(e) {
       literacy_counter++;
       clickCount=0;
       if($('#removeHidden').is(":visible")){
         $('#removeHidden').transition('fade');
         if($('#clickAllDotsWarning').is(":hidden")){
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
       }
       if(literacy_counter == 3) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
         $( ".cybertrans" ).addClass("green");
       }
      });

      //error messaging
      $('#cyberTransButton').on('click', function() {
        if(literacy_counter != 3){
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
          if(literacy_counter != 3){
            //user does not know to click blue dots
            $('#removeHidden').transition('fade');
            $('#cyberTransButton').css('margin-bottom', '10em');
          }
        }
      },120000);

    });
  };

$(window).on("load", function() {startIntro();});
