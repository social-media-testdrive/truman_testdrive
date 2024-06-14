const cdn = "https://dhpd030vnpk29.cloudfront.net";
let topicSelection = "";
let eventKeyword = "";
let bot1Image = "";
let bot1FullName = "";
let bot1FirstName = "";
let bot2Image = "";
let bot2FullName = "";
let bot2FirstName = "";

const nextPageURL = 'modual';
let stepsList;

function customOnWindowLoad(enableDataCollection){
  $.get("/esteemTopic").then(function(data){
    console.log('all data = ' + data);
    topicSelection = data.esteemTopic;
    console.log('selected topic = ' + topicSelection);
    switch (topicSelection) {
      case 'Deportes':
        eventKeyword = 'un partido de fútbol';
        bot1Image = 'user53.jpg';
        bot1FullName = "Sofia Pinedo";
        bot1FirstName = "Sofia";
        bot2Image = 'user4.jpg';
        bot2FullName = "María Cristina Rodríguez";
        bot2FirstName = "María";
        customAudioFile = [""];
        break;
      case 'Música':
        eventKeyword = 'un campamento de música';
        bot1Image = 'user5.jpeg';
        bot1FullName = "Ana Pereira";
        bot1FirstName = "Ana";
        bot2Image = 'user10.jpg';
        bot2FullName = "Alonso Contreras";
        bot2FirstName = "Alonso";
        customAudioFile = [""];
        break;
      case 'Videojuegos':
        eventKeyword = 'un grupo de discord';
        bot1Image = 'user30.jpg';
        bot1FullName = "Lilian Ureña";
        bot1FirstName = "Lilian";
        bot2Image = 'user48.jpeg';
        bot2FullName = "Alejandro Martinez";
        bot2FirstName = "Alejandro";
        customAudioFile = [""];
        break;
      default:
        eventKeyword = 'un partido de fútbol';
        bot1Image = 'user30.jpg';
        bot1FullName = "Lilian Ureña";
        bot1FirstName = "Lilian";
        bot2Image = 'user48.jpeg';
        bot2FullName = "Alejandro Martinez";
        bot2FirstName = "Alejandro";
        customAudioFile = [""];
        break;
    }

    stepsList = [
      {
        intro: `¡Dale clic a “Siguiente” para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        audioFile: ['']
      },
      {
        intro: `Ahora puedes explorar el feed del TestDrive. Puedes leer lo que otros han publicado, responder o crear tus propias publicaciones.`,
        audioFile: ['']
      },
      {
        intro: `Aquí hay un poco de información antes de empezar: Imagina que estás viendo el feed de la red social de <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/user77.jpg'>Jeremy Franco</span>`,
        audioFile: ['']
      },
      {
        intro: `Jeremy tiene dos amigas,
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot1Image}'>
        <span>${bot1FullName}</span></span> y
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot2Image}'>
        <span>${bot2FullName}</span></span> a quienes conoció en ${eventKeyword}.
        Busca las publicaciones de ${bot1FirstName} y ${bot2FirstName}.`,
        audioFile: [``]
      },
      {
        intro: `También puedes ver las publicaciones de otros amigos que han podido ocasionar la sensación de alerta roja en Jeremy. Haz clic en estas publicaciones para pensar en cómo Jeremy se está sintiendo y qué puede hacer al respecto.`,
        audioFile: ['']
      }
    ];

    startIntro(enableDataCollection);
  });
}
