const hintsList = [
  {
    element: '.settingsButton',
    hint: `One way you can build a healthy habit is to turn off or reduce the
    number of notifications that you get. After you've clicked all the blue
    dots, click Settings on the notification window to see how you can do
    this.`,
    hintPosition: "middle-middle"
  },
  {
    element: '#hint2',
    hint: `Notifications can give you helpful information, but having too many
    can make you feel like you constantly need to check them.`,
    hintPosition: "top-middle"
  }
];

let literacy_counter = 0;

function customOnHintCloseFunction() {
  clickedHints = 0; //The user knows to click "got it"
  if($('#removeHidden').is(":visible")){
    $("#removeHidden").transition('fade');
  }
  literacy_counter++;
  if(literacy_counter == hintsList.length) {
    //hide the warning message if it's visible
    if($('#notificationWarning').is(":visible")){
      $('#notificationWarning').transition('fade');
    }

    //show the instructional message
    if($('#nextPageInstruction').is(":hidden")){
      $('#nextPageInstruction').transition('fade');
      //add margin to the bottom of the page
      $('#cyberTransButton').css('margin-bottom', '10em');
    }

    //enable the settings button
    $('.settingsButton').on('click', function(){
      window.location.href='/sim3/habits';
    });

    //do the glowing animation every 2 seconds
    function glowNotifications(){
      $('.settingsButton').transition('glow');
    }
    glowNotifications();
    setInterval(glowNotifications, 2000);
   }
};

function eventsAfterHints(){
  $('.settingsButton').on('click', function(){
    if(literacy_counter != hintsList.length){
      //show the message normally the first time
      if($('#notificationWarning').is(":hidden")){
        $('#notificationWarning').transition('fade');
        $("#cyberTransButton").css('margin-bottom', '10em');
      }else{
        //otherwise, bounce the message to draw attention to it
        $('#notificationWarning').transition('bounce');
      }
    }
  });
}
