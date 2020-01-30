function continueTutorial(){
  if($("#continueTutorial").hasClass("green")){
      window.location.href='/tutorial2/accounts';
  }
}

function startIntro(){

  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });

  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#usernameStep')[0],
        intro: "Choose a good username. This is your name other people on social media will see.",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#usernameStep')[0],
        intro: "Think about the website's purpose. Is it for connecting with friends? Then you might just use your first name or a nickname. Be careful not to use your full name.",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#usernameStep')[0],
        intro: "If you don't want anyone to know who you are, pick something that is not related to your real name.",
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: "Make sure to create a strong password that you can remember!",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: "Passwords should be easy to remember so we don't get locked out of our accounts, but we also want to make it hard for others to guess them.",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: "Examples of bad passwords: password, 123456, abc123, 111111, password1, yourname11, or anything else that could be easily guessed by other people.",
        position: "right",
        scrollTo: "tooltip"
      },
      {
        element: document.querySelectorAll('#passwordStep')[0],
        intro: "Try not to use the same password across different sites. If you have trouble remembering all the different passwords, try writing it down in a safe place or asking your parents for help.",
        position: "right",
        scrollTo: "tooltip"
      }
    ]
  });

  intro.start().onexit(function() {
    $("#continueTutorial").addClass('green');
  });
}; //end startIntro

$(window).on("load", function() { startIntro(); });
$("#continueTutorial").on('click', function () {continueTutorial();});
