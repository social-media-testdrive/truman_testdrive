var hintsList=
[
  {
    hint: `Natalia y Diego, los mejores amigos de Ricardo, han publicado que van a salir, pero no invitaron a Ricardo. Dale clic a la publicación para reflexionar en cómo Ricardo puede sentirse y que puede hacer si está experimentando una sensación de alerta roja.`,
    element: '#hint1',
    position: 'right',
    hintPosition: 'middle-right',
    audioFile: ['']
  },
  {
    hint: `Dale clic en la publicación para pensar en cómo Ricardo se puede sentir al ver esta publicación y lo que puede hacer al respecto.`,
    element: '#hint3',
    position: 'bottom',
    hintPosition: 'middle-right',
    audioFile: ['']
  },
  {
    hint: `Ver todo lo que publican sus amigos puede hacer que Ricardo sienta que su vida no es interesante o divertida. Pero muchas personas solo publican las cosas positivas y emocionantes que suceden en sus vidas.`,
    element: '#hint3A',
    position: 'right',
    hintPosition: 'bottom-right',
    audioFile: ['']
  },
  {
    hint: `Ricardo siempre puede tomar un descanso de las redes sociales. Él puede salir con sus amigos y familia o hacer algo que disfrute como montar bicicleta.`,
    element: '#hint4',
    position: 'bottom-right',
    hintPosition: 'middle-right',
    audioFile: ['']
  }
]

var stepsList=
[
  {
    element: '#step1',
    intro: `Dale clic en "Seguir" para comenzar!`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: '#step1',
    intro: `Esta es el feed de Ricardo. Acaba de llegar de la escuela y está revisando su perfil. Dale clic a “Siguiente” y luego observa los puntos azules&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; para aprender más.`,
    position: "left",
    scrollTo: 'tooltip',
    audioFile: ['']
  }
]

let clickPost = false;

function eventsAfterHints() {
introJs().hideHints();
introJs().showHint(0);

$('.ui.fluid.card.test img').on('click', function() {
    $('.ui.accordion').accordion('open', 0);
    $('.ui.accordion').accordion('close', 1);
    $('.ui.modal input[type=checkbox]').prop('checked', false);
    recordSimModalInputs('esteem_simPostModal1');
    clickPost = true;
    $('#confirmContinueCheck').hide();
});
};


function customOnHintCloseFunction(stepID) {

// sequential hint appearance
stepID += 1;
if (stepID !== numberOfHints) {
    introJs().showHint(stepID);
}

closedHints++;
clickedHints = 0;
if ($('#removeHidden').is(":visible")) {
    $('#removeHidden').transition('fade');
    if ($('#clickAllDotsWarning').is(":hidden")) {
        $('#cyberTransButton').css("margin-bottom", "4em");
    }
}
if (closedHints == numberOfHints) {
    if ($('#clickAllDotsWarning').is(':visible')) {
        $('#clickAllDotsWarning').transition('fade');
        $('#cyberTransButton').css("margin-bottom", "4em");
    }
    $("#cyberTransButton").addClass("green");
}
}