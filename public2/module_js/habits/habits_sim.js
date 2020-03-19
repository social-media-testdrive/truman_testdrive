
var literacy_counter = 0;

function startIntro(){

    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step0')[0],
            intro: "Thinking about your media choices and the habits you form while using them is important. Good habits help us build healthy and happy lives. Bad habits can make our lives more difficult.",
            position: "right",
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step0')[0],
            intro: "While apps use certain features to grab your attention and keep you using them for as long as possible, it's important to think about how you can form good habits and be in control of your media use!",
            position: "right",
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step0')[0],
            intro: "Let's learn some strategies to build healthy social media habits. Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; to learn more...",
            position: "right",
            scrollTo: 'tooltip'
          }
        ]
      });

      intro.start().onexit(function() {
        var hints = introJs().addHints()
        var clickCount = 0;

        //for providing guidance message
        hints.onhintclick(function(hintElement, item, stepId) {
            //console.log('hint clicked', hintElement, item, stepId);
            clickCount++;
            if(clickCount >= 4){
              //show the guidance message, user probably doesn't know to click "got it"
              if($('#removeHidden').is(":hidden")){
                $('#removeHidden').transition('fade');
                $("#addBottomMargin").css('margin-bottom', '10em');
              } else {
                $('#removeHidden').transition('bounce');
              }
            }
        });

        $('a.item[data-value="notifications"]').on('click', function(){
          if(literacy_counter != 2){
            //show the message normally the first time
            if($('#notificationWarning').is(":hidden")){
              $('#notificationWarning').transition('fade');
              $('#addBottomMargin').css('margin-bottom', '10em');
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
          if(literacy_counter == 2) {

            //hide the warning message if it's visible
            if($('#notificationWarning').is(":visible")){
              $('#notificationWarning').transition('fade');
            }
            //show the instructional message
            if($('#nextPageInstruction').is(":hidden")){
              $('#nextPageInstruction').transition('fade');
              //add margin to the bottom of the page
              $('#addBottomMargin').css('margin-bottom', '10em');
            }

           //enable the notifications button
           $('a.item[data-value="notifications"]').on('click', function(){
             window.location.href='/sim2/habits';
           });

           function glowNotifications(){
             $('a.item[data-value="notifications"]').transition('glow');
           }
           glowNotifications();
           setInterval(glowNotifications, 2000);

          }
        });

        //showing the "Need some help?" guidance message after a total of 40 seconds per blue dot (80s)
        setInterval(function(){
          if($('#removeHidden').is(":hidden")){
            console.log("counter: "+literacy_counter);
            if(literacy_counter != 2){
              $('#removeHidden').transition('fade');
              $('#addBottomMargin').css('margin-bottom', '10em');
            }
          }
        },80000);
      });

  };

  $(window).on("load", function() {
    startIntro();
  });
