function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':false, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: '#step1',
            intro: `Social media can help you stay connected to your friends and
            be in the know on what they're up to. It's also a great place to
            learn and explore new hobbies and interests.`,
            position: 'right'
          },
          {
            element: '#step2',
            intro: `But sometimes you might see posts that make you feel like
            you're being left out of the fun or that other people's lives are
            much more exciting than yours, which can make you feel worried, sad,
            or anxious.`,
            position: 'right'
          },
          {
            element: '#step2',
            intro: `These feelings are red flags. When you notice these red flag
            feelings, it is important to slow down and think about how you feel
            and what you can do about it.`,
            position: 'right'
          },
          // {
          //   element: '#step3',
          //   intro: `You may sometimes feel like other people's lives are much
          //   more exciting than yours after seeing their posts.`,
          //   position: 'right',
          //   // scrollTo: 'element',
          //   // scrollPadding: 100
          // },
          // {
          //   element: '#step3',
          //   intro: `But remember, people tend to post more about positive and
          //   exciting things, especially when lots of people can see it.`,
          //   position: 'right',
          //   // scrollTo: 'element',
          //   // scrollPadding: 100
          // },
          {
            element: '#step3B',
            intro: `Other times, you might be doing something cool and be
            tempted to share all about it on social media. Sharing on social
            media is great, but try not to overshare!`,
            position: 'right'
          },
          {
            element: '#step3B',
            intro: `<b>Oversharing</b> feelings, information, or experiences
            might feel good in the moment, but could cause you or others to feel
            uncomfortable later.`,
            position: 'right'
          },
          {
            element: '#step4',
            intro: `If you get a red flag feeling, just taking a break and
            logging off to do something else you enjoy can help you feel
            better.`,
            position: 'right'
          },
          {
            element: '#step4',
            intro: `A good way to enjoy social media is to <b>balance</b> it
            with other things you enjoy doing, like spending time with family
            and friends, reading a book, or playing outside.`,
            position: 'right'
          }
        ]
      });
      intro.start().onexit(function() {
      window.location.href='/sim/esteem';
    });

  };

  $(window).on("load", function() {startIntro();});
