const nextPageURL = 'tut_guide';

const stepsList = [
  {
    element: '#step1A',
    intro: `¡Dale clic a “Siguiente” para comenzar!`,
    position: 'left',
    scrollTo: 'tooltip',
    // audioFile: ['']
  },
  {
    element: '#step1A',
    intro: `Las fake news utilizan <b>titulares e imágenes impactantes y exagerados</b> para que hagas clic en ellos. A menudo, el titular intentará despertar tu curiosidad y atraerte como cebo para que hagas clic en él.`,
    position: 'left',
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.5.4.1.mp3']
  },
  {
    element: '.post',
    intro: `¿El artículo <b>utiliza imágenes atrevidas o sensacionalistas</b> que intentan hacerte sentir una emoción fuerte? <br>Esta es otra estrategia de los <b>artículos clickbait.</b>`,
    position: 'left',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.5.4.2.mp3']
  },
  {
    element: '#step3',
    intro: `Si encuentras direcciones <b>uweb o nombres de sitios inusuales</b>, incluidos aquellos que terminan en ".com.co", esto es una señal de fake news. Estos sitios pueden parecer sitios web de noticias reales, pero la mayoría de las veces no lo son.`,
    position: 'bottom',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.5.4.3.mp3']
  },
  {
    element: '#step1',
    intro: `¿Hay muchos errores de ortografía, muchas MAYÚSCULAS o puntuación exagerada? Todos estos son signos de que el artículo puede <b>no ser creíble.</b>`,
    position: 'bottom',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.5.4.4.mp3']
  }
];
