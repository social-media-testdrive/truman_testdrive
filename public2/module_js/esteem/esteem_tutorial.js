function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step1')[0],
            intro: `Have you ever noticed when using social media can make you
            feel isolated, anxious, or uncomfortable? These feelings can be red
            flags.`,
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: `You can have a <b>red flag feeling</b> if you feel like your
            life isn’t as exciting as other people’s or if you feel like you are
            being left out of cool things that your friends are doing.`,
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step2')[0],
            intro: `When you notice a red flag feeling, slow down and take some
            time to identify what caused the feeling and take steps to address
            it in a positive way.`,
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step2')[0],
            intro: `If you just keep scrolling through your feed, it can make
            you feel worse. Being able to figure out what is causing these
            feelings can help you know what to do to feel better.`,
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step3')[0],
            intro: `If you are feeling left out, one of the ways you can feel
            better is by being an active user of social media. Try reaching out
            to someone through a private message - talking to your close friends
            and family on social media can make you feel better.`,
            position: 'right',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step4')[0],
            intro: `Commenting on people’s posts, asking questions, sharing
            similar or related experiences can all help you feel like you are
            less on the outside. You can make a post of your own, too!`,
            position: 'left',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('#step3')[0],
            intro: `If you notice that you are starting to feel anxious or
            depressed, it may be a good idea to take a social media break. Do
            something else you really enjoy, like spending time with your family
            and friends offline, reading a book, or going on a hike.`,
            position: 'left',
            scrollTo: 'tooltip'
          },

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/sim/esteem';
    });

  };

  $(window).on("load", function() {startIntro();});
