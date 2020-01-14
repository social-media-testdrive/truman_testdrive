function startIntro(){

  var hints;
  var counter = 0;
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
    intro.start().onexit(function() {
      window.scrollTo(0,0);
      hints = introJs().addHints();
      console.log('hints added')

      //activate the links
      $("#shortenedURL1").on('click', function(){
        $('#phishingModal').modal('show');
      });

      $("#shortenedURL2").on('click', function(){
        $('#phishingModal2').modal('show');
      });


      hints.onhintclose(function(e) {
       counter++;
       if(counter == 5) {
         $('#clickAllDotsWarning').hide();
         $( ".cybertrans" ).addClass("green");
       }
    });
  });


  //error messaging
  $('#cyberTransButton').on('click', function() {
    if(counter != 5){
      $('#clickAllDotsWarning').show();
    }
  });

};

$(window).on("load", function() {startIntro();});
