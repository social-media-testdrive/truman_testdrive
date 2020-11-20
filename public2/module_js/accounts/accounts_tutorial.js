const stepsList = [
  {
    element: '#usernameStep',
    intro: `Click "Next" to begin!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#usernameStep',
    intro: `Choose your username carefully! This is the name other people on
    social media will see.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.8.3.01.mp3']
  },
  {
    element: '#usernameStep',
    intro: `Depending on who you are connecting with, you may want to
    include your first name or a nickname so that other people will know who
    you are.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.8.3.02.mp3']
  },
  {
    element: '#usernameStep',
    intro: `If you don't want anyone to know who you are, pick something
      that is not related to your real name.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.8.3.03.mp3']
  },
  {
    element: '#passwordStep',
    intro: `Make sure to create a strong password that you can remember!`,
    position: "right",
    scrollTo: "tooltip",
    audioFile: ['CUSML.8.3.04.mp3']
  },
  {
    element: '#passwordStep',
    intro: `Passwords should be easy to remember so you don't get locked out
      of your accounts, but you also want to make it hard for others to
      guess.`,
    position: "right",
    scrollTo: "tooltip",
    audioFile: ['CUSML.8.3.05.mp3']
  },
  {
    element: '#passwordStep',
    intro: `Examples of bad passwords: password, 123456, abc123, 111111,
    password1, yourname11, or anything else that could be easily guessed by
    other people.`,
    position: "right",
    scrollTo: "tooltip",
    audioFile: ['CUSML.8.3.06.mp3']
  },
  {
    element: '#passwordStep',
    intro: `It’s a good idea to create different passwords for different
      sites, but make sure it’s something you can memorize! It’s not safe to
      write down your passwords. If you forget your password, there are ways
      the website can help you reset it.`,
    position: "right",
    scrollTo: "tooltip",
    audioFile: ['CUSML.8.3.07.mp3']
  },
  {
    element: '#passwordStep',
    intro: `Don’t share your password with anyone else, not even your best
      friend! One exception might be your parents. Have a conversation with
      them about safe password practices.`,
    position: "right",
    scrollTo: "tooltip",
    audioFile: ['CUSML.8.3.08.mp3']
  }
]

function continueTutorial(){
  if($("#continueTutorial").hasClass("green")){
      window.location.href='/tutorial2/accounts';
  }
}

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
    $("#continueTutorial").addClass('green');
  });
}; //end startIntro

$(window).on("load", function() { startIntro(); });
$("#continueTutorial").on('click', function () {continueTutorial();});
