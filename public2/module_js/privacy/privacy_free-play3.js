var literacy_counter = 0;
clickCount = 0;
 function startIntro(){
     var hints;

     hints = introJs().addHints();

     hints.onhintclick(function() {
         clickCount++;
         if(clickCount >= 3){
           //show the guidance message, user probably doesn't know to click "got it"
           if($('#removeHidden').is(":hidden")){
             $('#removeHidden').transition('fade');
             $('#privacyresults').css("margin-bottom", "10em");
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
          $('#privacyresults').css("margin-bottom", "4em");
        }
      }
      if(literacy_counter == 3) {
        if($('#clickAllDotsWarning').is(':visible')){
          $('#clickAllDotsWarning').transition('fade');
          $('#cyberTransButton').css("margin-bottom", "4em");
        }
        $( ".privacyresults" ).addClass("green");
      }
     });


   };

   $('#privacyresults').on('click', function () {
     if(literacy_counter != 3){
       //show the message normally the first time
       if($('#clickAllDotsWarning').is(":hidden")){
         $('#clickAllDotsWarning').transition('fade');
         $('#privacyresults').css("margin-bottom", "10em");
       }else{
         //otherwise, bounce the message to draw attention to it
         $('#clickAllDotsWarning').transition('bounce');
       }
     }
   });

   //showing the "Need some help?" guidance message after a total of 2 minutes
   setInterval(function(){
     if($('#removeHidden').is(":hidden")){
       if(literacy_counter != 3){
         //user does not know to click blue dots
         $('#removeHidden').transition('fade');
         $('#privacyresults').css('margin-bottom', '10em');
       }
     }
   },120000);

 $(window).on("load", function() {startIntro();});
