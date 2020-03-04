function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step1A')[0],
            intro: "Fake news articles use <b>shocking and exaggerated headlines and images</b> to get you to click on them. Often, the headline will try to make you curious and lure you like bait to click on it.",
            position: 'left',
            scrollTo: 'tooltip'
          },
          {
            element: document.querySelectorAll('.post')[0],
            intro: "Does the article <b>use wild or sensational images</b> that are trying to make you feel a strong emotion? <br>This is another strategy of <b>clickbait articles.</b>",
            position: 'left',
            scrollTo: "tooltip"
          },
          {
            element: document.querySelectorAll('#step3')[0],
            intro: "If you find <b>unusual web addresses or site names</b>, including those that end with '.com.co' this is a sign of fake news. These sites may appear like real news websites but most often are not.",
            position: 'bottom',
            scrollTo: "tooltip"
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "Are there many spelling errors, lots of ALL CAPS, or dramatic punctuation?!?!???? These are all signs that the article <b>may not be credible.</b>",
            position: 'bottom',
            scrollTo: "tooltip"
          },

        ]
      });
      intro.start().onexit(function() {
      window.location.href='/tut_guide/digital-literacy';
    });

  };

  $(window).on("load", function() {startIntro();});
