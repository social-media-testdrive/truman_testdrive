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
        element: document.querySelectorAll('#step3')[0],
        intro: "People can have additional or anonymous accounts to post things that are more personal or casual for only a close group of friends to see.",
        position:'right',
        scrollTo:'tooltip'
      },
      {
        element: document.querySelectorAll('#step3')[0],
        intro: "Sometimes, people create a separate account to talk to others who are interested in the same things as they are (e.g., video games, soccer, music).",
        position:'right',
        scrollTo:'tooltip'
      },
      {
        element: document.querySelectorAll('#step3')[0],
        intro: "When they do this, they might want to be anonymous since they are talking to people that they do not know very well.",
        position:'right',
        scrollTo:'tooltip'
      },
      {
        element: document.querySelectorAll('#step4')[0],
        intro: "Some people create fake accounts to post mean things or to cyberbully people, but it's important to be kind and respectful on social media, no matter what account you are on.",
        position:'left',
        scrollTo:'tooltip'
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: "Remember, even if you don’t use your real name, people might still figure out who you are from the things you post or the friends you have.",
        position:'bottom',
        scrollTo:'tooltip'
      }

    ]
  });

  intro.onbeforechange(function(){
    hideHelpMessage();
  })

  intro.start().onexit(function() {
    window.location.href='/sim/presentation';
  });
  return intro;
};

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
