const nextPageURL = 'tut_guide';

const stepsList = [
  {
    element: '#step1',
    intro: `¡Haz clic en "Siguiente" para comenzar!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step1',
    intro: `A veces, los anuncios y las publicaciones patrocinadas pueden parecerse
    mucho a otras publicaciones o artículos en las redes sociales.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.1.mp3']
  },
  {
    element: '#step1',
    intro: `Aquí tienes algunos consejos que pueden ayudarte a saber si una publicación
    es un anuncio o no.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.2.mp3']
  },
  {
    element: '#sponsoredTag',
    intro: `Busca las palabras “<i>ANUNCIO</i>”, “<i>Publicidad</i>”,
    “<i>Promocionado</i>” o “<i>Patrocinado</i>” arriba o abajo de una publicación.
    ¡Los anuncios también pueden llevar una etiqueta con el símbolo # y esas mismas palabras!`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.3.mp3']
  },
  {
    element: '#poster',
    intro: `También puede que notes que la publicación es de alguien a quien no conoces
    y no tienes como amigo en las redes sociales, aunque un amigo tuyo le haya dado me
    gusta o la haya comentado.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.4.mp3']
  },
  {
    element: '#item1',
    intro: `¿Qué puedes hacer si detectas un anuncio?`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.5.mp3']
  },
  {
    element: '#item2',
    intro: `Si el anuncio no es relevante para ti o no quieres volver a verlo, puedes
    hacer clic en “<i>Ocultar anuncio</i>” para quitar el anuncio de tu línea de tiempo.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.6.mp3']
  },
  {
    element: '#item2',
    intro: `Si el anuncio es ofensivo o inapropiado, puedes hacer clic en
    “<i>Reportar anuncio</i>” para reportarlo en el sitio web.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.7.mp3']
  },
  {
    element: '#item2',
    intro: `Puedes hacer clic en “¿<i>Por qué veo este anuncio?</i>” para saber más sobre
    por qué el sitio decidió mostrártelo.`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.8.mp3']
  },
  {
    element: '#step1',
    intro: `¡Recuerda que siempre puedes ignorar el anuncio, ocultarlo o cambiar tus
    ajustes para no verlos!`,
    position: 'right',
    scrollTo: 'tooltip',
    audioFile: ['CUSML.2.3.9.mp3']
  }
];

function additionalOnBeforeChange(jqThis) {
  if ((jqThis[0]._currentStep >= 6) && (jqThis[0]._currentStep < 9)) {
    $('.ui.dropdown.icon.item').dropdown({
      duration: 0
    });
    $('.ui.dropdown.icon.item').dropdown('show');
    if (jqThis[0]._currentStep === 6) {
      $('.ui.dropdown.icon.item')
        .dropdown('set selected', '0');
    } else if (jqThis[0]._currentStep === 7) {
      $('.ui.dropdown.icon.item')
        .dropdown('set selected', '1');
    } else if (jqThis[0]._currentStep === 8) {
      $('.ui.dropdown.icon.item')
        .dropdown('set selected', '2');
    } else {
      $('.ui.dropdown.icon.item')
        .dropdown('clear');
    }
    intro.refresh();
  } else {
    $('.ui.dropdown.icon.item')
      .dropdown('clear');
    $('.ui.dropdown.icon.item').dropdown('hide');
  }
}

$('.ui.dropdown.icon.item').dropdown({
  duration: 0
});

//prevent the dropdown from closing on item select
$('.item').on('click', function (e) {
  e.stopPropagation();
});
