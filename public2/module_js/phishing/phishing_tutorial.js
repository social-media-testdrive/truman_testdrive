function startIntro(){

  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });

  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#step0')[0],
        intro: `One way someone can try to steal your identity on the internet
        is by getting you to click on a link or enter
        information about yourself.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#step0')[0],
        intro: `Here are some tips on how to identify a phishing scam on
        social media.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#shortenedURL')[0],
        intro: `Look out for shortened URLs in posts or private messages.
        This is a strategy scammers use to make people go into a risky website.
        Even if a URL is not shortened, check carefully to make sure
        it is correct.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#step0')[0],
        intro: `If something sounds too good to be true, be skeptical!
        Scammers often offer easy chances to win free money or prizes.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: `Be wary of messages that sound urgent. Scammers often create
        posts that make you worry or feel like something is wrong.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step5')[0],
        intro: `Look out for spelling and grammar errors, as well as images
        that don’t look quite right. A real company does not send out
        messages with these kinds of errors.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#step6')[0],
        intro: `What can you do if you see someone posting a phishing scam?`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#shortenedURL3')[0],
        intro: `Ignore the link and don’t click on it, especially if it is a
        shortened or incorrect URL!`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#flagStep')[0],
        intro: `You can press the “Flag” button to report the post
        to the website.`,
        position: "right",
        scrollTo: "tooltip"
      }

    ]
  });

  intro.start().onexit(function() {
    window.location.href='/tut_guide/phishing';
  });

}; //end startIntro

$(window).on("load", function() { startIntro(); });
