function startIntro(){

  var intro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  intro.setOptions({
    steps: [
      {
        element: '#step0',
        intro: `One way someone can try to steal your identity on the internet
        is by getting you to click on a link or enter
        information about yourself.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: '#step0',
        intro: `Here are some tips on how to identify a phishing scam on
        social media.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: '#shortenedURL',
        intro: `Look out for shortened URLs in posts or private messages.
        This is a strategy scammers use to make people go into a risky website.
        Even if a URL is not shortened, check carefully to make sure
        it is correct.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: '#step0',
        intro: `If something sounds too good to be true, be skeptical!
        Scammers often offer easy chances to win free money or prizes.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step5',
        intro: `Be wary of messages that sound urgent. Scammers often create
        posts that make you worry or feel like something is wrong.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step5',
        intro: `Look out for spelling and grammar errors, as well as images
        that don’t look quite right. A real company does not send out
        messages with these kinds of errors.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step6',
        intro: `What can you do if you see someone posting a phishing scam?`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#shortenedURL3',
        intro: `Ignore the link and don’t click on it, especially if it is a
        shortened or incorrect URL!`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#flagStep',
        intro: `You can press the “Flag” button to report the post
        to the website.`,
        position: "right",
        scrollTo: "tooltip"
      }
    ]
  });

  intro.onbeforechange(function(){
    hideHelpMessage();
  })

  intro.start().onexit(function() {
    window.location.href='/tut_guide/phishing';
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
