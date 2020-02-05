function reportPasswordStrength(currentInput){

  var regexCaps = new RegExp("[A-Z]+");
  var regexLower = new RegExp("[a-z]+");
  var regexNum = new RegExp("[0-9]+");

  if(regexCaps.test(currentInput)){
    if(uppercase == 0){
      uppercase = 1;
      $('#example5').progress('increment');
    }
  } else {
    if(uppercase == 1){
      $('#example5').progress('decrement');
    }
    uppercase = 0;
  }

  if(regexLower.test(currentInput)){
    if(lowercase == 0){
      lowercase = 1;
      $('#example5').progress('increment');
    }
  } else {
    if(lowercase == 1){
      $('#example5').progress('decrement');
    }
    lowercase = 0;
  }

  if(regexNum.test(currentInput)){
    if(number == 0){
      number = 1;
      $('#example5').progress('increment');
    }
  } else {
    if(number == 1){
      $('#example5').progress('decrement');
    }
    number = 0;
  }

  //correcting any potentially lagging UI
  if((uppercase + lowercase + number) == 0){
    $('#example5').progress('reset');
  }
};

function clickHint(){
  clickCount++;
  if(clickCount > 5){
    //show the guidance message, user probably doesn't know to click "got it"
    if($('#removeHidden').is(":hidden")){
      $('#removeHidden').transition('fade');
      $('#contintueSim').css('margin-bottom', '10em');
    } else {
      $('#removeHidden').transition('bounce');
    }
  }
};

function closeHint(){
  counter++;
  clickCount = 0;
  if($('#removeHidden').is(":visible")){
    $('#removeHidden').transition('fade');
    $('#continueSim').css('margin-bottom','4em');
  }
  if(counter == 6) {
    if($('#clickAllDotsWarning').is(':visible')){
      $('#clickAllDotsWarning').transition('fade');
      $('#continueSim').css('margin-bottom','4em');
    }
    $( "#continueSim" ).addClass("green");
  }
};

//showing the "Need some help?" guidance message after 2 minutes
function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(counter != 6){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#contintueSim').css('margin-bottom', '10em');
    }
  }
};

function startHints(){
  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: [
      {
        hint: 'Choose a good username.',
        element: '#hint1',
        hintPosition: 'middle-left'
      },
      {
        hint: 'You can use your first name or a nickname. Be careful not to use your full name!',
        element: '#hint1',
        hintPosition: 'middle-middle'
      },
      {
        hint: "If you don't want anyone to know who you are, pick something that is not related to your real name.",
        element: '#hint1',
        hintPosition: 'middle-right'
      },
      {
        hint: "Choose a password. Make sure that it is hard to guess but easy to remember.",
        element: '#hint2',
        hintPosition: 'middle-left'
      },
      {
        hint: "Try making your password a phrase or sentence rather than a single word, or just the first letter of each word in a sentence. For example, the sentence “I graduated from Montgomery Elementary School in 2019” can be shortened to “IgfMESi2019”, which is a strong password!",
        element: '#hint2',
        hintPosition: 'middle-middle'
      },
      {
        hint: "You can also include different types of characters, such as capital letters, numbers, and symbols, to create a stronger password.",
        element: '#hint2',
        hintPosition: 'middle-right'
      },
    ]
  });

  hints.addHints();
  clickCount = 0;
  counter=0;
  //for providing guidance message
  hints.onhintclick(function() {clickHint();});
  hints.onhintclose(function() {closeHint();});

  //for the password strength indicator
  uppercase = 0;
  lowercase = 0;
  number = 0;

  $('input[name="password"]').on('input', function(){reportPasswordStrength($(this).val());});

};

function errorCheck(){
  if(counter != 6){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
  if ($("#continueSim").hasClass("green")){
    window.location.href = "/sim2/accounts"
  }
};

function startIntro(){
  //global
  counter = 0;
  clickCount = 0;
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
        position: "right",
        scrollTo: 'tooltip'
      }

    ]
  });

  intro.start().onexit(function() {startHints()});
  $('#continueSim').on('click', function() {errorCheck()});



};

$(window).on("load", function() {startIntro();});
