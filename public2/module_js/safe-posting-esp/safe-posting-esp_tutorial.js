const nextPageURL = 'tut_guide';

const stepsList = [
  {
    element: '#step1',
    intro: `¡Haz clic en "Siguiente" para comenzar!`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step1',
    intro: `Antes de hablar con alguien por internet, pregúntate:
    <br>«<i>¿Conozco a esta persona fuera de la red? ¿Nos hemos visto cara a cara?</i>»<br>
    Si la respuesta es «<i>No</i>» a cualquiera de las dos, ten cuidado con lo que compartes.`,
    position: 'left',
    highlightClass: 'helperHelper',
    audioFile: ['CUSML.11.3.1.mp3']
  },
  {
    element: '#step2',
    intro: `Si alguien que no conoces pide información privada o presiona para que cuentes cosas personales,
    tienes algunas estrategias para responder.`,
    position: 'top',
    highlightClass: 'helperHelper',
    audioFile: ['CUSML.11.3.2.mp3']

  },
  {
    element: '#step2',
    intro: `Puedes cambiar de tema o decir:
    <br><i>«No quiero hablar de esto.»</i>`,
    position: 'top',
    highlightClass: 'helperHelper',
    audioFile: ['CUSML.11.3.3.mp3']
  },
  {
    element: '#step2',
    intro: `Puedes usar el humor para cambiar la conversación. Por ejemplo,
    <br><i>«¿Tantas preguntas? ¡Jaja, pareces mi tía entrometida!»</i>`,
    position: 'top',
    highlightClass: 'helperHelper',
    scrollTo: 'element',
    audioFile: ['CUSML.11.3.4.mp3']
  },
  {
    element: '#step1',
    intro: `Pide consejo u ayuda a un adulto de confianza si te sientes inseguro o incómodo en alguna situación.`,
    position: 'right',
    scrollTo: 'element',
    audioFile: ['CUSML.11.3.5.mp3']
  },
  {
    element: '#step1',
    intro: `Recuerda: no tienes que compartir nada aunque te presionen. No está bien que alguien te presione:
    así no es ser buen amigo.`,
    position: 'right',
    audioFile: ['CUSML.11.3.6.mp3']
  }
];
