function continueTutorial(){
  if($("#continueTutorial").hasClass("green")){
      window.location.href='/tutorial2/accounts';
  }
}

function startIntro(){

  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });

  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#usernameStep')[0],
        intro: `Choose your username carefully! This is the name other people on
        social media will see.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#usernameStep')[0],
        intro: `Depending on who you are connecting with, you may want to
        include your first name or a nickname so that other people will know who
        you are.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#usernameStep')[0],
        intro: `If you don't want anyone to know who you are, pick something
          that is not related to your real name.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: `Make sure to create a strong password that you can remember!`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: `Passwords should be easy to remember so you don't get locked out
          of your accounts, but you also want to make it hard for others to
          guess.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: `Examples of bad passwords: password, 123456, abc123, 111111,
        password1, yourname11, or anything else that could be easily guessed by
        other people.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: `It’s a good idea to create different passwords for different
          sites, but make sure it’s something you can memorize! It’s not safe to
          write down your passwords. If you forget your password, there are ways
          the website can help you reset it.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: `Don’t share your password with anyone else, not even your best
          friend! One exception might be your parents. Have a conversation with
          them about safe password practices.`,
        position: "right",
        scrollTo: "tooltip"
      }
    ]
  });

  intro.onafterchange(function(){
    hideHelpMessage();
  })

  intro.start().onexit(function() {
    $("#continueTutorial").addClass('green');
  });

  return intro;
}; //end startIntro

function isTutorialBoxOffScreen(bottomOffset){
  if (window.scrollY > bottomOffset) {
    return true;
  } else {
    return false;
  }
}

function hideHelpMessage(){
  if($('#clickNextHelpMessage').is(':visible')){
    $('#clickNextHelpMessage').transition('fade');
  }
}

function showHelpMessage(){
  if($('#clickNextHelpMessage').is(':hidden')){
    $('#clickNextHelpMessage').transition('fade down');
  }
}

$(window).on("load", function() {
  const intro = startIntro();
  const tooltipTopOffset = $('.introjs-tooltip').offset().top;
  const tooltipBottomOffset = tooltipTopOffset + $('.introjs-tooltip').outerHeight();
  let scrolledAway = false;
  // When the user scrolls, check that they haven't missed the first tooltip.
  // If the tooltip is scrolled out of the viewport and the user is still on
  // the first tooltip step after 4 seconds, show a help message.
  $(window).scroll(function(){
    // only want to do this once, so check that scrolledAway is false
    if (isTutorialBoxOffScreen(tooltipBottomOffset) && (!scrolledAway)) {
      scrolledAway = true;
      setTimeout(function(){
        if(intro._currentStep === 0){
          showHelpMessage();
        }
      }, 4000);
    }
  });
});
$("#continueTutorial").on('click', function () {continueTutorial();});
