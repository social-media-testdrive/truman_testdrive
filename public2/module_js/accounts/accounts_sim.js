function reportPasswordStrength(currentInput){

  var regexCaps = new RegExp("[A-Z]+");
  var regexLower = new RegExp("[a-z]+");
  var regexNum = new RegExp("[0-9]+");
  var regexSymbol = new RegExp("[\\W|_]+");

  if(regexCaps.test(currentInput)){
    uppercase = 1;
  } else {
    uppercase = 0;
  }

  if(regexLower.test(currentInput)){
    lowercase = 1;
  } else {
    lowercase = 0;
  }

  if(regexNum.test(currentInput)){
    number = 1;
  } else {
    number = 0;
  }

  if(regexSymbol.test(currentInput)){
    symbol = 1;
  } else {
    symbol = 0;
  }

  //correcting any potentially lagging UI
  if((uppercase + lowercase + number + symbol) == 0){
    $('#passwordStrength').progress('reset');
    $("#strengthLabel").text("Password Strength");
  }
  //showing a message to indicate strength: weak, average, strong, very strong
  if((uppercase + lowercase + number + symbol) == 1){
    $('#passwordStrength').progress({
      value: 1
    });
    $("#strengthLabel").text("Password Strength: Weak");
  }
  //showing a message to indicate strength: weak, average, strong, very strong
  if((uppercase + lowercase + number + symbol) == 2){
    $('#passwordStrength').progress({
      value: 2
    });
    $("#strengthLabel").text("Password Strength: Average");
  }

  //showing a message to indicate strength: weak, average, strong, very strong
  if((uppercase + lowercase + number + symbol) == 3){
    $('#passwordStrength').progress({
      value: 3
    });
    $("#strengthLabel").text("Password Strength: Strong");
  }

  //showing a message to indicate strength: weak, average, strong, very strong
  if((uppercase + lowercase + number + symbol) == 4){
    $('#passwordStrength').progress({
      value: 4
    });
    $("#strengthLabel").text("Password Strength\: Very Strong");
  }

};

function clickHint(){
  clickCount++;
  if(clickCount > 6){
    //show the guidance message, user probably doesn't know to click "got it"
    if($('#removeHidden').is(":hidden")){
      $('#removeHidden').transition('fade');
      $('#continueSim').css('margin-bottom', '10em');
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
  if(counter == 7) {
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
    if(counter != 7){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#continueSim').css('margin-bottom', '10em');
    }
  }
};

function startHints(){

  //enable the fields
  $('input[name="username"]').removeAttr('readonly');
  $('input[name="password"]').removeAttr('readonly');

  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: [
      {
        hint: 'Choose a good username.',
        element: '#hint1',
        hintPosition: 'middle-left'
      },
      {
        hint: `If the social media site is for connecting with friends, family,
          and people you know offline, you could include your first name or a
          nickname.`,
        element: '#hint1',
        hintPosition: 'middle-middle'
      },
      {
        hint: `If you don't want anyone to know who you are, pick something that
          is not related to your real name.`,
        element: '#hint1',
        hintPosition: 'middle-right'
      },
      {
        hint: `Choose a password. Make sure that it is hard to guess but easy to
          remember.`,
        element: '#hint2',
        hintPosition: 'middle-left'
      },
      {
        hint: `Try making your password a phrase or sentence rather than a
          single word, or just the first letter of each word in a sentence.
          For example, the sentence “I graduated from Montgomery Elementary
          School in 2019” can be shortened to “IgfMESi2019”, which is a strong
           password!`,
        element: '#hint2',
        hintPosition: 'middle-middle'
      },
      {
        hint: `You could also try using two or more words connected by numbers
          or symbols you can remember. For example, “Montgomery2019Elementary”
          would be a good place to start.`,
        element: '#hint2',
        hintPosition: 'middle-right'
      },
      {
        hint: `You can make your password even stronger by including different
          types of characters, such as capital letters, numbers, and symbols.
          Making your password longer can be good too!`,
        element: '#hint3',
        hintPosition: 'top-middle'
      }
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
  symbol = 0;

  $('input[name="password"]').on('input', function(){reportPasswordStrength($(this).val());});

};

function errorCheck(){
  if(counter != 7){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#continueSim').css('margin-bottom', '10em');
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
        intro: `Let’s practice creating an account on social media.`,
        position: "right",
        scrollTo: 'tooltip'
      },
      {
        element: document.querySelectorAll('#generalStep')[0],
        intro: `Click on the blue dots&nbsp;<a role='button' tabindex='0'
          class='introjs-hint'><div class='introjs-hint-dot'></div>
          <div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;
          to learn more...`,
        position: "right",
        scrollTo: 'tooltip'
      }

    ]
  });

  intro.start().onexit(function() {startHints()});
  $('#continueSim').on('click', function() {errorCheck()});



};

$(window).on("load", function() {startIntro();});
