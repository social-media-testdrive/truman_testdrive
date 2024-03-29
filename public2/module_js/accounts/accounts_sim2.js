const hintsList = [{
        hint: `Fill out the profile information. Remember to not share too many
        details about who you are.`,
        element: '#generalStep',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.8.4.06.mp3']
    },
    {
        hint: `Start off by sharing only a little bit of information about
        yourself. You can always add more information later if you need to.`,
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
            let cat = {
                inputField: $(this).attr('name'),
                subdirectory1: 'sim2',
                subdirectory2: 'accounts',
                absoluteTimestamp: Date.now()
            };
            if (cat.inputField === 'profilePhoto') {
                cat.inputText = $(this).val() !== 'avatar-icon.svg' ? "true" : "false";
            } else {
                cat.inputText = $(this).val() !== "" ? "true" : "false";
            }

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