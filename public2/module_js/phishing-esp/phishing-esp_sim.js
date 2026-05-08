var hintsList = [
  {
    hint: `Esta publicación es sospechosa porque tiene errores de ortografía y suena
    demasiado buena para ser verdad.`,
    element: '#hint1',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.3.5.2.mp3']
  },
  {
    hint: `Esta publicación tiene una URL acortada, que puede llevarte a un sitio peligroso.
    ¡No hagas clic en el enlace!`,
    element: '#hint2',
    hintPosition: 'middle-right',
    audioFile: ['CUSML.3.5.3.mp3']
  },
  {
    hint: `¡Cuidado con los estafadores que se hacen pasar por tus amigos!
    Puede que veas la foto de alguien que conoces, pero la publicación no
    es realmente suya.`,
    element: '#hint3',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.3.5.5.mp3']
  },
  {
    hint: `Si crees que la publicación es phishing, haz clic en el botón de reportar
    para denunciarla.`,
    element: '#hint4',
    hintPosition: 'middle-right',
    audioFile: ['CUSML.3.5.4.mp3']
  }
];

var stepsList = [
  {
    element: '#step0',
    intro: `¡Haz clic en "Siguiente" para comenzar!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step0',
    intro: `Haz clic en "Listo" y busca los puntos azules &nbsp;&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div
    class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; para aprender más...`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.3.5.1.mp3']
  }
];


function eventsAfterHints(){
  //activate the phishing links
  $("#shortenedURL1").on('click', function() {
    recordSimModalInputs('phishing_iPhoneModal');
  });
  $("#shortenedURL2").on('click', function() {
    recordSimModalInputs('phishing_ticketGiveawayModal');
  });
}

$('.ui.modal').modal({ closable: false });
