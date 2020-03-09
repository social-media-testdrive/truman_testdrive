let clickCount = 0;
let counter = 0;
const numberOfHints = 4;

//showing the "Need some help?" guidance message
function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(counter != numberOfHints){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#cyberTransButton').css('margin-bottom', '10em');
    }
  }
};

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

function startHints(){
  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: [
      {
        hint: `Let’s send a supportive message to the target. Copy and paste the
        following comment: <i>“Lana, a lot of people think math is hard! Don’t
        worry about it”</i>.`,
        element: '#hint1'
      },
      {
        hint: `Press the <b>“flag”</b> button to report this post to the
        website.`,
        element: '#hint2'
      },
      {
        hint: `Press the <b>“flag”</b> button to report this comment to the
        website.`,
        element: '#hint3'
      },
      {
        hint: `Let’s tell the bully that this behavior is not okay. Copy and
        paste the following comment: <i>“Guys, Sarah will be very upset if she
        sees this post. You should delete it."</i>`,
        element: '#hint4'
      }
    ]
  });

  hints.addHints();

  //for providing guidance message
  hints.onhintclick(function() {
      clickCount++;
      if(clickCount >= numberOfHints){
        //show the guidance message, user probably doesn't know to click "got it"
        if($('#removeHidden').is(":hidden")){
          $('#removeHidden').transition('fade');
          $('#cyberTransButton').css('margin-bottom', '10em');
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
     if(counter == numberOfHints) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#cyberTransButton').css("margin-bottom", "4em");
       }
       $( ".cybertrans" ).addClass("green");
     }
  });

  setInterval(showHelp, 120000);
};


function startIntro(){

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
    intro.start().onexit(startHints);
    $('#cyberTransButton').on('click', errorCheck);

};

$(window).on("load", startIntro);
