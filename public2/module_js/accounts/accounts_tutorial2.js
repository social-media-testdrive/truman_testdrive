const stepsList = [
  {
    element: '#generalStep',
    intro: `Click "Next" to begin!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#generalStep',
    intro: `When you first create your profile, think about how much
    information you really want to share with other people.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.8.3.09.mp3']
  },
  {
    element: '#generalStep',
    intro: `Some platforms make it optional to share certain information.
      Don't feel pressured to share everything!`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.8.3.10.mp3']
  },
  {
    element: '#locationStep',
    intro: `If you include detailed information about yourself, it can be
    very easy for strangers to figure out who you are and where you live.
    Try not to be too specific when you share your location.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.8.3.11.mp3']
  }
];


function startIntro(){

  var intro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Done &#10003'
  });

  intro.setOptions({
    steps: stepsList
  });

  intro.onafterchange(function() {
    Voiceovers.playVoiceover(stepsList[$(this)[0]._currentStep].audioFile);
  });

  intro.start().onexit(function() {
    Voiceovers.pauseVoiceover();
    window.location.href='/sim/accounts';
  });
}; //end startIntro

$(window).on("load", function() {
  startIntro();
});
