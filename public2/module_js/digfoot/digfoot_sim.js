let clickCount = 0;
let counter = 0;
const numberOfHints = 5;

function openPostDigfootSim(){
  $('input[type=checkbox]').prop('checked',false);
  $('#digfoot_sim_modal').modal('show');
};

//showing the "Need some help?" guidance message
function showHelp(){
  if($('#removeHidden').is(":hidden")){
    if(counter != numberOfHints){
      //user does not know to click blue dots
      $('#removeHidden').transition('fade');
      $('#cyberTransButton').css('margin-bottom', '10em');
    }
  }
};

function errorCheck(){
  if(counter != numberOfHints){
    //show the message normally the first time
    if($('#clickAllDotsWarning').is(":hidden")){
      $('#clickAllDotsWarning').transition('fade');
      $('#cyberTransButton').css("margin-bottom", "10em");
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#clickAllDotsWarning').transition('bounce');
    }
  }
};

function startHints(){
  window.scrollTo(0,0);

  var hints = introJs().setOptions({
    hints: [
      {
        hint: `How can you have a positive impact on your digital footprint?
        You can post things related to your hobbies, your school activities, or
        any other interests!`,
        element: '#hint1'
      },
      {
        hint: `Read this post and then click on it to think more about how a
        post like this impacts someone’s digital footprint.`,
        element: '#hint2',
        hintPosition: 'bottom-right'
      },
      {
        hint: `Read this post and then click on it to think more about how a
        post like this impacts someone’s digital footprint.`,
        element: '#hint3',
        hintPosition: 'middle-middle'
      },
      {
        hint: `Remember, your digital footprint can affect your reputation
        online and offline! Think about who can see your post and how they might
        view you as a result.`,
        element: '#hint4',
        hintPosition: 'middle-middle'
      },
      {
        hint: `If someone posts something you don’t want to have as part of your
        digital footprint, you can ask them to delete it through a private
        message.`,
        element: '#hint5',
        hintPosition: 'bottom-right'
      }
    ]
  });

  hints.addHints();

  //for providing guidance message
  hints.onhintclick(function() {
      clickCount++;
      if(clickCount >= numberOfHints){
        //show the guidance message, user probably doesn't know to click "got it"
        if($('#removeHidden').is(":hidden")){
          $('#removeHidden').transition('fade');
          $('#cyberTransButton').css('margin-bottom', '10em');
        } else {
          $('#removeHidden').transition('bounce');
        }
      }
  });

  hints.onhintclose(function() {
     counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
       if($('#clickAllDotsWarning').is(":hidden")){
         $('#cyberTransButton').css("margin-bottom", "4em");
       }
     }
     if(counter == numberOfHints) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#cyberTransButton').css("margin-bottom", "4em");
       }
       $( ".cybertrans" ).addClass("green");
     }
  });

  setInterval(showHelp, 120000);

};

function startIntro(){
    var intro = introJs().setOptions({
      'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false,
      'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true,
      'doneLabel':'Done &#10003' });
    intro.setOptions({
      steps: [
        {
          element: document.querySelectorAll('#step1')[0],
          intro: `Click on the blue dots&nbsp;<a role='button' tabindex='0'
          class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
          'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...`,
          position: "left",
          scrollTo: 'tooltip'
        }

      ]
    });

    intro.start().onexit(startHints);
    $('#cyberTransButton').on('click', errorCheck);

  };

  $(window).on("load", startIntro);
