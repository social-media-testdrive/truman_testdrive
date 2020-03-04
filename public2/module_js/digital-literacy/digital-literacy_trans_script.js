function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003', 'tooltipClass':'blueTooltip'});
      intro.setOptions({
        steps: [
          {
            intro: "Now you get to explore the TestDrive timeline! You can read what others have posted, respond, or make your own posts."
          },
          {
            intro: "As you look through the timeline, see if you can spot the signs of fake news articles being shared."

          },
          {

            intro: "You can also click on the articles and decide what you would do next."

          }

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/modual/digital-literacy';
    });


  };
  $(window).on("load", function() {startIntro();});
