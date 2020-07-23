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
            have just heard that your hometown of Chestin, California has been
            chosen to host the Olympic Games.`
          },
          {
            intro: `You are going on social media to see if you can find any
            information about it. Try to identify accurate information!`
          }

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/modual/advancedlit';
    });


  };
$(window).on("load", function() {startIntro();});
