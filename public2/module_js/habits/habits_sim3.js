//activating a normal dropdown (the one used in the habits module settings)
$('.ui.selection.dropdown').dropdown('set selected', '1 hour');

//hiding the pause time select unless pause is turned on (in notification settings)
 $(".ui.toggle.checkbox[name='popupAlertsCheckbox']").change(function() {
   console.log("CHANGE");
   if($("input[name='popupAlerts']").is(":checked")){
     $('#pauseTimeSelectField').show();
   } else {
     $('#pauseTimeSelectField').hide();
   }
 });

var literacy_counter = 0;

function startIntro(){
  var hints = introJs().addHints()
  var clickCount = 0;

  //for providing guidance message
  hints.onhintclick(function(hintElement, item, stepId) {
      //console.log('hint clicked', hintElement, item, stepId);
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

  $('#activityButton').on('click', function(){
    if(literacy_counter != 2){
      //show the message normall the first time
      if($('#notificationWarning').is(":hidden")){
        $('#notificationWarning').transition('fade');
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#notificationWarning').transition('bounce');
      }
    }
  });

  hints.onhintclose(function(e) {
    clickCount = 0; //The user knows to click "got it"
    if($('#removeHidden').is(":visible")){
      $("#removeHidden").transition('fade');
    }
    literacy_counter++;
    if(literacy_counter == 2) {
      //hide the warning message if it's visible
      if($('#notificationWarning').is(":visible")){
        $('#notificationWarning').transition('fade');
      }

      //show the instructional message
      if($('#nextPageInstruction').is(":hidden")){
        $('#nextPageInstruction').transition('fade');
        //add margin to the bottom of the page
        $('#addBottomMargin').css('margin-bottom', '20em')
      }

      //enable the activity button
      $('#activityButton').on('click', function(){
        window.location.href='/sim4/habits';
      });

      //do the glowing animation every 2 seconds
      function glowNotifications(){
        $('#activityButton').transition('glow');
      }
      glowNotifications();
      setInterval(glowNotifications, 2000);
    }
  });

  //showing the "Need some help?" guidance message after 40 seconds per blue dot (assuming the user doesn't know to click "Got it")
  setTimeout(function(){
    if($('#removeHidden').is(":hidden")){
      if(literacy_counter != 2){
        //user does not know to click blue dots
        $('#removeHidden').transition('fade');
      }
    }
  },80000);
};


$(window).on("load", function() {
  startIntro();
});
