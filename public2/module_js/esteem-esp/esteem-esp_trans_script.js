const cdn = "https://dhpd030vnpk29.cloudfront.net";
let topicSelection = "";
let eventKeyword = "";
let bot1Image = "";
let bot1FullName = "";
let bot1FirstName = "";
let bot2Image = "";
let bot2FullName = "";
let bot2FirstName = "";

function startIntro(){

  switch (topicSelection) {
    case 'Deportes':
      eventKeyword = 'un partido de fútbol';
      bot1Image = 'user53.jpg';
      bot1FullName = "Belinda Fernandez";
      bot1FirstName = "Belinda";
      bot2Image = 'user4.jpg';
      bot2FullName = "Humberto Alvarez";
      bot2FirstName = "Humberto";
      break;
    case 'Música':
      eventKeyword = 'un campamento de música';
      bot1Image = 'user5.jpeg';
      bot1FullName = "Rosa Díaz";
      bot1FirstName = " Rosa";
      bot2Image = 'user10.jpg';
      bot2FullName = "Carlos Gonzalez";
      bot2FirstName = "Carlos";
      break;
    case 'Videojuegos':
      eventKeyword = 'el club de videojuegos';
      bot1Image = 'user30.jpg';
      bot1FullName = "Lourdes Sanchez";
      bot1FirstName = "Lourdes";
      bot2Image = 'user48.jpeg';
      bot2FullName = "Alejandro Martinez";
      bot2FirstName = "Alejandro";
      break;
    default:
      eventKeyword = 'un partido de fútbol';
      bot1Image = 'user30.jpg';
      bot1FullName = "Lourdes Sanchez";
      bot1FirstName = "Lourdes";
      bot2Image = 'user48.jpeg';
      bot2FullName = "Alejandro Martinez";
      bot2FirstName = "Alejandro";
      break;
  }

  var intro = introJs().setOptions({
    'hidePrev': true,
    'hideNext': true,
    'exitOnOverlayClick': false,
    'showStepNumbers':false,
    'showBullets':false,
    'scrollToElement':true,
    'doneLabel':'Listo &#10003',
    'tooltipClass':'blueTooltip'
  });

  intro.setOptions({
    steps: [
      {
        intro: `Ahora puedes explorar el feed del TestDrive. Puedes leer 
        lo que otros han publicado, responder o crear tus propias publicaciones.`
      },
      {
        intro: `Aquí hay un poco de información antes de empezar: Imagina que estás viendo el feed de la red social de 
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/user77.jpg'>
        Jorge García</span>`
      },
      {
        intro: `Jorge tiene dos amigos,
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot1Image}'>
        <span>${bot1FullName}</span></span> y
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot2Image}'>
        <span>${bot2FullName}</span></span> a quienes conoció en ${eventKeyword}.
        Busca las publicaciones de ${bot1FirstName} y ${bot2FirstName}.`
      },
      {
        intro: `También puedes ver las publicaciones de otros amigos que 
        han podido ocasionar la sensación de alerta roja en Jorge. Haz clic 
        en estas publicaciones para pensar en cómo Jorge se está sintiendo y 
        qué puede hacer al respecto.`
      }

    ]
  });

  intro.start().onexit(function() {
    window.location.href='/modual/esteem-esp';
  });
};

$(window).on("load", function(){
  $.get("/esteemTopic", function( data ) {
    topicSelection = data.esteemTopic;
  }).then(startIntro);
});
