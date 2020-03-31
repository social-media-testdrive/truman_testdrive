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
    hint: `Think about whether you want to include your part of your name or a
    nickname. You may or may not want people to know exactly who you are based
    on your username. `,
    element: '#hint1',
    hintPosition: 'middle-middle'
  },
  {
    hint: `Make sure you have a strong password that you can easily remember,
    but that is difficult for others to guess!`,
    element: '#hint2',
    hintPosition: 'middle-middle'
  }
];

let result;

function eventsAfterHints(){
  $('input[name="username"]').removeAttr('readonly');
  $('input[name="password"]').removeAttr('readonly');
  $('input[name="password"]').on('input', function(){

    result = zxcvbn($(this).val());
    switch (result.score) {
      case 0:
        if(result.password === ""){
          $('#passwordStrength').progress('reset');
          $("#strengthLabel").text("Password Strength");
        } else {
          $('#passwordStrength').progress({ value: 1 });
          $("#strengthLabel").text("Password Strength: Very Weak");
        }
        break;
      case 1:
        $('#passwordStrength').progress({ value: 2 });
        $("#strengthLabel").text("Password Strength: Weak");
        break;
      case 2:
        $('#passwordStrength').progress({ value: 3 });
        $("#strengthLabel").text("Password Strength: Moderate");
        break;
      case 3:
        $('#passwordStrength').progress({ value: 4 });
        $("#strengthLabel").text("Password Strength: Strong");
        break;
      case 4:
        $('#passwordStrength').progress({ value: 5 });
        $("#strengthLabel").text("Password Strength: Very Strong");
        break;
      default:
        $('#passwordStrength').progress('reset');
        $("#strengthLabel").text("Password Strength");
        break;
    }
  });
};
