const firstStepsList = [
  {
    element: '#step1A',
    intro: `Scroll through the timeline to learn how to respond to breaking news
    on social media.`,
    position: "right"
  },
  {
    element: '#step1',
    intro: `When you see a breaking news story on social media, it's
    important to make sure it is reliable.`,
    position: "right"
  },
  {
    element: '#step1',
    intro: `Click on the story to learn more before sharing it with
    others! `,
    position: "right"
  }
];

const secondStepsList = [
  {
    element: '#step2',
    intro: `Check to see if the article is clearly labeled as an opinion
    piece or a news article. In this example, the title states that this is a
    news article.`,
    position: "bottom",
    scrollTo: "element"
  },
  {
    element: '#step3',
    intro: `When you read an article, <b>fact-check</b> the information!
    Reliable articles will explain where they got the information and will
    include links to the sources that the author used when writing their
    story.`,
    position: "left",
    scrollTo: "element"
  },
  {
    element: '#step3B',
    intro: `Breaking news stories develop over time, so the first reports
    might not have all the information, and reliable articles will often make
    this clear.`,
    position: "left",
    scrollTo: "element"
  },
  {
    element: "#step4",
    intro: `Even if an article looks reliable, it's a good idea to check with at
    least one additional source. Click the search button to see if other sites
    are reporting this story.`,
    position: "right",
    scrollTo: "element"
  }
];

const thirdStepsList = [
  {
    element: "#step5",
    intro: `You can look for additional resources using a search engine. Make
    sure you click on a website you can trust.`,
    position: "right",
    scrollTo: "element"
  },
  {
    element: "#step6",
    intro: `Click on the "Go back to the timeline" button to see what you can
    do next.`,
    position: "bottom",
    scrollTo: "element"
  }
]

const fourthStepsList = [
  {
    element: '#step1',
    intro: `We verified that the article is from a trustworthy site and that
    others are reporting the same news. It’s okay to share this breaking news
    with your friends.`,
    position: "right",
    scrollTo: "element",
    scrollPadding: 90
  },
  {
    element: '#step1',
    intro: `It's important not to share a news article that isn’t accurate since
    you don't want others believing something that isn't true!`,
    position: "right",
    scrollTo: "element"
  }
]

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
  window.scrollTo(0, 0);
  let intro = introJs().setOptions({
    steps: firstStepsList,
    'scrollToElement': false,
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'doneLabel':'Done &#10003'
  });

  intro.start().onexit(function() {
    $('#instructionsToContinueOne').show();
    $('.ui.card.articleCard').on('click', function(){
      if($(this).hasClass('articleCardClickable')){
        $(this).transition({
          animation: 'pulse',
          onComplete: function(){
            changeActiveTab('article');
            $('#instructionsToContinueOne').hide();
            startSecondIntro();
          }
        });
      }
    });
  });

  intro.onbeforechange( function() {
    let currentStep = $(this)[0]._currentStep;
    if (currentStep < 1){
      window.scrollTo(0, 0);
      $('.ui.card.articleCard').removeClass('articleCardClickable');
    }
    if(currentStep === 1){
      $('.scrollToHere')[0].scrollIntoView();
      $('.ui.card.articleCard').addClass('articleCardClickable');
    }
    if(currentStep === 2){
      $('.scrollToHere')[0].scrollIntoView();
    }
  });


}

function startSecondIntro(){

  window.scrollTo(0, 0);
  let secondIntro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  secondIntro.setOptions({
    steps: secondStepsList
  });

  secondIntro.start().onexit(function(){
    $('#instructionsToContinueTwo').show();
  });

  secondIntro.onbeforechange( function() {
    let currentStep = $(this)[0]._currentStep;
    if (currentStep < 3){
      $('.ui.big.button.searchTab').removeClass('green');
    }
    if(currentStep === 3){
      window.scrollTo(0, 0);
      $('.ui.big.button.searchTab').addClass('green');
    }
  });

  $('.ui.big.button.searchTab').on('click', function(){
    if($(this).hasClass('green')){
      secondIntro.exit();
      $('#instructionsToContinueTwo').hide();
      changeActiveTab('search');
      startThirdIntro();
    }
  });
};

function startThirdIntro(){

  window.scrollTo(0, 0);
  let thirdIntro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  thirdIntro.setOptions({
    steps: thirdStepsList
  });

  thirdIntro.start().onexit(function(){
    $('#instructionsToContinueThree').show();
  });

  thirdIntro.onbeforechange( function() {
    let currentStep = $(this)[0]._currentStep;
    if(currentStep === 1){
      window.scrollTo(0, 0);
      $('.ui.big.button.homeTab').addClass('testDriveBlue');
    }
  });

  $('.ui.big.button.homeTab').on('click', function(){
    if($(this).hasClass('testDriveBlue')){
      thirdIntro.exit();
      $('#instructionsToContinueThree').hide();
      changeActiveTab('home');
      startFourthIntro();
    }
  });
};

function startFourthIntro(){

  $('.ui.card.articleCard').removeClass('articleCardClickable');
  $('.scrollToHere')[0].scrollIntoView();

  let fourthIntro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  fourthIntro.setOptions({
    steps: fourthStepsList
  });

  fourthIntro.start().onexit(function(){
    window.location.href = '/sim/advancedlit';
  });


};




$(window).on("load", function() {

  startIntro();

});
