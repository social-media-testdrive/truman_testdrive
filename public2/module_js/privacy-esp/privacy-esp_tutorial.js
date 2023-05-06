const nextPageURL = 'sim';

const stepsList = [
  {
    element: '#step1',
    intro: `Dale clic en "Siguiente" para empezar.`,
    position: 'left',
    scrollTo: 'tooltip',
    // audioFile: ['']
  },
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `Cuando te crees una cuenta en alguna red social, asegúrate de 
    revisar <b>la configuración de la privacidad</b>. Puedes controlar qué información 
    pueden ver las otras personas. Además, puedes revisar esta sección para 
    cambiar la configuración en cualquier momento.`,
    position: 'left',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.7.5.1.mp3']
  },
  {
    element: document.querySelectorAll('#step2')[0],
    intro: `La opción de "<i>Público</i>" significa que tu cuenta será visible para cualquier 
    persona en Internet. En cambio, la opción de "<i>Privado</i>" restringe el acceso a tu 
    cuenta y  solo las personas que autorices podrán ver tus publicaciones.`,
    position: 'left',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.7.5.2.mp3']
  },
  {
    element: document.querySelectorAll('#step3')[0],
    intro: `Algunas páginas de redes sociales te permiten elegir quién puede contactarte. 
    Puedes cambiar quién puede agregarte como amigo, comentar tus publicaciones o etiquetarte 
    en alguna publicación.`,
    position: 'left',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.7.5.3.mp3']
  },
  {
    element: document.querySelectorAll('#tagStep')[0],
    intro: `Cambiar esta configuración evitará que las personas puedan "<i>etiquetarte</i>" en 
    publicaciones que no hiciste. De esta forma, vas a poder controlar qué publicaciones 
    aparecen en tu perfil.`,
    position: 'left',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.7.5.4.mp3']
  },
  {
    element: document.querySelectorAll('#step4')[0],
    intro: `Aquí puedes cambiar la forma en la que compartes la información de tu ubicación. 
    Puedes elegir eliminarlo por completo u ocultarlo de ciertas personas.`,
    position: 'right',
    scrollTo: "tooltip",
    // audioFile: ['CUSML.7.5.5.mp3']
  }
];

$('.ui.dropdown')
  .dropdown('set selected', '0');
