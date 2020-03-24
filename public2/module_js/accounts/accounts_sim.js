var stepsList = [
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
];

var hintsList = [
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
];

//for the password strength indicator
const regexCaps = new RegExp("[A-Z]+");
const regexLower = new RegExp("[a-z]+");
const regexNum = new RegExp("[0-9]+");
const regexSymbol = new RegExp("[\\W|_]+");
let uppercase = 0;
let lowercase = 0;
let number = 0;
let symbol = 0;
let strengthLevel = 0;

function reportPasswordStrength(currentInput){
  uppercase = regexCaps.test(currentInput);
  lowercase = regexLower.test(currentInput);
  number = regexNum.test(currentInput);
  symbol = regexSymbol.test(currentInput);

  strengthLevel = uppercase + lowercase + number + symbol;

  switch (strengthLevel) {
    case 0:
      $('#passwordStrength').progress('reset');
      $("#strengthLabel").text("Password Strength");
      break;
    case 1:
      $('#passwordStrength').progress({ value: 1 });
      $("#strengthLabel").text("Password Strength: Weak");
      break;
    case 2:
      $('#passwordStrength').progress({ value: 2 });
      $("#strengthLabel").text("Password Strength: Average");
      break;
    case 3:
      $('#passwordStrength').progress({ value: 3 });
      $("#strengthLabel").text("Password Strength: Strong");
      break;
    case 4:
      $('#passwordStrength').progress({ value: 4 });
      $("#strengthLabel").text("Password Strength: Very Strong");
      break;
    default:
      $('#passwordStrength').progress('reset');
      $("#strengthLabel").text("Password Strength");
      break;
  }
};


function eventsAfterHints(){
  $('input[name="username"]').removeAttr('readonly');
  $('input[name="password"]').removeAttr('readonly');
  $('input[name="password"]').on('input', function(){reportPasswordStrength($(this).val())});
};
