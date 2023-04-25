const hintsList = [
  {
    element: '.settingsButton',
    hint: `Una manera de crear hábitos saludables es desactivando o reduciendo 
    el número de notificaciones que recibes. Después de darle clic a todos 
    los puntos azules, haz clic en "Ajustes" en la pestaña de notificaciones 
    para ver cómo puedes hacerlo .`,
    hintPosition: "middle-middle",
    hintButtonLabel: 'Entiendo',
    // audioFile: ['CUSML.10.4.06.mp3']
  },
  {
    element: '#hint2',
    hint: `Las notificaciones pueden darte información importante, pero tener 
    demasiadas pueden hacer que sientas la necesidad de revisarlas constantemente.`,
    hintPosition: "top-middle",
    hintButtonLabel: 'Entiendo',
    // audioFile: ['CUSML.10.4.07.mp3']
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
      window.location.href='/sim3/habits-esp';
    });

    //do the glowing animation every 2 seconds
    function glowNotifications(){
      $('.settingsButton').closest('.item').transition('glow');
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
