const nextPageURL = 'sim';

let stepsList;

function additionalOnBeforeChange(jqThis){
  if(jqThis[0]._currentStep == 2){
    setTimeout(function(){
      $('#notificationsTabLabel').transition('jiggle');
    }, 500);
  }
  if((jqThis[0]._currentStep === 3) || jqThis[0]._currentStep === 4){
    $(".feedDisplay").hide();
    $(".notificationsDisplay").show();
    $('#feedsteps').removeClass('active');
    $('#notificationsteps').addClass('active');
  } else {
    $(".feedDisplay").show();
    $(".notificationsDisplay").hide();
    $('#notificationsteps').removeClass('active');
    $('#feedsteps').addClass('active');
  }
}

$(window).on("load", function() {

  if ( $('.ui.menu.notMobileView').is(":visible") ) {
    stepsList = [
      {
        element: '#step0',
        intro: `¡Dale clic a “Siguiente” para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        // audioFile: ['']
      },
      {
        element: '#step0',
        intro: `¿Alguna vez tu celular ha vibrado y luego ha aparecido una notificación?`,
        position: "right",
        scrollTo: 'tooltip',
        // audioFile: ['CUSML.10.3.1.mp3']
      },
      {
        element: '#notificationsteps',
        intro: `Las notificaciones tienen un color llamativo que las hacen parecer urgentes 
        para capturar tu atención. Así, esto te puede hacer sentir que tienes que ir a la 
        página para revisar qué es.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.2.mp3']
      },
      {
        element: '#step2',
        intro: `A todos nos gusta que nos den “Like” y comenten en nuestras publicaciones. 
        Esto nos da la sensación de ser valorados y aceptados por las otras personas.`,
        position: "left",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.3.mp3']
      },
      {
        element: '#step2',
        intro: `Los “Like” y los comentarios pueden crear un ciclo de retroalimentación 
        que te haga revisar una y otra vez si algo nuevo aparece.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.4.mp3']
      },
      {
        element: '#step5',
        intro: `Otra característica que puede hacer que te sientas atraído por las aplicaciones 
        es la reproducción automática, esto hace que se reproduzca otro video después que 
        termine el que estabas viendo.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.5.mp3']
      },
      {
        element: '#step5',
        intro: `Esto hace que sea tentador seguir mirando, aún así tengas algo que hacer en 
        el momento.`,
        position: "right",
        // audioFile: ['CUSML.10.3.6.mp3']
      },
      {
        element: '#step6',
        intro: `Además, en una red social real las publicaciones no tienen fin. Esto hace que 
        te quedes enganchado al punto de revisarlas por horas, pasando más tiempo del que 
        esperabas.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.7.mp3']
      }
    ]
  } else if ( $('.ui.menu.mobileView').is(":visible") ) {
    stepsList = [
      {
        element: '#step0',
        intro: `¡Dale clic a “Siguiente” para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        audioFile: ['']
      },
      {
        element: '#step0',
        intro: `¿Alguna vez tu celular ha vibrado y luego ha aparecido una notificación?`,
        position: "right",
        scrollTo: 'tooltip',
        // audioFile: ['CUSML.10.3.1.mp3']
      },
      {
        element: '#notificationsteps',
        intro: `Las notificaciones tienen un color llamativo que las hacen parecer urgentes 
        para capturar tu atención. Así, esto te puede hacer sentir que tienes que ir a la 
        página para revisar qué es.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.2.mp3']
      },
      {
        element: '#step2',
        intro: `A todos nos gusta que nos den “Like” y comenten en nuestras publicaciones. 
        Esto nos da la sensación de ser valorados y aceptados por las otras personas.`,
        position: "left",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.3.mp3']
      },
      {
        element: '#step2',
        intro: `Los “Like” y los comentarios pueden crear un ciclo de retroalimentación 
        que te haga revisar una y otra vez si algo nuevo aparece.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.4.mp3']
      },
      {
        element: '#step5',
        intro: `Otra característica que puede hacer que te sientas atraído por las aplicaciones 
        es la reproducción automática, esto hace que se reproduzca otro video después que 
        termine el que estabas viendo.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.5.mp3']
      },
      {
        element: '#step5',
        intro: `Esto hace que sea tentador seguir mirando, aún así tengas algo que hacer en 
        el momento.`,
        position: "right",
        // audioFile: ['CUSML.10.3.6.mp3']
      },
      {
        element: '#step6',
        intro: `Además, en una red social real las publicaciones no tienen fin. Esto hace que 
        te quedes enganchado al punto de revisarlas por horas, pasando más tiempo del que 
        esperabas.`,
        position: "right",
        scrollTo: "tooltip",
        // audioFile: ['CUSML.10.3.7.mp3']
      }
    ];
  }

});
