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
    topicSelection = data.esteemTopic;
    switch (topicSelection) {
      case 'Deportes':
        eventKeyword = 'un partido de fútbol';
        bot1Image = 'user53.jpg';
        bot1FullName = "Belinda Fernandez";
        bot1FirstName = "Belinda";
        bot2Image = 'user4.jpg';
        bot2FullName = "Humberto Alvarez";
        bot2FirstName = "Humberto";
        // customAudioFile = ["CUSML.1.7.3.mp3"];
        break;
      case 'Música':
        eventKeyword = 'un campamento de música';
        bot1Image = 'user5.jpeg';
        bot1FullName = "Rosa Díaz";
        bot1FirstName = " Rosa";
        bot2Image = 'user10.jpg';
        bot2FullName = "Carlos Gonzalez";
        bot2FirstName = "Carlos";
        // customAudioFile = ["CUSML.1.6.3.mp3"];
        break;
      case 'Videojuegos':
        eventKeyword = 'el club de videojuegos';
        bot1Image = 'user30.jpg';
        bot1FullName = "Lourdes Sanchez";
        bot1FirstName = "Lourdes";
        bot2Image = 'user48.jpeg';
        bot2FullName = "Alejandro Martinez";
        bot2FirstName = "Alejandro";
        // customAudioFile = ["CUSML.1.8.3.mp3"];
        break;
      default:
        eventKeyword = 'un partido de fútbol';
        bot1Image = 'user30.jpg';
        bot1FullName = "Lourdes Sanchez";
        bot1FirstName = "Lourdes";
        bot2Image = 'user48.jpeg';
        bot2FullName = "Alejandro Martinez";
        bot2FirstName = "Alejandro";
        // customAudioFile = ["CUSML.1.8.3.mp3"];
        break;
    }

    stepsList = [
      {
        intro: `¡Haz clic en "Seguir" para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        audioFile: ['']
      },
      {
        intro: `Ahora puedes explorar el feed del TestDrive. Puedes leer lo que otros han publicado, responder o crear tus propias publicaciones.`,
        // audioFile: ['CUSML.1.6.1.mp3']
      },
      {
        intro: `Aquí hay un poco de información antes de empezar: Imagina que estás viendo el feed de la red social de <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/user77.jpg'>Jorge García</span>`,
        // audioFile: ['CUSML.1.6.2.mp3']
      },
      {
        intro: `Jorge tiene dos amigos,
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot1Image}'>
        <span>${bot1FullName}</span></span> y
        <span class='noLineBreak'><img class='ui avatar image customCircularAvatar' src='${cdn}/profile_pictures/${bot2Image}'>
        <span>${bot2FullName}</span></span> a quienes conoció en ${eventKeyword}.
        Busca las publicaciones de ${bot1FirstName} y ${bot2FirstName}.`,
        // audioFile: [`${customAudioFile}`]
      },
      {
        intro: `También puedes ver las publicaciones de otros amigos que han podido ocasionar la sensación de alerta roja en Jorge. Haz clic en estas publicaciones para pensar en cómo Jorge se está sintiendo y qué puede hacer al respecto.`,
        // audioFile: ['CUSML.1.6.4.mp3']
      }
    ];

    startIntro(enableDataCollection);

  });
}
