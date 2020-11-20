const firstStepsList = [
  {
    element: '#step1A',
    intro: `Click "Next" to begin!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step1A',
    intro: `Let's scroll through the timeline to learn how to respond to
    breaking news on social media.`,
    position: "right",
    audioFile: ['CUSML.9.3.01.mp3']
  },
  {
    element: '#step1',
    intro: `When you see a breaking news story on social media, it's
    important to make sure it is reliable.`,
    position: "right",
    audioFile: ['CUSML.9.3.02.mp3']
  },
  {
    element: '#step1',
    intro: `Let's learn more about the story before sharing it with others!
    Click on the tornado warning article to see what you can learn.`,
    position: "right",
    audioFile: ['CUSML.9.3.03.mp3']
  }
];

const secondStepsList = [
  {
    element: '#step2',
    intro: `Check to see if the article is clearly labeled as an opinion
    piece or a news article. In this example, the title states that this is a
    news article.`,
    position: "bottom",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.04.mp3']
  },
  {
    element: '#step3',
    intro: `When you read an article, <b>fact-check</b> the information!
    Reliable articles will explain where they got the information and will
    include links to the sources that the author used when writing their
    story.`,
    position: "left",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.05.mp3']
  },
  {
    element: '#step3B',
    intro: `Breaking news stories develop over time, so the first reports might
    not have all the information. Reliable articles will often make this
    clear.`,
    position: "left",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.06.mp3']
  },
  {
    element: "#step4",
    intro: `Even if an article looks reliable, it's a good idea to check with at
    least one additional source. Click the search button to see if other sites
    are reporting this story.`,
    position: "right",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.07.mp3']
  }
];

const thirdStepsList = [
  {
    element: "#step5",
    intro: `You can look for additional resources using a search engine.`,
    position: "right",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.08.mp3']
  },
  {
    element: "#step5B",
    intro: `Some of the sources you found are reporting the same news as the
    article you saw. This is a sign that the article is reliable.`,
    position: "right",
    scrollTo: "tooltip",
    audioFile: ['CUSML.9.3.09.mp3']
  },
  {
    element: "#step6",
    intro: `Click on the "Go back to the timeline" button to see what you can
    do next.`,
    position: "bottom",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.10.mp3']
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
    scrollPadding: 90,
    audioFile: ['CUSML.9.3.11.mp3']
  },
  {
    element: '#step1',
    intro: `If you are not sure whether the article is accurate, do not share it
    with others. You don't want others believing something that may not be true!`,
    position: "right",
    scrollTo: "element",
    audioFile: ['CUSML.9.3.12.mp3']
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

  intro.onafterchange(function() {
    Voiceovers.playVoiceover(firstStepsList[$(this)[0]._currentStep].audioFile);
  });

  intro.start().onexit(function() {
    Voiceovers.pauseVoiceover();
    $('#instructionsToContinueOne').show();
    $(".articleCard").css("box-shadow", "0px 0px 15px #14a1f6")
    $('.ui.card.articleCard').off();
    $('.ui.card.articleCard').on('click', function(){
      if($(this).hasClass('articleCardClickable')){
        $(this).transition({
          animation: 'pulse',
          onComplete: function(){
            changeActiveTab('article');
            $('#instructionsToContinueOne').hide();
            startSecondIntro();
            Voiceovers.playVoiceover(secondStepsList[0].audioFile);
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
    }
    if(currentStep === 2){
      $('.scrollToHere')[0].scrollIntoView();
      $('.ui.card.articleCard').addClass('articleCardClickable');
    }
  });

  // $('.ui.card.articleCard').on('click', function(){
  //   if($(this).hasClass('articleCardClickable')){
  //     $(this).transition({
  //       animation: 'pulse',
  //       onComplete: function(){
  //         intro.exit();
  //         changeActiveTab('article');
  //         $('#instructionsToContinueOne').hide();
  //         startSecondIntro();
  //         Voiceovers.playVoiceover(secondStepsList[0].audioFile);
  //       }
  //     });
  //   }
  // });
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
    Voiceovers.pauseVoiceover();
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

  secondIntro.onafterchange(function() {
    Voiceovers.playVoiceover(secondStepsList[$(this)[0]._currentStep].audioFile);
  });

  $('.ui.big.button.searchTab').on('click', function(){
    if($(this).hasClass('green')){
      secondIntro.exit();
      $('#instructionsToContinueTwo').hide();
      changeActiveTab('search');
      startThirdIntro();
      Voiceovers.playVoiceover(thirdStepsList[0].audioFile);
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
    Voiceovers.pauseVoiceover();
    $('#instructionsToContinueThree').show();
  });

  thirdIntro.onbeforechange( function() {
    let currentStep = $(this)[0]._currentStep;
    if(currentStep === 1){
      window.scrollTo(0, 0);
      $('.ui.big.button.homeTab').addClass('testDriveBlue');
    }
  });

  thirdIntro.onafterchange(function() {
    Voiceovers.playVoiceover(thirdStepsList[$(this)[0]._currentStep].audioFile);
  });

  $('.ui.big.button.homeTab').on('click', function(){
    if($(this).hasClass('testDriveBlue')){
      thirdIntro.exit();
      $('#instructionsToContinueThree').hide();
      changeActiveTab('home');
      startFourthIntro();
      Voiceovers.playVoiceover(fourthStepsList[0].audioFile);
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

  fourthIntro.onafterchange(function() {
    Voiceovers.playVoiceover(fourthStepsList[$(this)[0]._currentStep].audioFile);
  });

  fourthIntro.start().onexit(function(){
    Voiceovers.pauseVoiceover();
    window.location.href = '/sim/advancedlit';
  });
};




$(window).on("load", function() {

  startIntro();

});
