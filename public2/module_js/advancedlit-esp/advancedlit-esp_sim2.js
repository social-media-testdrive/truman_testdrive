var hintsList = [{
        hint: `Intentemos analizar el artículo de noticias para identificar si esta es una historia precisa y fiable.`,
        element: '#hint1',
        audioFile: ['CUSML.9.4.03.mp3']
    },
    {
        hint: `Esta etiqueta te indica si el artículo es una columna de opinión o una noticia informativa. Leer opiniones ajenas está bien, ¡pero no las confundas con hechos comprobados!`,
        element: '#hint2',
        hintPosition: 'bottom-left',
        audioFile: ['CUSML.9.4.04.mp3']
    },
    {
        hint: `Los artículos de noticias fiables suelen explicar cómo y dónde reunieron la información y ofrecen enlaces a las fuentes que usó el autor. Este artículo no cita ninguna fuente oficial.`,
        element: '#hint3',
        hintPosition: 'bottom-middle',
        audioFile: ['CUSML.9.4.05.mp3']
    },
    {
        hint: `Busquemos más fuentes para ver si otros medios informan lo mismo. Haz clic en el botón de búsqueda para ver cuáles son los primeros cinco resultados.`,
        element: '#hint4',
        hintPosition: 'bottom-middle',
        audioFile: ['CUSML.9.4.06.mp3']
    }
];

function eventsAfterHints() {
    introJs().hideHints();
    introJs().showHint(0);
}

function customOnHintCloseFunction(stepID) {

    // sequential hint appearance
    stepID += 1;
    if (stepID !== numberOfHints) {
        introJs().showHint(stepID);
    }

    // do nothing
    closedHints++;
    clickedHints = 0;
    if (closedHints == numberOfHints) {
        if ($('#clickAllDotsWarning').is(":visible")) {
            $('#clickAllDotsWarning').transition('fade');
        }
        if ($('#removeHidden').is(":visible")) {
            $('#removeHidden').transition('fade');
        }
        $('.searchTab').addClass('green');
        $('#instructionsToContinue').show();

    } else {
        if ($('#removeHidden').is(":visible")) {
            $('#removeHidden').transition('fade');
        }
    }
}

$('.searchTab').on('click', function() {
    if (closedHints === numberOfHints) {
        window.location.href = '/sim3/advancedlit-esp';
    } else {
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#clickAllDotsWarning').transition('fade');
        } else {
            //otherwise, bounce the message to draw attention to it
            $('#clickAllDotsWarning').transition('bounce');
        }
        // Scroll to the first blue dot that is still visible
        if ($('.introjs-hint:visible')[0]) { //Check if undefined. Undefined when there are no more visible blue dots.
            $('.introjs-hint:visible')[0].scrollIntoView({
                behavior: "smooth", // or "auto" or "instant"
                block: "start", // defines vertical alignment
                inline: "nearest" // defines horizontal alignment
            });
        };
    }
});