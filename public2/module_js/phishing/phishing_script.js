//Convenient variable to indicate which module we're in
let pathArray = window.location.pathname.split('/');
var currentModule = pathArray[2];

//Activating the sticky functionality for the left column
//$('.ui.sticky.sideMenu').sticky();


//Misc code
$('.big.plus.icon').css({"display": "block"})
$('.ui.simple.dropdown.item').css({"display":"inherit"})
$('.ui.accordion').accordion();

//Three different modals, one for each type of phishing scam
$('.phishingLink').on('click', function(){
  if($(this).attr('phishingPostType') === "surveyScam"){
    $('#phishingModal1').modal('show');
  } else if ($(this).attr('phishingPostType') === "loginScam"){
    $('#phishingModal2').modal('show');
  } else if ($(this).attr('phishingPostType') === "creditCardScam"){
    $('#phishingModal3').modal('show');
  }
});

/**
 * chat box code
 */

$(window).on("load", function() {openChat()});

function openChat(){
  setTimeout(function(){
      $($('#chatbox1 .chat-history')[0]).slideToggle(300, 'swing');
      $($('#chatbox1 .chat-message')[0]).slideToggle(300, 'swing');
      $('#chatbox1').slideToggle(300, 'swing');
      $($('#chatbox1 .chat-history')[0]).slideToggle(300, 'swing');
      $($('#chatbox1 .chat-message')[0]).slideToggle(300, 'swing');

    }, 10000);

  setTimeout(function(){

      $($('#chatbox2 .chat-history')[0]).slideToggle(300, 'swing');
      $($('#chatbox2 .chat-message')[0]).slideToggle(300, 'swing');
      $('#chatbox2').slideToggle(300, 'swing');
      $($('#chatbox2 .chat-history')[0]).slideToggle(300, 'swing');
      $($('#chatbox2 .chat-message')[0]).slideToggle(300, 'swing');

    }, 20000);
}

/**
 * End chat box code
 */
