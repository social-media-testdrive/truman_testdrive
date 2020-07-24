const hintsList = [
  {
    element: '#hint1',
    hint: `Most social media sites have settings that you can use to control the
    number of notifications you get. It will look similar to this page.`,
    hintPosition: "middle-middle"
  },
  {
    element: '#hint2',
    hint: `Here, you can change the number of notifications you get for
    different types of content. Try pausing notifications for a while by turning
    this setting on.`,
    hintPosition: "middle-middle"
  }
];

let literacy_counter = 0;

function customOnHintCloseFunction() {
 clickedHints = 0; //The user knows to click "got it"
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
     $('#activityButton').closest('.item').transition('glow');
   }
   glowNotifications();
   setInterval(glowNotifications, 2000);
 }
};


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

$('#activityButton').on('click', function(){
  if(literacy_counter != 2){
    //show the message normally the first time
    if($('#notificationWarning').is(":hidden")){
      $('#notificationWarning').transition('fade');
      $("#addBottomMargin").css('margin-bottom', '20em');
    }else{
      //otherwise, bounce the message to draw attention to it
      $('#notificationWarning').transition('bounce');
    }
  }
});
