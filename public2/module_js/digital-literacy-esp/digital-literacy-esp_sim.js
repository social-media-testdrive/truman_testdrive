var stepsList = [{
        element: '#step1',
        intro: `¡Dale clic a “Siguiente” para comenzar!`,
        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: '#step1',
        intro: `En esta actividad, mostraremos señales de fake news en las redes sociales. ¡A ver si puedes encontrar las pistas!`,
        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['CUSML.5.6.1.mp3']
    },
    {

        element: '#step1',
        intro: `Dale click a "Listo" y busca los puntos azules &nbsp;<a role='button' tabindex='0'
                class='introjs-hint'><div class='introjs-hint-dot'></div><div
                class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; para aprender más!`,

        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['CUSML.5.6.2.mp3']
    }
];

var hintsList = [{
        hint: `Asegúrate de consultar el sitio web del artículo. Este es sospechoso debido al ".com.co", pues es una clara señal de que está tratando de imitar un sitio creíble. Observa también los errores.`,
        element: '#hint1',
        hintPosition: 'top-left',
        audioFile: ['CUSML.5.6.3.mp3']
    },
    {
        hint: `El título utiliza un lenguaje llamativo y tiene una imagen atractiva para que la gente haga clic en él. Este es un ejemplo de un título clickbait.`,
        element: '#hint2',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.5.6.4.mp3']
    },
    {
        hint: `Después de analizar el título y la imagen, asegúrate de hacer clic en el enlace del artículo para leerlo con más atención.`,
        element: '#hint3',
        audioFile: ['CUSML.5.6.5.mp3']
    },
    {
        hint: `Si decides que el artículo es una fake news, puedes marcar la publicación para denunciarlo. ¡No compartas el artículo!`,
        element: '#hint4',
        audioFile: ['CUSML.5.6.6.mp3']
    }
];

var clickedArticle = false;

var info_text = 'No Information Found';
let post_info_description = new Map([
    ['WWW.NEWSNETWORK.COM.CO', 'Sin medias tintas ofrece las noticias locales y nacionales más actualizadas.'],
    ['WWW.NYTIMES.COM', 'The New York Times (a veces abreviado como NYT y NYTimes) es un periódico estadounidense con sede en la ciudad de Nueva York con influencia y lectores en todo el mundo. Fundado en 1851, el periódico ha ganado 125 premios Pulitzer, más que cualquier otro periódico. El Times por circulación ocupa el puesto 17.º en el mundo y el segundo en los Estados Unidos.'],
    ['WWW.NPR.ORG', 'National Public Radio (abreviado como NPR) es una organización de medios de comunicación estadounidense, sin fines de lucro, financiada con fondos públicos y privados, con sede en Washington, D.C.']
]);

$('.ui.accordion').accordion();

function eventsAfterHints() {

    $('.img.post, .newsArticleTitleContainer, .description').on('click', function() {
        // update clickedArticle.
        clickedArticle = true;
        $('#clickArticleLinkWarning').hide();
        if (closedHints == numberOfHints) {
            $("#cyberTransButton").addClass("green");
        }
        recordSimModalInputs('digital-literacy_articleModal');
    });

    $(".info_button").click(function(e) {
        var clickedId = '#' + $(this).attr('id');
        let info_header = $(clickedId).next()[0].innerText;
        let info_text = post_info_description.get(info_header.toString().trim()) || 'No Information Found';
        document.getElementById('post_info_body').innerHTML = info_text;
        recordSimModalInputs('digital-literacy_infoModal');
        e.stopPropagation();
    });

    $('.flag.button').on('click', function() {
        $('.ui.modal input[type=checkbox]').prop('checked', false);
        recordSimModalInputs('digital-literacy_flagModal');
    })
}

function customErrorCheck() {
    if (closedHints != numberOfHints) {
        //show the message normally the first time
        if ($('#clickAllDotsWarning').is(":hidden")) {
            $('#clickAllDotsWarning').transition('fade');
            $('#cyberTransButton').css("margin-bottom", "10em");
        } else {
            //otherwise, bounce the message to draw attention to it
            $('#clickAllDotsWarning').transition('bounce');
        }
    }
    if (!clickedArticle) {
        $('#clickArticleLinkWarning').show();
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

function customOnHintCloseFunction() {
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
        if (clickedArticle) {
            $("#cyberTransButton").addClass("green");
        }
    }
}
