var literacy_counter = 0;
clickCount = 0;

  //taken from old code, no lazy loading considerations
  function startIntro(){
    var hints;

    hints = introJs().addHints();

    hints.onhintclick(function() {
        clickCount++;
        if(clickCount >= 4){
          //show the guidance message, user probably doesn't know to click "got it"
          if($('#removeHidden').is(":hidden")){
            $('#removeHidden').transition('fade');
            $('#setting3').css("margin-bottom", "10em");
          } else {
            $('#removeHidden').transition('bounce');
          }
        }
    });

    hints.onhintclose(function() {
     literacy_counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
       if($('#clickAllDotsWarning').is(":hidden")){
         $('#settings3').css("margin-bottom", "4em");
       }
     }
     if(literacy_counter == 4) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#settings3').css("margin-bottom", "4em");
       }
       $( ".settings3" ).addClass("green");
     }
    });


  };

  $('#settings3').on('click', function () {
    if(literacy_counter != 4){
      //show the message normally the first time
      if($('#clickAllDotsWarning').is(":hidden")){
        $('#clickAllDotsWarning').transition('fade');
        $('#settings3').css("margin-bottom", "10em");
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#clickAllDotsWarning').transition('bounce');
      }
    }
  });

  //showing the "Need some help?" guidance message after a total of 2 minutes
  setInterval(function(){
    if($('#removeHidden').is(":hidden")){
      if(literacy_counter != 4){
        //user does not know to click blue dots
        $('#removeHidden').transition('fade');
        $('#settings3').css('margin-bottom', '10em');
      }
    }
  },120000);

  $(window).on("load", function() {
    startIntro();
  });
