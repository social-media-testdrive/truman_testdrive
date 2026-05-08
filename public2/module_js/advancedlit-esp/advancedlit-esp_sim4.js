const hintsList = [{
        hint: `Según tu análisis del artículo, piensa qué harías a continuación.`,
        element: '#hint1',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.9.4.09.mp3']
    },
    {
        hint: `No es buena idea compartir una noticia que no es exacta, porque puede llevar a que otras personas creen algo falso.`,
        element: '#hint2',
        hintPosition: 'bottom-middle',
        audioFile: ['CUSML.9.4.10.mp3']
    },
    {
        hint: `Si crees que el artículo es incorrecto, puedes marcar la publicación para reportarla al sitio.`,
        element: '#hint3',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.9.4.11.mp3']
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
    if ($('#removeHidden').is(":visible")) {
        $('#removeHidden').transition('fade');
    }
    if (closedHints == numberOfHints) {
        if ($('#clickAllDotsWarning').is(":visible")) {
            $('#clickAllDotsWarning').transition('fade');
        }
        $('.articleTab').addClass('green');
    }
}

$('.continueButton').on('click', function() {
    if (closedHints === numberOfHints) {
        window.location.href = '/trans/advancedlit-esp';
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
                block: "center", // defines vertical alignment
                inline: "nearest" // defines horizontal alignment
            });
        };
    }
});