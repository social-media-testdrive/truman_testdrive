var hintsList = [{
  hint: `¿Cómo puedes tener un impacto positivo en tu huella digital? 
  ¡Puedes publicar posts sobre tus hobbies, escuela, actividades o 
  cualquier otro interés!`,
  element: '#hint1',
  audioFile: ['']
},
{
  hint: `Lee esta publicación y luego haz clic en ella para pensar más 
  sobre cómo una publicación como esta afecta la huella digital de alguien.`,
  element: '#hint2',
  hintPosition: 'bottom-right',
  audioFile: ['']
},
{
  hint: `Lee esta publicación y luego haz clic en ella para pensar más sobre 
  cómo una publicación como esta afecta la huella digital de alguien.`,
  element: '#hint3',
  hintPosition: 'middle-middle',
  audioFile: ['']
},
{
  hint: `¡Recuerde, tu huella digital puede afectar tu reputación en línea y 
  fuera de línea! Piensa en quién puede ver tu post y cómo podrían verte a ti 
  como resultado.`,
  element: '#hint4',
  hintPosition: 'middle-middle',
  audioFile: ['']
},
{
  hint: `Si alguien publica algo que no deseas tener como parte de tu huella 
  digital, puedes pedirle que lo borren a través de un mensaje privado.`,
  element: '#hint5',
  hintPosition: 'bottom-right',
  audioFile: ['']
}
];

var stepsList = [{
  element: '#step1',
  intro: `Dale clic a “Siguiente” para comenzar!`,
  position: 'left',
  scrollTo: 'tooltip',
  audioFile: ['']
},
{
  element: '#step1',
  intro: `Dale clic a "Listo" y busca los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0'
class='introjs-hint'><div class='introjs-hint-dot'></div><div class=
'introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; para aprender más...`,
  position: "left",
  scrollTo: 'tooltip',
  audioFile: ['']
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