function openPhishingModal(phishingLink){
  if(phishingLink.attr('phishingPostType') === "surveyScam"){
    $('#phishingModal1').modal('show');
  } else if (phishingLink.attr('phishingPostType') === "loginScam"){
    $('#phishingModal2').modal('show');
  } else if (phishingLink.attr('phishingPostType') === "creditCardScam"){
    $('#phishingModal3').modal('show');
  }
}

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


//Misc code
$('.big.plus.icon').css({"display": "block"})
$('.ui.simple.dropdown.item').css({"display":"inherit"})

//Open the corresponding phishing modal when a phishing link is clicked
$('.phishingLink').on('click', function () { openPhishingModal($(this)) });

//Chat box
$(window).on("load", function() {openChat()});
