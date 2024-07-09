var hintsList = [{
        hint: `Completa la información de tu perfil. Recuerda no debes compartir demasiados detalles sobre quién eres.`,
        element: '#generalStep',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.8.4.06.mp3']
    },
    {
        hint: `Comienza compartiendo un poco de información sobre ti. Siempre puedes agregar más información más adelante si es necesario.`,
        element: '#generalStep',
        hintPosition: 'top-right',
        audioFile: ['CUSML.8.4.07.mp3']
    }
];

function eventsAfterHints() {
    $(':input').on('input', function() {
        $('#confirmContinueCheck').hide();
    });
}

function customOnClickGreenContinue() {
    const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === "true";
    if (enableDataCollection) {
        actionArray = [];
        $('input[type=text], textarea[type=text], input[name="profilePhoto"]').each(function() {
            let cat = {};
            cat.inputField = $(this).attr('name');
            if (cat.inputField === 'profilePhoto') {
                cat.inputText = $(this).val() !== 'avatar-icon.svg' ? "true" : "false";
            } else {
                cat.inputText = $(this).val() !== "" ? "true" : "false";
            }
            cat.subdirectory1 = 'sim2';
            cat.subdirectory2 = 'accounts';
            cat.absoluteTimestamp = Date.now();

            const jqxhr = $.post("/accountsAction", {
                action: cat,
                actionType: 'accounts',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
            actionArray.push(jqxhr);
        });

        return Promise.all(actionArray);
    }
}