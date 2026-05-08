var stepsList = [{
        element: '#blueDotStep',
        intro: `¡Haz clic en "Siguiente" para comenzar!`,
        position: 'right',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: '#blueDotStep',
        intro: `Esta es la línea de tiempo de redes sociales de Stacy, una estudiante de secundaria.
    Uno de sus pasatiempos favoritos es tocar la guitarra.`,
        scrollTo: 'tooltip',
        position: 'right',
        audioFile: ['CUSML.2.5.1.mp3']
    },
    {
        element: '#blueDotStep',
        intro: `Últimamente ha estado viendo tutoriales de guitarra en YouTube y
    buscando marcas de guitarra geniales en Google.`,
        scrollTo: 'tooltip',
        position: 'right',
        audioFile: ['CUSML.2.5.2.mp3']
    },
    {
        element: '#blueDotStep',
        intro: `En esta actividad verás cómo funcionan los anuncios dirigidos.
    Haz clic en "Listo" y después busca los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'>
    <div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a>
    &nbsp; &nbsp; &nbsp; &nbsp; para saber más...`,
        scrollTo: 'tooltip',
        position: 'right',
        audioFile: ['CUSML.2.5.3.mp3']
    }

];

var hintsList = [{
        hint: `Esta es una publicación patrocinada de una empresa de guitarras. Verás que
    se parece mucho a otras publicaciones en redes sociales.`,
        element: '#hint1',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.2.5.4.mp3']
    },
    {
        hint: `Prueba hacer clic en los tres puntos y después en «¿Por qué veo este anuncio?» para
    saber más sobre por qué el sitio decidió mostrarte el anuncio.`,
        element: '#hint2',
        hintPosition: 'bottom-right',
        audioFile: ['CUSML.2.5.5.mp3']
    },
    {
        hint: `Una manera de saber que esta publicación es un anuncio es buscar
    palabras como «ANUNCIO», «Publicidad», «Promocionado» o «Patrocinado».`,
        element: '#hint3',
        hintPosition: 'middle-right',
        audioFile: ['CUSML.2.5.6.mp3']
    },
    {
        hint: `¡Parece otra publicación patrocinada! Haz clic en los tres puntos y después en
    «Ocultar anuncio» si no quieres ver el anuncio, o en «Reportar anuncio»
    si es inapropiado.`,
        element: '#hint4',
        hintPosition: 'bottom-right',
        audioFile: ['CUSML.2.5.7.mp3']
    },
    {
        hint: `¡Recuerda que siempre puedes ignorar el anuncio!`,
        element: '#hint5',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.2.5.8.mp3']
    }
];

let clickPost = false;

function eventsAfterHints() {
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    //Activate the dropdown
    $('.ui.dropdown.icon.item').dropdown({
        duration: 300
    });

    $('.ui.accordion').accordion();

    //Adding functionality to the dropdown
    $('.ui.dropdown.icon.item').on('click', function () {
        clickPost = true;
        $('#confirmContinueCheck').hide();
    });
    $('.ui.dropdown.icon.item')
        .dropdown({
            onChange: function () {
                var dropdownSelection = $(this).data().value;
                if (dropdownSelection == 0) {
                    $(".inverted.dimmer").css("background-color", "rgba(211,211,211,0.95)");
                    //hide the post
                    $('.ui.modal input[type=checkbox]').prop('checked', false);
                    var post = $(this).closest(".ui.fluid.card.dim");
                    var postID = post.attr("postID");
                    post.find(".ui.inverted.dimmer.notflag").dimmer({
                            closable: false
                        }).dimmer('show')
                        //repeat to ensure its closable
                    post.find(".ui.inverted.dimmer.notflag").dimmer({
                            closable: true
                        })
                        .dimmer('show');
                    if (enableDataCollection) {
                        $.post("/feed", {
                            actionType: 'guided activity',
                            postID: postID,
                            flag: Date.now(),
                            modual: 'targeted',
                            _csrf: $('meta[name="csrf-token"]').attr('content')
                        });
                    }
                    //open hide ad Modal
                    recordSimModalInputs('targeted_hideAdModal');

                } else if (dropdownSelection == 1) {
                    //flag the post
                    var post = $(this).closest(".ui.fluid.card.dim");
                    var postID = post.attr("postID");
                    post.find(".ui.dimmer.flag").dimmer({
                            closable: false
                        })
                        .dimmer('show');
                    //repeat to ensure its closable
                    post.find(".ui.dimmer.flag").dimmer({
                            closable: true
                        })
                        .dimmer('show');
                    if (enableDataCollection) {
                        $.post("/feed", {
                            actionType: 'guided activity',
                            postID: postID,
                            flag: Date.now(),
                            modual: 'targeted',
                            _csrf: $('meta[name="csrf-token"]').attr('content')
                        });
                    }
                } else if (dropdownSelection == 2) {
                    //get the company name to dynamically use in the modal
                    var companyName = $(this).closest(".ui.fluid.card.dim").find("#companyName").text();
                    //open info modal
                    $("#whyAmISeeingThisAdModal .content").html(
                        "<p>Stacy ve este anuncio porque <b>" + companyName + "</b> quiso llegar a personas interesadas en <b>guitarras</b>.</p>" +
                        "<p>Esto se basa en lo que Stacy hace en TestDrive: por ejemplo, las páginas que ha visitado y los términos de búsqueda en los que ha hecho clic.</p>" +
                        "<br>" +
                        "<div class='actions'>" +
                        "<div class='ui positive right labeled icon button'>Listo" +
                        "<i class='checkmark icon'></i></div></div>"
                    );
                    recordSimModalInputs('targeted_whySeeingAdModal');

                }
            }
        });
};
