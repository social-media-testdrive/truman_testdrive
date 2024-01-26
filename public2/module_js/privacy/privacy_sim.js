const stepsList = [{
        element: '#step1',
        intro: `Click "Next" to begin!`,
        position: 'left',
        scrollTo: 'tooltip',
        audioFile: ['']
    },
    {
        element: '#step1',
        intro: `Now that you have learned about different privacy settings, let’s
    practice how to change them!`,
        scrollTo: 'tooltip',
        position: 'left',
        audioFile: ['CUSML.7.6.1.mp3']
    },
    {
        element: '#step1',
        intro: `Click on "Done" and then look for the blue dots &nbsp;&nbsp;<a role='button' tabindex='0'
    class='introjs-hint'><div class='introjs-hint-dot'></div><div
    class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; to learn more...`,
        scrollTo: 'tooltip',
        position: 'left',
        audioFile: ['CUSML.7.6.2.mp3']
    }
];

const hintsList = [{
        hint: `If your account is on a “<i>Public</i>” setting, everyone on the
    internet can access your account and see what you post. Right now, it is set
    as a public account.`,
        element: '#hint1',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.6.3.mp3']
    },
    {
        hint: `Let’s try changing it to “<i>Private</i>” so that only people you
    approve would be able to see your posts. Slide the button over so
    “<i>Private account</i>” is selected.`,
        element: '#hint2',
        hintPosition: 'bottom-middle',
        audioFile: ['CUSML.7.6.4.mp3']
    },
    {
        hint: `This is where you can change who can contact you on the social media
    site. Try changing the settings to “<i>Friends</i>” or “<i>Friends of
    Friends</i>” so that strangers cannot comment on your posts or send you
    friend requests.`,
        element: '#hint3',
        hintPosition: 'top-middle',
        audioFile: ['CUSML.7.6.5.mp3']
    },
    {
        hint: `Use this setting to control how you share your location information.
    Right now, it is set so that you are putting your location on every post.`,
        element: '#hint4',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.7.6.6.mp3']
    },
    {
        hint: `You can try turning this off entirely, or restricting who can see
    your location information.`,
        element: '#hint5',
        hintPosition: 'middle-middle',
        audioFile: ['CUSML.7.6.7.mp3']
    }
];

$(window).on('load', function() {
    $('.ui.dropdown').dropdown('set selected', '0');
    let clickAction = false;

    // Defining multi-select onAdd and onRemove functions, triggered when a dropdown multi-select is changed
    $('.blocklistDropdown').dropdown({
        onAdd: function(addedValue, addedText, $addedChoice) {
            clickAction = true;
            $('#confirmContinueCheck').hide();
            const cat = {
                subdirectory1: 'sim',
                subdirectory2: 'privacy',
                inputField: 'blockList- add',
                absoluteTimestamp: Date.now(),
                inputText: addedValue
            };

            $.post("/privacyAction", {
                action: cat,
                actionType: 'privacy',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        },
        onRemove: function(addedValue, removedText, $removedChoice) {
            clickAction = true;
            $('#confirmContinueCheck').hide();
            const cat = {
                subdirectory1: 'sim',
                subdirectory2: 'privacy',
                inputField: 'blockList- remove',
                absoluteTimestamp: Date.now(),
                inputText: addedValue
            };

            $.post("/privacyAction", {
                action: cat,
                actionType: 'privacy',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        }
    });

    //Triggered when a dropdown select is changed
    $('.ui.selection.dropdown:not(.blocklistDropdown)').dropdown({
        onChange: function(value, text, $choice) {
            clickAction = true;
            $('#confirmContinueCheck').hide();
            const cat = {
                subdirectory1: 'sim',
                subdirectory2: 'privacy',
                inputField: $(this).find('input').attr('name'),
                absoluteTimestamp: Date.now(),
                inputText: text
            };

            $.post("/privacyAction", {
                action: cat,
                actionType: 'privacy',
                _csrf: $('meta[name="csrf-token"]').attr('content')
            });
        }
    });

    //Triggered when a toggle is changed
    $('.ui.toggle.checkbox input').change(function() {
        clickAction = true;
        $('#confirmContinueCheck').hide();
        const cat = {
            subdirectory1: 'sim',
            subdirectory2: 'privacy',
            inputField: $(this).attr('name'),
            absoluteTimestamp: Date.now(),
            inputText: $(this).is(':checked') ? "true" : "false"
        };

        $.post("/privacyAction", {
            action: cat,
            actionType: 'privacy',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
    });
});