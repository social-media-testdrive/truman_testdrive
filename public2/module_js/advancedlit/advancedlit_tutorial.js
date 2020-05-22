function changeActiveTab(newActiveTab) {
  $('.ui.tab').removeClass('active');
  switch (newActiveTab) {
    case 'home':
      $('.ui.tab[data-tab="one"]').addClass('active');

      break;
    case 'article':
      $('.ui.tab[data-tab="two"]').addClass('active');
      break;
    case 'search':
      $('.ui.tab[data-tab="three"]').addClass('active');
      break;
    default:
      $('.ui.tab[data-tab="one"]').addClass('active');
      break;
  }
}

function startIntro(){
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true,
  'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false,
  'scrollToElement':true, 'doneLabel':'Done &#10003' });

  intro.setOptions({
    steps: [
      {
        element: '#step1',
        intro: `What should you do when you see a <b>breaking news</b> story
        on social media? Here are some ways to see if the news article is
        reliable.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: '#step2',
        intro: `Here, you can see that the article is clearly labeled as an
        <b>opinion</b> piece, rather than a news article. Reliable articles will
        clearly distinguish between opinion and news.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step3',
        intro: `When you read an article, verify and <b>fact-check</b> the
        information. Reliable articles explain how and where their information
        was gathered, and provide links to relevant sources.`,
        position: "left",
        scrollTo: "tooltip"
      },
      {
        element: "#step4",
        intro: `Even if an article looks reliable, you should check with at
        least one additional source. Is the story being reported by other news
        sites?`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step5',
        intro: `Breaking news stories develop over time, so the first reports
        might not have all the information. Reliable articles will make changes,
        add information, and make corrections to the original article as the
        story evolves.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step6',
        intro: `Think about the consequences of sharing a news article that
        isn’t accurate or doesn’t have all the information. It can be harmful to
        form opinions and make decisions based on false news.`,
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: '#step7',
        intro: `If you do decide to share something, you can add other reliable
        sources that report the same information in the article.`,
        position: "right",
        scrollTo: "tooltip"
      }
    ]
  });

  intro.start().onexit(function() {
    window.location.href='/sim1/advancedlit';
  });

  intro.onbeforechange(function (){
    let currentStep = $(this)[0]._currentStep;
    if(currentStep === 0){
        changeActiveTab('home');
    } else if ((1 <= currentStep) && (currentStep < 4) ){
      // if(currentStep === 1){
      //   $('.ui.card').transition({
      //     animation: 'pulse',
      //     onComplete: function(){
      //       console.log('COMPELTED ANIMATION');
      //       changeActiveTab('article');
      //     }
      //   });
      // } else {
        changeActiveTab('article');
      // }
    } else if (currentStep >= 4) {
      changeActiveTab('search');
    }
  });

};

$(window).on("load", function() {
  startIntro();
});
