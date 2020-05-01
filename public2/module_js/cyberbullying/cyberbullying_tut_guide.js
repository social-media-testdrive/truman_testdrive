function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true,
    'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false,
    'scrollToElement':true, 'doneLabel':'Done &#10003',
    'tooltipClass':'blueTooltip' });
    intro.setOptions({
      steps: [
        {
          intro: `Now that you know the basics of what cyberbullying is, let's
          practice what you can do if you see it happen.`
        },
        {
          intro: `On the next page, you will see some acts of cyberbullying.`

        },
        {

          intro: `Follow the instructions on the screen to practice what to do
          when you see cyberbullying happening online.`

        }
      ]
    });
    intro.start().onexit(function() {
    window.location.href='/sim/cyberbullying';
  });
};

$(window).on("load", function() {startIntro();});
