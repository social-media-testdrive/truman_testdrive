var literacy_counter = 0;
clickCount = 0;

function startIntro(){
    var hints;

    hints = introJs().addHints();

    hints.onhintclick(function() {
        clickCount++;
        if(clickCount > 2){
          //show the guidance message, user probably doesn't know to click "got it"
          if($('#removeHidden').is(":hidden")){
            $('#removeHidden').transition('fade');
            $('#settings2').css("margin-bottom", "10em");
          } else {
            $('#removeHidden').transition('bounce');
          }
        }
    });

    hints.onhintclose(function(e) {
     literacy_counter++;
     clickCount = 0;
     if($('#removeHidden').is(":visible")){
       $('#removeHidden').transition('fade');
       if($('#clickAllDotsWarning').is(":hidden")){
         $('#settings2').css("margin-bottom", "4em");
       }
     }
     if(literacy_counter == 2) {
       if($('#clickAllDotsWarning').is(':visible')){
         $('#clickAllDotsWarning').transition('fade');
         $('#settings2').css("margin-bottom", "4em");
       }
       $( ".settings2" ).addClass("green");
     }
    });


  };

  $('#settings2').on('click', function () {
    if(literacy_counter != 2){
      //show the message normally the first time
      if($('#clickAllDotsWarning').is(":hidden")){
        $('#clickAllDotsWarning').transition('fade');
        $('#settings2').css("margin-bottom", "10em");
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#clickAllDotsWarning').transition('bounce');
      }
    }
  });

  //showing the "Need some help?" guidance message after a total of 40 seconds per blue dot
  setInterval(function(){
    if($('#removeHidden').is(":hidden")){
      if(literacy_counter != 2){
        //user does not know to click blue dots
        $('#removeHidden').transition('fade');
        $('#settings2').css('margin-bottom', '10em');
      }
    }
  },80000);

$(window).on("load", function() {startIntro();});
