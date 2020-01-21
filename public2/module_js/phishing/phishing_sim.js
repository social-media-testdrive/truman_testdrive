function showModal(modal){
  $(modal).modal('show');
}

function startHints(){
  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: [
      {
        hint: 'Check the content of the post for signs of phishing scams. This one is suspicious because it has spelling errors and sounds too good to be true.',
        element: '#hint1',
        hintPosition: 'middle-middle'
      },
      {
        hint: 'This post has a shortened URL, which can lead to a risky website. Don’t click on the link!',
        element: '#hint2',
        hintPosition: 'middle-right'
      },
      {
        hint: "Watch out for scammers who are pretending to be your friend! You may see a photo of someone you know, but the post isn't really from them.",
        element: '#hint3',
        hintPosition: 'middle-middle'
      },
      {
        hint: "If you decide the post is a phishing scam, you can flag the post to report it.",
        element: '#hint4',
        hintPosition: 'middle-right'
      },
      {
        hint: "Let’s warn people that this post might be a phishing scam. Copy and paste the following comment: “This post looks suspicious! It might be a scam. Don’t click on the link!”",
        element: '#hint5',
        hintPosition: 'middle-middle'
      }
    ]
  });

  hints.addHints();
  clickCount = 0;
  //for providing guidance message
  hints.onhintclick(function() {
      clickCount++;
      if(clickCount > 5){
        //show the guidance message, user probably doesn't know to click "got it"
        if($('#removeHidden').is(":hidden")){
          $('#removeHidden').transition('fade');
        } else {
          $('#removeHidden').transition('bounce');
        }
      }
  });

  //activate the phishing links
  $("#shortenedURL1").on('click', function() {showModal('#phishingModal')});
  $("#shortenedURL2").on('click', function() {showModal('#phishingModal2')});


  hints.onhintclose(function() {
     counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
     }
     if(counter == 5) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
       }
       $( ".cybertrans" ).addClass("green");
     }
  });
};

function errorCheck(){
  if(counter != 5){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
};

function startIntro(){
  //global
  counter = 0;
  var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
  intro.setOptions({
    steps: [
      {
        element: document.querySelectorAll('#step0')[0],
        intro: "Click on the blue dots&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
        position: "right",
        scrollTo: 'tooltip'
      }

    ]
  });

  intro.start().onexit(function() {startHints()});
  $('#cyberTransButton').on('click', function() {errorCheck()});

};

$(window).on("load", function() {startIntro();});
