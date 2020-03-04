var counter = 0;
var clickCount = 0;
function startIntro(){
    var hints;

    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':true, 'doneLabel':'Done &#10003' });
      intro.setOptions({
        steps: [
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "Now that you have learned about different privacy settings, let’s practice how to change them!",
            scrollTo:'tooltip',
            position:'left'
          },
          {
            element: document.querySelectorAll('#step1')[0],
            intro: "Click on the blue dots &nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp;to learn more...",
            scrollTo:'tooltip',
            position:'left'
          }

        ]
      });
    intro.start().onexit(function() {

      hints = introJs().addHints();

      hints.onhintclick(function() {
          clickCount++;
          if(clickCount > 4){
            //show the guidance message, user probably doesn't know to click "got it"
            if($('#removeHidden').is(":hidden")){
              $('#removeHidden').transition('fade');
              $('#privacytrans2').css("margin-bottom", "10em");
            } else {
              $('#removeHidden').transition('bounce');
            }
          }
      });

      hints.onhintclose(function(e) {
       counter++;
       clickCount = 0;
       if($('#removeHidden').is(":visible")){
         $('#removeHidden').transition('fade');
         if($('#clickAllDotsWarning').is(":hidden")){
           $('#privacytrans2').css("margin-bottom", "4em");
         }
       }
       if(counter == 5) {
         if($('#clickAllDotsWarning').is(':visible')){
           $('#clickAllDotsWarning').transition('fade');
           $('#privacytrans2').css("margin-bottom", "4em");
         }
         $( ".privacytrans2" ).addClass("green");
       }
      });

      //error messaging
      $('#privacytrans2').on('click', function() {
        if(counter != 5){
          //show the message normally the first time
          if($('#clickAllDotsWarning').is(":hidden")){
            $('#clickAllDotsWarning').transition('fade');
            $('#privacytrans2').css("margin-bottom", "10em");
          }else{
            //otherwise, bounce the message to draw attention to it
            $('#clickAllDotsWarning').transition('bounce');
          }
        }
      });

      //showing the "Need some help?" guidance message after a total of 2 minutes
      setInterval(function(){
        if($('#removeHidden').is(":hidden")){
          if(counter != 5){
            //user does not know to click blue dots
            $('#removeHidden').transition('fade');
            $('#privacytrans2').css('margin-bottom', '10em');
          }
        }
      },120000);


    });

  };

  /*$('#privacytrans2').on('click', function () {
    if(counter != 5){
      $('#clickAllDotsSim').show();
    }
  });*/

  $(window).on("load", function() {startIntro();});

$('.ui.dropdown')
  .dropdown('set selected', '0');
