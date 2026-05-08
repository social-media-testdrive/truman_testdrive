var hintsList = [{
        hint: `Los buscadores como Google suelen priorizar resultados sobre noticias de último minuto.`,
        element: '#hint2',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.9.4.07.mp3']
    },
    {
        hint: `Ninguna de las fuentes que encontraste informa lo mismo que el artículo que viste en tu cronología. Eso puede ser una señal de que el artículo tiene información incorrecta.`,
        element: '#hint3',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.9.4.08.mp3']
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
        $('.articleTab').addClass('green');
        $('#instructionsToContinue').show();

    } else {
        if ($('#removeHidden').is(":visible")) {
            $('#removeHidden').transition('fade');
        }
    }
}

$('.articleTab').on('click', function() {
    if (closedHints === numberOfHints) {
        window.location.href = '/sim4/advancedlit-esp';
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

$('.articleTab2').on('click', function() {
    if (closedHints !== numberOfHints) {
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