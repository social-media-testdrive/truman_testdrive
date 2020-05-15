function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true,
    'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false,
    'scrollToElement':true, 'doneLabel':'Done &#10003',
    'tooltipClass':'blueTooltip'});
      intro.setOptions({
        steps: [
          {
            intro: `Now you get to explore the TestDrive timeline! You can read
            what others have posted, respond, or make your own posts.`
          },
          {
            intro: `Here is some background before you start: Imagine that you
            have just heard that a tornado warning has been issued in your
            county. You are going on social media to see if you can find any
            information about it.`
          }

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/modual/advancedlit';
    });


  };
$(window).on("load", function() {startIntro();});
