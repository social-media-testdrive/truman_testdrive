function startIntro(){
    var literacy_counter = 0;
    clickCount = 0;

    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#hint2')[0],
            intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
            scrollTo: 'tooltip',
            position: 'right'
          }

        ]
      });

    intro.start().onexit(function() {
      var hints = introJs().setOptions({
        hints: [
          {
            hint: `Here is another one of Jake’s accounts, minecraftboi23.`,
            element: '#hint2',
            hintPosition: 'top-left'
          },
          {
            hint: `On this account, he only posts about Minecraft, which is one
            of his favorite games. He talks to other Minecraft fans through this
            account.`,
            element: '#hint2',
            hintPosition: 'top-middle'
          },
          {
            hint: `Would you say the same things in person? If you wouldn’t say
            that in front of your teacher, your mom, or your grandma, don’t post
            it!`,
            element: '#hint3',
            hintPosition: 'top-middle'
          }
        ]
      });

      hints.addHints();

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
