function startIntro(){
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003', 'tooltipClass':'blueTooltip'});
  intro.setOptions({
    steps: [
      {
        intro: "Now you get to explore the TestDrive timeline! You can read what others have posted, respond, or make your own posts."
      },
      {
        intro: " As you look through the timeline, see if you can spot posts that are phishing scams."

      }
    ]
  });
  intro.start().onexit(function() {
    window.location.href='/modual/phishing';
  });
};

$(window).on("load", function() {startIntro();});
