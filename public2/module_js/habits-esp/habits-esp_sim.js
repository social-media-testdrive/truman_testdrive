const stepsList = [
  {
    element: '#step0',
    intro: `¡Haz clic en "Seguir" para comenzar!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step0',
    intro: `Es importante pensar en nuestras elecciones de redes sociales y hábitos 
    que se pueden formar al usarlas. Los buenos hábitos nos ayudan a construir vidas 
    saludables y felices. En cambio, los malos hábitos pueden complicarnos la vida.`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.10.4.01.mp3']
  },
  {
    element: '#step0',
    intro: `Aunque las aplicaciones tienen ciertas características que buscan captar 
    tu atención y mantenerte en ellas el mayor tiempo posible. Es importante que 
    pienses en cómo puedes formar buenos hábitos y tener el control en el uso de tus 
    redes sociales!`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.10.4.02.mp3']
  },
  {
    element: '#step0',
    intro: `Vamos a aprender algunas estrategias para crear hábitos saludables en las redes sociales.
    Haz clic en \"Listo\" y revisa los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'>
    <div class='introjs-hint-dot'></div>
    <div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; para aprender más...`,
    position: "right",
    scrollTo: 'tooltip',
    audioFile: ['CUSML.10.4.03.mp3']
  }
];

const hintsList = [
  {
    element: '#hint1',
    hint: `Este es el feed de una red social. Recibirás notificaciones cuando tus 
    amigos le den “me gusta” o comenten tus publicaciones.`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.04.mp3']
  },
  {
    element: '#hint2',
    hint: `¡Una vez le hayas dado clic a todos los puntos azules, dale clic a la 
    pestaña de notificaciones para ver qué notificaciones has recibido!`,
    hintPosition: "middle-middle",
    audioFile: ['CUSML.10.4.05.mp3']
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
      $('#addBottomMargin').css('margin-bottom', '10em');
    }

   //enable the notifications button
   $('a.item[data-value="notifications"]').on('click', function(){
     window.location.href='/sim2/habits';
   });

   function glowNotifications(){
     $('a.item[data-value="notifications"]').transition('glow');
   }
   glowNotifications();
   setInterval(glowNotifications, 2000);

  }
};

function eventsAfterHints() {
  $('a.item[data-value="notifications"]').on('click', function(){
     if(literacy_counter != 2){
       //show the message normally the first time
       if($('#notificationWarning').is(":hidden")){
         $('#notificationWarning').transition('fade');
         $('#addBottomMargin').css('margin-bottom', '10em');
       }else{
         //otherwise, bounce the message to draw attention to it
         $('#notificationWarning').transition('bounce');
       }
     }
   });
}
