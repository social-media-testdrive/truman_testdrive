let jqhxrArray = new Array(); // this array will be handed to Promise.all
let pathArrayIntro = window.location.pathname.split('/');
const subdirectory1 = pathArrayIntro[1]; // idenify the current page
const subdirectory2 = pathArrayIntro[2]; // idenify the current module
let startTimestamp = Date.now();

const firstStepsList = [{
        element: '#step1A',
        intro: `¡Dale clic a "Siguiente" para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: '#step1A',
        intro: `Desplázate por la línea de tiempo para aprender cómo responder a
    las noticias de último minuto en las redes sociales.`,
        position: "right",
        audioFile: ['CUSML.9.3.01.mp3']
    },
    {
        element: '#step1',
        intro: `Cuando veas una noticia de último minuto en las redes sociales, es
    importante asegurarte de que sea confiable.`,
        position: "right",
        audioFile: ['CUSML.9.3.02.mp3']
    },
    {
        element: '#step1',
        intro: `Aprendamos más sobre la noticia antes de compartirla con otras personas.
    Haz clic en el artículo sobre las lluvias fuertes en Arequipa para ver qué puedes averiguar.`,
        position: "right",
        audioFile: ['CUSML.9.3.03.mp3']
    }
];

const secondStepsList = [{
        element: '#step2',
        intro: `Comprueba si el artículo está claramente etiquetado como opinión
    o como noticia. En este ejemplo, el título indica que es una noticia.`,
        position: "bottom",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.04.mp3']
    },
    {
        element: '#step3',
        intro: `Al leer un artículo, ¡<b>verifica los hechos</b> de la información!
    Los artículos confiables explican de dónde obtuvieron la información e
    incluyen enlaces a las fuentes que el autor usó al escribir la noticia.`,
        position: "left",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.05.mp3']
    },
    {
        element: '#step3B',
        intro: `Las noticias de último minuto se desarrollan con el tiempo; las primeras
    versiones quizá no tengan toda la información. Los artículos confiables suelen
    dejarlo claro.`,
        position: "left",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.06.mp3']
    },
    {
        element: "#step4",
        intro: `Aunque un artículo parezca confiable, conviene contrastarlo con al menos
    otra fuente. Haz clic en el botón de búsqueda para ver si otros sitios
    también informan de esta historia.`,
        position: "right",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.07.mp3']
    }
];

const thirdStepsList = [{
        element: "#step5",
        intro: `Puedes buscar más información usando un motor de búsqueda.`,
        position: "right",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.08.mp3']
    },
    {
        element: "#step5B",
        intro: `Algunas de las fuentes que encontraste informan de la misma noticia que el
    artículo que viste. Eso indica que el artículo es confiable.`,
        position: "right",
        scrollTo: "tooltip",
        audioFile: ['CUSML.9.3.09.mp3']
    },
    {
        element: "#step6",
        intro: `Haz clic en el botón «Volver al feed» para ver qué puedes hacer a
    continuación.`,
        position: "bottom",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.10.mp3']
    }
]

const fourthStepsList = [{
        element: '#step1',
        intro: `Comprobamos que el artículo proviene de un sitio confiable y que
    otros medios informan de la misma noticia. Puedes compartir esta noticia de
    último minuto con tus amigos.`,
        position: "right",
        scrollTo: "element",
        scrollPadding: 90,
        audioFile: ['CUSML.9.3.11.mp3']
    },
    {
        element: '#step1',
        intro: `Si no estás seguro de que el artículo sea correcto, no lo compartas con
    otras personas. ¡No querrías que otros creyeran algo que podría no ser cierto!`,
        position: "right",
        scrollTo: "element",
        audioFile: ['CUSML.9.3.12.mp3']
    }
]

function changeActiveTab(newActiveTab) {
    $('.ui.tab').removeClass('active');
    switch (newActiveTab) {
        case 'home':
            $('.ui.tab[data-tab="one"]').addClass('active');
            break;
        case 'article':
            $('.ui.tab[data-tab="two"]').addClass('active');
            break;
        case 'search':
            $('.ui.tab[data-tab="three"]').addClass('active');
            break;
        default:
            $('.ui.tab[data-tab="one"]').addClass('active');
            break;
    }
}

function startIntro(enableDataCollection) {
    window.scrollTo(0, 0);
    let intro = introJs().setOptions({
        steps: firstStepsList,
        'scrollToElement': false,
        'hidePrev': true,
        'hideNext': true,
        'exitOnOverlayClick': false,
        'exitOnEsc': false,
        'showStepNumbers': false,
        'showBullets': false,
        'doneLabel': 'Listo &#10003',
        'nextLabel': 'Siguiente &rarr;', 
        'prevLabel': '&larr; Volver',
        'skipLabel': 'Suprimir',
        'hintButtonLabel': '¡Entendido!',
    });
    /*
    onbeforechange:
    "Given callback function will be called before starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    intro.onbeforechange(function() {
        // If data collection is enabled:
        if (enableDataCollection) {
            // ._currentStep has the number of the NEXT tutorial box you're moving toward.
            // However, we want to know the number of the step we are LEAVING.
            // We can use ._direction to determine if we are going forward or backward,
            // and then subtract/add accordingly to get the number we want.
            let leavingStep = 0;
            if ($(this)[0]._direction === "forward") {
                leavingStep = ($(this)[0]._currentStep - 1);
            } else if ($(this)[0]._direction === "backward") {
                leavingStep = ($(this)[0]._currentStep + 1);
            } else {
                console.log(`There was an error in calculating the step number.`);
            }
            let totalTimeOpen = Date.now() - startTimestamp;
            let cat = {};
            cat.subdirectory1 = subdirectory1;
            cat.subdirectory2 = subdirectory2;
            cat.stepNumber = leavingStep;
            cat.viewDuration = totalTimeOpen;
            cat.absoluteStartTime = startTimestamp;
            // Check that leavingStep is a legitimate number. -1 seems to occur whenever
            // the page is loaded, or when the back button is used - we don't want to
            // record those occurrences.
            if (leavingStep !== -1) {
                const jqxhr = $.post("/introjsStep", {
                    action: cat,
                    _csrf: $('meta[name="csrf-token"]').attr('content')
                });
                jqhxrArray.push(jqxhr);
                console.log(cat);
            }
        }

        let currentStep = $(this)[0]._currentStep;
        if (currentStep < 1) {
            window.scrollTo(0, 0);
            $('.ui.card.articleCard').removeClass('articleCardClickable');
        }
        if (currentStep === 1) {
            $('.scrollToHere')[0].scrollIntoView();
        }
        if (currentStep === 2) {
            $('.scrollToHere')[0].scrollIntoView();
            $('.ui.card.articleCard').addClass('articleCardClickable');
        }
    });

    /*
    onafterchange:
    "Given callback function will be called after starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    intro.onafterchange(function() {
        Voiceovers.playVoiceover(firstStepsList[$(this)[0]._currentStep].audioFile);
        // reset the timestamp for the next step
        startTimestamp = Date.now();
        hideHelpMessage();
    });

    /*
    onbeforexit:
    "Works exactly same as onexit but calls before closing the tour. Also,
    returning false would prevent the tour from closing."
  */
    intro.onbeforeexit(function() {
        // Skip the remaining code in this function if data collection is disabled.
        if (!enableDataCollection) {
            return;
        }
        // Data collection is enabled:
        let leavingStep = $(this)[0]._currentStep;
        // edge case: current step will = -1 when the user leaves the page using
        // something like the back button. Don not record that.
        let totalTimeOpen = Date.now() - startTimestamp;
        let cat = {};
        cat.subdirectory1 = subdirectory1;
        cat.subdirectory2 = subdirectory2;
        cat.stepNumber = leavingStep;
        cat.viewDuration = totalTimeOpen;
        cat.absoluteStartTime = startTimestamp;
        const jqxhr = $.post("/introjsStep", {
            action: cat,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        jqhxrArray.push(jqxhr);
        console.log(cat);
        // this is the last step in the module, so change pages once all Promises
        // are completed
        Promise.all(jqhxrArray).then(function() {
            jqhxrArray = [];
        });
    });

    /*
    onexit: 
    "Set callback to exit of introduction."
    */
    intro.onexit(function() {
        hideHelpMessage();
        Voiceovers.pauseVoiceover();
        $('#instructionsToContinueOne').show();
        $(".articleCard").css("box-shadow", "0px 0px 15px #14a1f6")
        $('.ui.card.articleCard').off();
        $('.ui.card.articleCard').on('click', function() {
            if ($(this).hasClass('articleCardClickable')) {
                startTimestamp = Date.now();
                $(this).transition({
                    animation: 'pulse',
                    onComplete: function() {
                        changeActiveTab('article');
                        $('#instructionsToContinueOne').hide();
                        startSecondIntro(enableDataCollection);
                        Voiceovers.playVoiceover(secondStepsList[0].audioFile);
                    }
                });
            }
        });
    });

    intro.start(); //start the intro
    return intro;
}

function startSecondIntro(enableDataCollection) {
    window.scrollTo(0, 0);
    let secondIntro = introJs().setOptions({
        steps: secondStepsList,
        'hidePrev': true,
        'hideNext': true,
        'exitOnOverlayClick': false,
        'exitOnEsc': false,
        'showStepNumbers': false,
        'showBullets': false,
        'scrollToElement': true,
        'doneLabel': 'Listo &#10003',
        'nextLabel': 'Siguiente &rarr;', 
        'prevLabel': '&larr; Volver',
        'skipLabel': 'Suprimir',
        'hintButtonLabel': '¡Entendido!',
    });

    /*
    onbeforechange:
    "Given callback function will be called before starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    secondIntro.onbeforechange(function() {
        // If data collection is enabled:
        if (enableDataCollection) {
            // ._currentStep has the number of the NEXT tutorial box you're moving toward.
            // However, we want to know the number of the step we are LEAVING.
            // We can use ._direction to determine if we are going forward or backward,
            // and then subtract/add accordingly to get the number we want.
            let leavingStep = 0;
            if ($(this)[0]._direction === "forward") {
                leavingStep = ($(this)[0]._currentStep - 1);
            } else if ($(this)[0]._direction === "backward") {
                leavingStep = ($(this)[0]._currentStep + 1);
            } else {
                console.log(`There was an error in calculating the step number.`);
            }
            let totalTimeOpen = Date.now() - startTimestamp;
            let cat = {};
            cat.subdirectory1 = subdirectory1;
            cat.subdirectory2 = subdirectory2;
            cat.stepNumber = leavingStep + 4;
            cat.viewDuration = totalTimeOpen;
            cat.absoluteStartTime = startTimestamp;
            // Check that leavingStep is a legitimate number. -1 seems to occur whenever
            // the page is loaded, or when the back button is used - we don't want to
            // record those occurrences.
            if (leavingStep !== -1) {
                const jqxhr = $.post("/introjsStep", {
                    action: cat,
                    _csrf: $('meta[name="csrf-token"]').attr('content')
                });
                jqhxrArray.push(jqxhr);
                console.log(cat);
            }
        }

        let currentStep = $(this)[0]._currentStep;
        if (currentStep < 3) {
            $('.ui.big.button.searchTab').removeClass('green');
        }
        if (currentStep === 3) {
            window.scrollTo(0, 0);
            $('.ui.big.button.searchTab').addClass('green');
        }
    });

    /*
    onafterchange:
    "Given callback function will be called after starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    secondIntro.onafterchange(function() {
        Voiceovers.playVoiceover(secondStepsList[$(this)[0]._currentStep].audioFile);
        // reset the timestamp for the next step
        startTimestamp = Date.now();
        hideHelpMessage();
    });

    /*
    onbeforexit:
    "Works exactly same as onexit but calls before closing the tour. Also,
    returning false would prevent the tour from closing."
    */
    secondIntro.onbeforeexit(function() {
        // Skip the remaining code in this function if data collection is disabled.
        if (!enableDataCollection) {
            return;
        }
        // Data collection is enabled:
        let leavingStep = $(this)[0]._currentStep;
        // edge case: current step will = -1 when the user leaves the page using
        // something like the back button. Don not record that.
        let totalTimeOpen = Date.now() - startTimestamp;
        let cat = {};
        cat.subdirectory1 = subdirectory1;
        cat.subdirectory2 = subdirectory2;
        cat.stepNumber = leavingStep + 4;
        cat.viewDuration = totalTimeOpen;
        cat.absoluteStartTime = startTimestamp;
        console.log(cat);
        const jqxhr = $.post("/introjsStep", {
            action: cat,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        jqhxrArray.push(jqxhr);
        // this is the last step in the module, so change pages once all Promises
        // are completed
        Promise.all(jqhxrArray).then(function() {
            jqhxrArray = [];
        });
    });

    /*
    onexit: 
    "Set callback to exit of introduction."
    */
    secondIntro.onexit(function() {
        hideHelpMessage();
        Voiceovers.pauseVoiceover();
        $('#instructionsToContinueTwo').show();
        $('.ui.big.button.searchTab').on('click', function() {
            if ($(this).hasClass('green')) {
                // secondIntro.exit();
                startTimestamp = Date.now();
                $('#instructionsToContinueTwo').hide();
                changeActiveTab('search');
                startThirdIntro(enableDataCollection);
                Voiceovers.playVoiceover(thirdStepsList[0].audioFile);
            }
        });
    });

    secondIntro.start();
    return secondIntro;
};

function startThirdIntro(enableDataCollection) {
    window.scrollTo(0, 0);
    let thirdIntro = introJs().setOptions({
        steps: thirdStepsList,
        'hidePrev': true,
        'hideNext': true,
        'exitOnOverlayClick': false,
        'exitOnEsc': false,
        'showStepNumbers': false,
        'showBullets': false,
        'scrollToElement': true,
        'doneLabel': 'Listo &#10003',
        'nextLabel': 'Siguiente &rarr;', 
        'prevLabel': '&larr; Volver',
        'skipLabel': 'Suprimir'
    });

    /*
    onbeforechange:
    "Given callback function will be called before starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    thirdIntro.onbeforechange(function() {
        // If data collection is enabled:
        if (enableDataCollection) {
            // ._currentStep has the number of the NEXT tutorial box you're moving toward.
            // However, we want to know the number of the step we are LEAVING.
            // We can use ._direction to determine if we are going forward or backward,
            // and then subtract/add accordingly to get the number we want.
            let leavingStep = 0;
            if ($(this)[0]._direction === "forward") {
                leavingStep = ($(this)[0]._currentStep - 1);
            } else if ($(this)[0]._direction === "backward") {
                leavingStep = ($(this)[0]._currentStep + 1);
            } else {
                console.log(`There was an error in calculating the step number.`);
            }
            let totalTimeOpen = Date.now() - startTimestamp;
            let cat = {};
            cat.subdirectory1 = subdirectory1;
            cat.subdirectory2 = subdirectory2;
            cat.stepNumber = leavingStep + 8;
            cat.viewDuration = totalTimeOpen;
            cat.absoluteStartTime = startTimestamp;
            // Check that leavingStep is a legitimate number. -1 seems to occur whenever
            // the page is loaded, or when the back button is used - we don't want to
            // record those occurrences.
            if (leavingStep !== -1) {
                const jqxhr = $.post("/introjsStep", {
                    action: cat,
                    _csrf: $('meta[name="csrf-token"]').attr('content')
                });
                jqhxrArray.push(jqxhr);
                console.log(cat);
            }
        }

        let currentStep = $(this)[0]._currentStep;
        if (currentStep === 2) {
            window.scrollTo(0, 0);
            $('.ui.big.button.homeTab').addClass('testDriveBlueButton');
        }
    });

    /*
    onafterchange:
    "Given callback function will be called after starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    thirdIntro.onafterchange(function() {
        Voiceovers.playVoiceover(secondStepsList[$(this)[0]._currentStep].audioFile);
        // reset the timestamp for the next step
        startTimestamp = Date.now();
        hideHelpMessage();
    });

    /*
    onbeforexit:
    "Works exactly same as onexit but calls before closing the tour. Also,
    returning false would prevent the tour from closing."
    */
    thirdIntro.onbeforeexit(function() {
        // Skip the remaining code in this function if data collection is disabled.
        if (!enableDataCollection) {
            return;
        }
        // Data collection is enabled:
        let leavingStep = $(this)[0]._currentStep;
        // edge case: current step will = -1 when the user leaves the page using
        // something like the back button. Don not record that.
        let totalTimeOpen = Date.now() - startTimestamp;
        let cat = {};
        cat.subdirectory1 = subdirectory1;
        cat.subdirectory2 = subdirectory2;
        cat.stepNumber = leavingStep + 8;
        cat.viewDuration = totalTimeOpen;
        cat.absoluteStartTime = startTimestamp;
        console.log(cat);
        const jqxhr = $.post("/introjsStep", {
            action: cat,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        jqhxrArray.push(jqxhr);
        // this is the last step in the module, so change pages once all Promises
        // are completed
        Promise.all(jqhxrArray).then(function() {
            jqhxrArray = [];
        });
    });

    /*
    onexit: 
    "Set callback to exit of introduction."
    */
    thirdIntro.onexit(function() {
        hideHelpMessage();
        Voiceovers.pauseVoiceover();
        $('#instructionsToContinueThree').show();
        $('.ui.big.button.homeTab').on('click', function() {
            if ($(this).hasClass('testDriveBlueButton')) {
                // thirdIntro.exit();
                startTimestamp = Date.now();
                $('#instructionsToContinueThree').hide();
                changeActiveTab('home');
                startFourthIntro(enableDataCollection);
                Voiceovers.playVoiceover(fourthStepsList[0].audioFile);
            }
        });
    });

    thirdIntro.start();
    return thirdIntro;
};

function startFourthIntro(enableDataCollection) {
    $('.ui.card.articleCard').removeClass('articleCardClickable');
    $('.scrollToHere')[0].scrollIntoView();

    let fourthIntro = introJs().setOptions({
        steps: fourthStepsList,
        'hidePrev': true,
        'hideNext': true,
        'exitOnOverlayClick': false,
        'exitOnEsc': false,
        'showStepNumbers': false,
        'showBullets': false,
        'scrollToElement': true,
        'doneLabel': 'Listo &#10003',
        'nextLabel': 'Siguiente &rarr;', 
        'prevLabel': '&larr; Volver',
        'skipLabel': 'Suprimir'
    });

    /*
    onbeforechange:
    "Given callback function will be called before starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    fourthIntro.onbeforechange(function() {
        // If data collection is enabled:
        if (enableDataCollection) {
            // ._currentStep has the number of the NEXT tutorial box you're moving toward.
            // However, we want to know the number of the step we are LEAVING.
            // We can use ._direction to determine if we are going forward or backward,
            // and then subtract/add accordingly to get the number we want.
            let leavingStep = 0;
            if ($(this)[0]._direction === "forward") {
                leavingStep = ($(this)[0]._currentStep - 1);
            } else if ($(this)[0]._direction === "backward") {
                leavingStep = ($(this)[0]._currentStep + 1);
            } else {
                console.log(`There was an error in calculating the step number.`);
            }
            let totalTimeOpen = Date.now() - startTimestamp;
            let cat = {};
            cat.subdirectory1 = subdirectory1;
            cat.subdirectory2 = subdirectory2;
            cat.stepNumber = leavingStep + 11;
            cat.viewDuration = totalTimeOpen;
            cat.absoluteStartTime = startTimestamp;
            // Check that leavingStep is a legitimate number. -1 seems to occur whenever
            // the page is loaded, or when the back button is used - we don't want to
            // record those occurrences.
            if (leavingStep !== -1) {
                console.log(cat);
                const jqxhr = $.post("/introjsStep", {
                    action: cat,
                    _csrf: $('meta[name="csrf-token"]').attr('content')
                });
                jqhxrArray.push(jqxhr);
            }
        }

        let currentStep = $(this)[0]._currentStep;
        if (currentStep === 2) {
            window.scrollTo(0, 0);
            $('.ui.big.button.homeTab').addClass('testDriveBlueButton');
        }
    });

    /*
    onafterchange:
    "Given callback function will be called after starting a new step of
    introduction. The callback function receives the element of the new step as
    an argument."
    */
    fourthIntro.onafterchange(function() {
        Voiceovers.playVoiceover(secondStepsList[$(this)[0]._currentStep].audioFile);
        // reset the timestamp for the next step
        startTimestamp = Date.now();
        hideHelpMessage();
    });

    /*
    onbeforexit:
    "Works exactly same as onexit but calls before closing the tour. Also,
    returning false would prevent the tour from closing."
    */
    fourthIntro.onbeforeexit(function() {
        hideHelpMessage();
        Voiceovers.pauseVoiceover();

        // Skip the remaining code in this function if data collection is disabled.
        if (!enableDataCollection) {
            window.location.href = '/sim/advancedlit-esp';
            return;
        }
        // Data collection is enabled:
        let leavingStep = $(this)[0]._currentStep;
        // edge case: current step will = -1 when the user leaves the page using
        // something like the back button. Don not record that.
        let totalTimeOpen = Date.now() - startTimestamp;
        let cat = {};
        cat.subdirectory1 = subdirectory1;
        cat.subdirectory2 = subdirectory2;
        cat.stepNumber = leavingStep + 11;
        cat.viewDuration = totalTimeOpen;
        cat.absoluteStartTime = startTimestamp;
        console.log(cat);
        const jqxhr = $.post("/introjsStep", {
            action: cat,
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        jqhxrArray.push(jqxhr);
        // this is the last step in the module, so change pages once all Promises
        // are completed
        Promise.all(jqhxrArray).then(function() {
            // use the variable nextPageURL defined in the custom js file for the page
            window.location.href = '/sim/advancedlit-esp';
            jqhxrArray = [];
        });
    });

    fourthIntro.start();
    return fourthIntro;

};

function isTutorialBoxOffScreen(bottomOffset) {
    if (window.scrollY > bottomOffset) {
        return true;
    } else {
        return false;
    }
}

function hideHelpMessage() {
    if ($('#clickNextHelpMessage').is(':visible')) {
        $('#clickNextHelpMessage').transition('fade');
    }
}

function showHelpMessage() {
    if ($('#clickNextHelpMessage').is(':hidden')) {
        $('#clickNextHelpMessage').transition('fade down');
    }
}

$(window).on("load", function() {
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    const intro = startIntro(enableDataCollection);
    const tooltipTopOffset = $('.introjs-tooltip').offset().top;
    const tooltipBottomOffset = tooltipTopOffset + $('.introjs-tooltip').outerHeight();
    let scrolledAway = false;
    // When the user scrolls, check that they haven't missed the first tooltip.
    // If the tooltip is scrolled out of the viewport and the user is still on
    // the first tooltip step after 4 seconds, show a help message.
    $(window).scroll(function() {
        // only want to do this once, so check that scrolledAway is false
        if (isTutorialBoxOffScreen(tooltipBottomOffset) && (!scrolledAway)) {
            scrolledAway = true;
            setTimeout(function() {
                if (intro._currentStep === 0) {
                    showHelpMessage();
                }
            }, 4000);
        }
    });

});