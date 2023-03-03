var hintsList = [{
    hint: `¿Cómo puedes tener un impacto positivo en tu huella digital? 
      ¡Puedes publicar cosas relacionadas con tus pasatiempos, actividades 
      escolares u otros intereses!`,
    element: '#hint1',
    // audioFile: ['CUSML.4.4.2.mp3']
},
{
      hint: `Lee este post y luego haz clic en él para pensar más acerca 
      de cómo un post como este impacta la huella digital de alguien.`,
    element: '#hint2',
    hintPosition: 'bottom-right',
    // audioFile: ['CUSML.4.4.3.mp3']
},
{
      hint: `Lee este post y luego haz clic en él para pensar más acerca de 
      cómo un post como este impacta la huella digital de alguien.`,
    element: '#hint3',
    hintPosition: 'middle-middle',
    // audioFile: ['CUSML.4.4.3.mp3']
},
{
      hint: `Recuerda, tu huella digital puede afectar tu reputación tanto en 
      línea como fuera de línea. Piensa en quién puede ver tu publicación y 
      cómo podrían verte como resultado.`,
    element: '#hint4',
    hintPosition: 'middle-middle',
    // audioFile: ['CUSML.4.4.4.mp3']
},
{
      hint: `Si alguien publica algo que no quieres que forme parte de tu huella 
      digital, puedes pedirle que lo elimine a través de un mensaje privado.`,
    element: '#hint5',
    hintPosition: 'bottom-right',
    // audioFile: ['CUSML.4.4.5.mp3']
}
];

var stepsList = [{
    element: '#step1',
      intro: `¡Haz clic en "Siguiente" para comenzar!`,
    position: 'left',
    scrollTo: 'tooltip',
    // audioFile: ['']
},
{
    element: '#step1',
    intro: `Haz clic en "Hecho" y luego busca los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
  'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; para obtener más información...`,
    position: "left",
    scrollTo: 'tooltip',
    // audioFile: ['CUSML.4.4.1.mp3']
}
];

let clickPost = false;

function eventsAfterHints() {
$('.img.post img').on('click', function() {
    clickPost = true;
    $('#confirmContinueCheck').hide();
    $('.ui.modal input[type=checkbox]').prop('checked', false);
    // $('#digfoot_sim_modal').modal('show');
    recordSimModalInputs('digfoot_simModal');
});
}