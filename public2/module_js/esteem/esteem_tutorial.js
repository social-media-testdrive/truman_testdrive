function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':false, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: '#step1',
            intro: `Social media can help you feel connected to your friends and
            be up to date on what they are doing. You can also learn new things
            about your interests from people you follow.`,
            position: 'right',
            // scrollTo: 'tooltip'
          },
          {
            element: '#step2',
            intro: `But sometimes, you might see things that make you feel like
            your life isn’t as exciting as other people’s or you are being left
            out of things that your friends are doing.`,
            position: 'right',
            // scrollTo: 'element',
            // scrollPadding: 100
          },
          {
            element: '#step2',
            intro: `This can make you feel isolated, anxious, or uncomfortable.
            These feelings are red flags. When you notice a <b>red flag
            feeling</b>, slow down and take some time to identify what caused
            the feeling.`,
            position: 'right',
            // scrollToElement: false
          },
          {
            element: '#step2',
            intro: `It may feel like you have to <b>overshare</b> and post a lot
            of things to get people to pay attention to you, but if you do, you
            might regret it later. Instead, try taking a break from social
            media and do something else you enjoy.`,
            position: 'right',
            // scrollToElement: false
          },
          {
            element: '#step3',
            intro: `You could feel like other people’s lives are much more
            exciting than yours after seeing their posts on social media. But
            remember that most people only post about positive and exciting
            things.`,
            position: 'right',
            // scrollTo: 'element',
            // scrollPadding: 100
          },
          {
            element: '#step3',
            intro: `Remember, try to <b>balance</b> your social media use with
            other things in life, like spending time with your family and
            friends offline, reading a book, or going on a hike.`,
            position: 'right',
            // scrollToElement: false
          }
        ]
      });
      intro.start().onexit(function() {
      window.location.href='/sim/esteem';
    });

  };

  $(window).on("load", function() {startIntro();});
