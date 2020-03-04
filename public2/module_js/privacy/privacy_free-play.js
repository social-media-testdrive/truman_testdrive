var literacy_counter = 0;
clickCount = 0;

function startIntro(){
    var hints;

    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "This is the social media profile page of Lily Hui, a middle school student.",
            position:'right',
            scrollTo:'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "This is how Lily’s profile will look to anyone on the Internet.",
            position:'right',
            scrollTo:'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "Take some time to look through it and see what kinds of posts she has on her profile!",
            position:'right',
            scrollTo:'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; to learn more...",
            position:'right',
            scrollTo:'tooltip'
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
              $('#free1Button').css("margin-bottom", "10em");
            } else {
              $('#removeHidden').transition('bounce');
            }
          }
      });

      hints.onhintclose(function(e) {
       literacy_counter++;
       clickCount = 0;
       if($('#removeHidden').is(":visible")){
         $('#removeHidden').transition('fade');
         if($('#clickAllDotsWarning').is(":hidden")){
           $('#free1Button').css("margin-bottom", "4em");
         }
       }
       if(literacy_counter == 3) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
         $( ".free1" ).addClass("green");
       }
      });

      //error messaging
      $('#free1Button').on('click', function() {
        if(literacy_counter != 3){
          //show the message normally the first time
          if($('#clickAllDotsWarning').is(":hidden")){
            $('#clickAllDotsWarning').transition('fade');
            $('#free1Button').css("margin-bottom", "10em");
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
            $('#free1Button').css('margin-bottom', '10em');
          }
        }
      },120000);

    });
  };
  
  $(window).on("load", function() {startIntro();});
