const stepsList = [{
        intro: `¡Haz clic en "Siguiente" para comenzar!`,
        audioFile: ['']
    },
    {
        intro: `Haz clic en "Listo" y luego busca los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'>
    <div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'>
    </div></a> &nbsp; &nbsp; &nbsp; &nbsp; para saber más...`,
        audioFile: ['CUSML.11.5.1.mp3']
    }
];

const hintsList = [{
        element: '#hint1',
        hint: `Si ves que tus amigos comparten información privada en las redes sociales,
    es una buena idea decirles que la quiten.`,
        hintPosition: 'middle-right',
        audioFile: ['CUSML.11.5.3.mp3']
    },
    {
        element: '#hint2',
        hint: `Como estos mensajes vienen de un desconocido, no debes compartir
    ninguna información privada con esa persona. Recuerda que también puedes ignorarla.`,
        hintPosition: 'top-middle',
        audioFile: ['CUSML.11.5.2.mp3']
    }
];

function customOnHintCloseFunction() {
    closedHints++;
    clickedHints = 0;
    if ($('#removeHidden').is(':visible')) {
        $('#removeHidden').transition('fade');
    }
    if (closedHints == hintsList.length) {
        endIntro();
    }
}

function endIntro() {
    var intro = introJs().setOptions({
        'hidePrev': true,
        'hideNext': true,
        'exitOnOverlayClick': false,
        'exitOnEsc': false,
        'showBullets': false,
        'showStepNumbers': false,
        'scrollToElement': true,
        'doneLabel': 'Listo &#10003',
        'nextLabel': 'Siguiente &rarr;',
        'prevLabel': '&larr; Atrás',
        'skipLabel': 'Salir'
    });
    intro.setOptions({
        steps: [{
            intro: 'Ahora repasemos lo que aprendimos.'
        }]
    });
    intro.start().onexit(function () {
        window.location.href = '/trans/safe-posting-esp';
    });
}
