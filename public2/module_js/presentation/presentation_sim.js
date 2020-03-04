function startIntro(){
    var hints;
    var literacy_counter = 0;
    clickCount=0;
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "These are posts from the social media accounts of Jake, a 13 year old. He has 3 different accounts. His main one (Jake Matthews), as well as two other accounts (jakethesnake and minecraftboi23).",
            position:'right',
            scrollTo:'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "In this activity, we will look at Jake's different accounts.",
            position:'right',
            scrollTo:'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
            position:'right',
            scrollTo:'tooltip'
          }

        ]
      });
      intro.start().onexit(function() {

        hints = introJs().addHints();

        hints.onhintclick(function() {
            clickCount++;
            if(clickCount >=2 ){
              //show the guidance message, user probably doesn't know to click "got it"
              if($('#removeHidden').is(":hidden")){
                $('#removeHidden').transition('fade');
                $('#cyberSim1Button').css("margin-bottom", "10em");
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
             $('#cyberSim1Button').css("margin-bottom", "4em");
           }
         }
         if(literacy_counter == 1) {
           if($('#clickAllDotsWarning').is(':visible')){
             $('#clickAllDotsWarning').transition('fade');
             $('#cyberSim1Button').css("margin-bottom", "4em");
           }
           $( ".cybersim1" ).addClass("green");
         }
        });

        //error messaging
        $('#cyberSim1Button').on('click', function() {
          if(literacy_counter != 1){
            //show the message normally the first time
            if($('#clickAllDotsWarning').is(":hidden")){
              $('#clickAllDotsWarning').transition('fade');
              $('#cyberSim1Button').css("margin-bottom", "10em");
            }else{
              //otherwise, bounce the message to draw attention to it
              $('#clickAllDotsWarning').transition('bounce');
            }
          }
        });

        //showing the "Need some help?" guidance message after a total of 40 seconds
        setInterval(function(){
          if($('#removeHidden').is(":hidden")){
            if(literacy_counter != 1){
              //user does not know to click blue dots
              $('#removeHidden').transition('fade');
              $('#cyberSim1Button').css('margin-bottom', '10em');
            }
          }
        },40000);

      });



  };

$(window).on("load", function() {startIntro();});
