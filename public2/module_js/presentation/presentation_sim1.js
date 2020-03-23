function startIntro(){
    var hints;
    var literacy_counter = 0;
    clickCount=0;

    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#hint2')[0],
            intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
            position:'right',
            scrollTo:'tooltip'
          }

        ]
      });

    intro.start().onexit(function() {

      var hints = introJs().setOptions({
        hints: [
          {
            hint: `Here’s Jake’s finsta, jakethesnake. Only 16 of his closest
            friends from school follow this account.`,
            element: '#hint2',
            hintPosition: 'top-left'
          },
          {
            hint: `Here, he posts funny pictures and casual things that he would
            not post on his main account because he only wants his best friends
            to see it.`,
            element: '#hint2',
            hintPosition: 'top-middle'
          },
          {
            hint: `Even though Jake doesn’t name the person, the post is unkind
            and stirs up drama. Would Jake post the same thing on his public
            account? Remember to be kind and respectful online!`,
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
              $('#cyberSim2Button').css("margin-bottom", "10em");
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
           $('#cyberSim2Button').css("margin-bottom", "4em");
         }
       }
       if(literacy_counter == 3) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
           $('#cyberSim2Button').css("margin-bottom", "4em");
         }
         $( ".cybersim2" ).addClass("green");
       }
      });

      //error messaging
      $('#cyberSim2Button').on('click', function() {
        if(literacy_counter != 3){
          //show the message normally the first time
          if($('#clickAllDotsWarning').is(":hidden")){
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberSim2Button').css("margin-bottom", "10em");
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
            $('#cyberSim2Button').css('margin-bottom', '10em');
          }
        }
      },120000);

    });


  };

$(window).on("load", function() {startIntro();});
