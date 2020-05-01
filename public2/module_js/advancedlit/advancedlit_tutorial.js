function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true,
    'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false,
    'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: '#step1',
            intro: `What should you do when you see a <b>breaking news</b> story
            on social media? First, see if the news article is from a reliable
            news organization.`,
            position: "right",
            scrollTo: 'tooltip'
          },
          {
            element: '#step2',
            intro: `Here, you can see that the article is clearly labeled as an
            <b>opinion</b> piece, rather than a news article. Reliable news
            organizations will clearly distinguish between opinion and news.`,
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: '#step3',
            intro: `When you read an article, verify and <b>fact-check</b> the
            information. Reliable news organizations explain how and where their
            information was gathered, and provide links to relevant sources.`,
            position: "left",
            scrollTo: "tooltip"
          },
          {
            element: "#step4",
            intro: `Even with reliable news organizations, you should check with
            at least one additional source to see how it is reporting the same
            story.`,
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: '#step5',
            intro: `Breaking news stories develop over time, so initial reports
            might be incomplete. Reliable sources will make changes, add
            information, and make corrections to the original article as the
            story evolves.`,
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: '#step6',
            intro: `Think about the consequences of sharing a news article that
            is incomplete or cannot be verified. It can be harmful to form
            opinions and inform decisions based on false news.`,
            position: "right",
            scrollTo: "tooltip"
          },
          {
            element: '#step7',
            intro: `If you do decide to share something, you can add other
            reliable sources that verify and confirm the information in the
            article.`,
            position: "right",
            scrollTo: "tooltip"
          }
        ]
      });
      intro.start().onexit(function() {
      window.location.href='/sim/advancedlit';
    });

  };

$(window).on("load", function() {startIntro();});
