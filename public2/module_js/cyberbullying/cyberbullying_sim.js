let clickCount = 0;
let counter = 0;
const numberOfHints = 4;

function errorCheck(){
  if(counter != numberOfHints){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
};

function startIntro(){

  var hints;

  var intro = introJs().setOptions({
    'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false,
    'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });
    intro.setOptions({
      steps: [
        {
          element: document.querySelectorAll('#step1')[0],
          intro: "<div> <img class='ui avatar image' src='https://dhpd030vnpk29.cloudfront.net/profile_pictures/user55.jpg'/><b>Lana</b>  &  <img class='ui avatar image' src='https://dhpd030vnpk29.cloudfront.net/profile_pictures/user66.jpg'/><b>Emma</b> </div> <div>are in the same class at school. Recently, Emma has been saying a lot of mean things to Lana.</div>",
          position:'right',
          scrollTo: 'tooltip'
        },
        {
          element: document.querySelectorAll('#step1')[0],
          intro: "Here you will see an example of what's been going on. Click on the blue dots &nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; to learn more about cyberbullying and what you can do about it.",
          position:'right',
          scrollTo:'tooltip'
        }

      ]
    });
    intro.start().onexit(function() {
      hints = introJs().addHints();

      hints.onhintclick(function() {
          clickCount++;
          if(clickCount > numberOfHints){
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
       counter++;
       clickCount = 0;
       if($('#removeHidden').is(":visible")){
         $('#removeHidden').transition('fade');
         if($('#clickAllDotsWarning').is(":hidden")){
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
       }
       if(counter == numberOfHints) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
           $('#cyberTransButton').css("margin-bottom", "4em");
         }
         $( ".cybertrans" ).addClass("green");
       }
      });

      //error messaging
      $('#cyberTransButton').on('click', errorCheck);

      //showing the "Need some help?" guidance message after a total of 2 minutes
      setInterval(function(){
        if($('#removeHidden').is(":hidden")){
          if(counter != numberOfHints){
            //user does not know to click blue dots
            $('#removeHidden').transition('fade');
            $('#cyberTransButton').css('margin-bottom', '10em');
          }
        }
      },120000);
    });
};

$(window).on("load", startIntro);
