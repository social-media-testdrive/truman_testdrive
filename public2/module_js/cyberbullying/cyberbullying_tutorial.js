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
        element: '#step1',
        intro: `You have recently seen that some people keep saying mean
        things about Dylan. A group of friends from school are bullying
        Dylan on social media.`,
        position: 'right',
        scrollTo: 'tooltip'
      },
      {
        element: '#step1',
        intro: `<b>Cyberbullying</b> is when someone posts or shares
        negative things about someone else online. <br>The <b>bully</b> may
        use digital devices, sites, or apps. The bully often does this again
        and again to the same person.`,
        position: 'right',
        scrollTo: 'tooltip'
      },
      {
        element: '#step3.text',
        intro: `This is an example of <b>cyberbullying.</b>`,
        position: 'right',
        scrollTo: 'tooltip'
      },
      {
        element: 'a.flag',
        intro: `One way you can act against cyberbullying is by pressing the
        <b>“Flag”</b> button.`,
        position: 'right',
        scrollTo: 'tooltip'
      },
      {
        element: 'a.flag',
        intro: `<b>Flagging</b> something will report it to the website and
        the bullying post will be taken down. Sometimes it takes a while for
        the website to respond.`,
        position: 'right',
        scrollTo: 'tooltip'
      },
      {
        element: '#step7',
        intro: `Another way you can act against cyberbullying is by writing
        a <b>supportive comment</b> to the target.`,
        position: 'left',
        scrollTo: 'tooltip'
      },
      {
        element: '#step7',
        intro: `Another way you can act against cyberbullying is by
        <b>confronting the bully</b>.`,
        position: 'left',
        scrollTo: 'tooltip'
      },

    ]
  });

  intro.onbeforechange(function(){
    hideHelpMessage();
  })

  intro.start().onexit(function() {
    window.location.href='/tut_guide/cyberbullying';
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
