const nextPageURL = 'modual';
const stepsList = [
  {
    intro: `¡Dale clic a “Siguiente” para comenzar!`,
    // audioFile: ['']
  },
  {
    intro: `¡Ahora puedes explorar el feed del TestDrive! Puedes leer lo 
    que otros han publicado, responder o crear tus propias publicaciones.`,
    // audioFile: ['CUSML.10.5.4.mp3']
  },
  {
    intro: `Mientras ves este feed, intenta encontrar si hay algo que te 
    llama la atención y piensa en lo que puedes hacer para construir hábitos 
    saludables en las redes sociales.`,
    // audioFile: ['CUSML.10.5.5.mp3']
  }
];

function additionalOnBeforeExit() {
  freePlayPageViewTimer = Date.now();
  //record this date as the start of the habits timeline
  const jqhxr = $.post("/habitsTimer", {
    habitsStart: freePlayPageViewTimer,
    _csrf : $('meta[name="csrf-token"]').attr('content')
  });
  jqhxrArray.push(jqhxr);
}
