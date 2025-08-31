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
    intro: `Antes de hablar con alguien en línea, pregúntate:
    <br>"<i>¿Conozco a esta persona fuera de línea? ¿Nos hemos visto cara a cara?</i>"<br>
    Si la respuesta es "<i>No</i>" a cualquiera de las dos, ten cuidado con lo que compartes.`,
    position: 'left',
    highlightClass:"helperHelper",
    audioFile: ['CUSML.11.3.1.mp3']
  },
  {
    element: '#step2',
    intro: `Si alguien que no conoces te pide información privada o te presiona
    para compartir cosas personales, hay algunas estrategias que puedes usar para responder.`,
    position: 'top',
    highlightClass:"helperHelper",
    audioFile: ['CUSML.11.3.2.mp3']

  },
  {
    element: '#step2',
    intro: `Puedes cambiar de tema o decir:
    <br><i>"No quiero hablar sobre esto."</i>`,
    position: 'top',
    highlightClass:"helperHelper",
    audioFile: ['CUSML.11.3.3.mp3']
  },
  {
    element: '#step2',
    intro: `Puedes usar el humor para cambiar la conversación. Por ejemplo,
    <br><i>"¿Por qué haces tantas preguntas?! Jaja suenas como mi tía entrometida."</i>`,
    position: 'top',
    highlightClass:"helperHelper",
    scrollTo:'element',
    audioFile: ['CUSML.11.3.4.mp3']
  },
  {
    element: '#step1',
    intro: `Pide consejo o ayuda a un adulto de confianza si te sientes inseguro o
    incómodo en cualquier situación.`,
    position: 'right',
    scrollTo:'element',
    audioFile: ['CUSML.11.3.5.mp3']
  },
  {
    element: '#step1',
    intro: `Ten en cuenta que no tienes que compartir nada, ¡incluso si te presionan!
    No está bien que alguien te presione, y eso no es ser un buen amigo.`,
    position: 'right',
    audioFile: ['CUSML.11.3.6.mp3']
  }
];
